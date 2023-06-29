import { BehaviorSubject, Subject } from "rxjs";
import { v4 as uuidv4 } from 'uuid'; 
import { Singleton, Logger, isObject, isFunction } from "@ucsjs/common";

import { BLUEPRINT_INPUTS, BLUEPRINT_TRIGGERS } from "../constants";
import { BlueprintData, BlueprintDataError } from "../dto";
import { GlobalRegistry } from "../utils";
import { Types, TypeToString } from "../enums";

import { 
    IBlueprint, 
    IBlueprintData, 
    IBlueprintHeader, 
    IBlueprintIncorporate, 
    IBlueprintInjectData, 
    IBlueprintInput, 
    IBlueprintProperties, 
    IBlueprintSettings, 
    IBlueprintTransform, 
    IBlueprintTrigger 
} from "../interfaces";

import Flow from "./flow";

export class Blueprint extends Singleton implements IBlueprint {

    public id: string;
    public settings: IBlueprintSettings | undefined;
    protected outputs: Map<string, BehaviorSubject<any>> = new Map();
    protected inputs: Map<string, BlueprintInput> = new Map();
    protected triggers: Map<string, Subject<IBlueprintTrigger>> = new Map();
    protected events: Map<string, Function> = new Map();
    private started = false;
    protected scope: Map<string, any> = new Map();
    protected transforms: Map<string, IBlueprintTransform[]> = new Map();

    header: IBlueprintHeader = {
        useInEditor: false,
        namespace: "Blueprint",
        group: "Common"
    };

    propertiesIndex: Map<string, IBlueprintProperties> = new Map();

    constructor(settings?: IBlueprintSettings, transforms?: { [key: string]: IBlueprintTransform[] }) {
        super();       
         
        this.id = uuidv4();

        if(settings) 
            this.settings = settings;

        if(transforms){
            for(let key in transforms){
                if(!this.transforms.has(key))
                    this.transforms.set(key, transforms[key]);
            }
        }
    }

    public async setup() {
        this.propertiesIndex.clear();

        const inputBinds = Reflect.getMetadata(BLUEPRINT_INPUTS, this);
        const triggersBinds = Reflect.getMetadata(BLUEPRINT_TRIGGERS, this);

        if(this.header.inputs && this.header.inputs.length > 0) {
            for(let input of this.header.inputs){
                let callback = (input.callback && typeof input.callback === "function") ? input.callback.bind(this) : null;

                if(!callback)
                    callback = inputBinds.has(input.name) ? inputBinds.get(input.name).bind(this) : null;

                if(callback)
                    this.input(callback, input.name, input);
            }
        }

        if(this.header.outputs && this.header.outputs.length > 0){
            for(let output of this.header.outputs)
                this.output(output.name);
        }

        if(this.header.properties && this.header.properties.length > 0) {
            for(let property of this.header.properties){
                if(!this.propertiesIndex.has(property.name))
                    this.propertiesIndex.set(property.name, property);
            }  
        }

        if(this.header.events && this.header.events.length > 0){
            for(let event of this.header.events){
                let callback = (event.callback && typeof event.callback === "function") ? event.callback.bind(this) : null;

                if(!callback)
                    callback = (triggersBinds.has(event.name)) ? triggersBinds.get(event.name).bind(this) : null;

                this.event(callback, event.name); 
            } 
        }

        if(this.header.triggers && this.header.triggers.length > 0){
            for(let trigger of this.header.triggers)
                this.trigger(trigger.name);
        }
                
        if(this.settings) {
            for(let property of Array.from(this.propertiesIndex)){
                if(this.settings[property[0]] && this.propertiesIndex.has(property[0])){
                    let propertyValue = this.propertiesIndex.get(property[0]);
                    propertyValue.value = this.settings[property[0]];
                    this.propertiesIndex.set(property[0], propertyValue);
                }
            }
        }

        this.started = true;
    }
      
    public next(data: IBlueprintData, name: string = "_default"): Blueprint {
        if(this.started && this.outputs.has(name)){
            Logger.log(`Dispatched to ${name}`, `Blueprint::${this.header.namespace}`);

            let output = this.outputs.get(name);

            if(output && data != null && data != undefined)
                output?.next(data);
            else if(!output)
                Logger.error(`The output ${name} is not present in the blueprint configuration.`, `Blueprint::${this.header.namespace}`);
            else
                Logger.error(`The amount informed for transfer cannot be null or undefined`, `Blueprint::${this.header.namespace}`);
        }
        else if(!this.started){
            Logger.error(`Error when trying to fire data because the blueprint has not been started yet.`, `Blueprint::${this.header.namespace}`);
        }
        else if(!this.outputs.has(name)){
            Logger.error(`The output ${name} is not present in the blueprint configuration.`, `Blueprint::${this.header.namespace}`);
        }

        return this;
    }

    public nextAll(data: IBlueprintData): Blueprint {
        this.outputs.forEach((output) => {
            output?.next(data);
        });

        return this;
    }

    public output<T extends IBlueprintData>(name: string = "_default"): boolean {
        if(this.outputs.has(name)) {
            return false;
        }
        else{
            this.outputs.set(name, new BehaviorSubject<T>(undefined!));
            return true;
        }
    }

    public input(callback: Function, name: string = "_default", header: IBlueprintInput): boolean {
        if(this.inputs.has(name)) {
            return false;
        }
        else {
            this.inputs.set(name, new BlueprintInput(callback, header));
            return true;
        }
    }

    public event(callback: Function, name: string = "_default"): boolean {
        if(this.events.has(name)) {
            return false;
        }
        else {
            this.events.set(name, callback);
            return true;
        }
    }

    public subscribe(blueprint: IBlueprint, outputName: string = "_default", inputName: string = "_default"): void{
        if(this.outputs.has(outputName)){
            let output = this.outputs.get(outputName);

            if(output) {
                output.subscribe((data: IBlueprintData) => {
                    if(data) {
                        if(blueprint.receive && typeof(blueprint.receive) == "function")
                            blueprint.receive(data, inputName);
                        else 
                            throw new Error(`Blueprint ${blueprint.header.namespace} has no function to receive data`);
                    }                    
                });
            }
            else {
                throw new Error(`Output '${outputName}' not exists in ${this.header.namespace}`);
            }
        }
    }

    public subscribePromise(outputName: string = "_default"): Promise<IBlueprintData> {
        return new Promise((resolve, reject) => {
            if(this.outputs.has(outputName)){
                let output = this.outputs.get(outputName);

                if(output) {
                    output?.subscribe(async (data) => { 
                        if(data !== null && data !== undefined)
                            resolve(data);
                    });
                }                    
                else {
                    reject(`Output ${outputName} does not exist`);   
                }                                     
            }       
            else{
                reject(`Output ${outputName} does not exist`);
            }
        })
    }

    public intercept(outputName: string = "_default"): Promise<any>{
        return new Promise((resolve, reject) => {
            if(this.outputs.has(outputName)){
                let output = this.outputs.get(outputName);
                output?.subscribe((data: IBlueprintData) => resolve(data));
            }
            else{
                reject();
                throw new Error(`Output '${outputName}' not exists in ${this.header.namespace}`);
            }
        });
    }

    public interceptOnPromise(outputName: string = "_default"){
        const _this = this as IBlueprint;
        
        return new Promise((resolve, reject) => {
            this.intercept(outputName).then((data) => {
                resolve(data);
            }).catch((err) => reject(err));

            if(_this.build && typeof(_this.build) == "function")
                _this.build();

            if(_this.execute && typeof(_this.execute) == "function")
                _this.execute();
        }); 
    }

    public listen(blueprint: IBlueprint, triggerName: string = "_default", eventName: string = "_default"){
        if(this.triggers.has(triggerName)){
            Logger.log(`listen ${this.header.namespace}::${eventName} -> ${blueprint.header.namespace}::${triggerName}`, "Blueprint");
            let trigger = this.triggers.get(triggerName);
            trigger?.subscribe({ next: (value) => blueprint.dispatch(value, eventName) });
        }
    }

    public dispatch(triggerData: IBlueprintTrigger, eventName: string = "_default") {
        if(this.events.has(eventName)){
            let event = this.events.get(eventName);

            if(typeof event === "function")
                event.apply(this, [triggerData]);
        }
    }

    public generateData(blueprint: Blueprint, data: any): IBlueprintData {
        const mergedSettings: IBlueprintSettings = {
            ...(this.settings || {}),
            ...(blueprint.settings || {}),
        };

        let dataParsed = { value: null };

        if(Array.isArray(data) || typeof data === "boolean"){
            dataParsed.value = data;
        }
        else{
            switch(typeof data){
                case "object": dataParsed = { ...dataParsed, ...data }; break;
                default: dataParsed.value = data; break;
            }
        }

        return new BlueprintData(blueprint, mergedSettings, dataParsed);
    }

    public generateError(blueprint: Blueprint, message: string, scope: string): IBlueprintData{
        Logger.error(message, scope);
        let error = new BlueprintDataError(blueprint, message, scope);
        return error;
    }

    public async receive(data: IBlueprintData, inputName: string = "_default"): Promise<void> {
        Logger.log(`Receive data from ${data.parent.header.namespace} to ${inputName}`, `Blueprint::${this.header.namespace}`);

        if(this.inputs.has(inputName)){
            let input = this.inputs.get(inputName);

            if(input && data && data.value){
                if(this.transforms.has(inputName)){
                    const transforms = this.transforms.get(inputName);

                    for(let transform of transforms) {
                        const blueprint = await GlobalRegistry.retrieve(transform.blueprint);

                        if(data.value && data.value[transform.key]){
                            
                            await blueprint.injectArgs([
                                { 
                                    input: transform.input, 
                                    value: data.value[transform.key] 
                                }
                            ]);

                            data.value[transform.key] = await blueprint.subscribePromise(transform.output);
                        }                        
                    }     
                }

                if(data instanceof BlueprintDataError){
                    Logger.error(`Recive error ${data.message}...`, `${this.header.namespace}::${this.id}`);
                    this.nextAll(data);
                }
                else if(this.validateInputData(input.header, data)){
                    input.callback.apply(this, [data]);
                }                    
                else{
                    Logger.error(
                        `Input ${this.header.namespace}::${inputName} only accepts type '${TypeToString(input.header.type)}' but received data of type '${typeof data.value}'`, 
                        `Blueprint::${this.header.namespace}`
                    );
                }
            }                
        }
        else{
            Logger.error(`Input '${inputName}' dont not exists`, `Blueprint::${this.header.namespace}`);
        }
    }

    public getParameter<T>(name: string, defaultValue: T): T;

    public getParameter(name: string, defaultValue: any): any | null {
        let returnValue = defaultValue;

        if(this.propertiesIndex.has(name)) {
            let property = this.propertiesIndex.get(name);
            returnValue = (property.value && typeof property.value !== "boolean") ? property.value : property.default;

            if(!returnValue)
                returnValue = (!returnValue && returnValue !== false && defaultValue) ? defaultValue : null;
        }

        return returnValue;
    }

    public getParameterObject(name: string, fieldKey: string): object | null {
        let returnValue = {};

        if(this.propertiesIndex.has(name)) {
            let property = this.propertiesIndex.get(name);
            let tmpValue = (property.value && typeof property.value !== "boolean") ? property.value : property.default;

            if(Array.isArray(tmpValue)){  
                for(let valueObject of tmpValue)
                    returnValue[valueObject[fieldKey]] = { ...valueObject };      

                return returnValue;
            }
            else{
                return null
            }
        }
        else{
            return null;
        }
    }
    
    public trigger(name: string = "_default") {
        if(this.triggers.has(name)) {
            return false;
        }
        else{
            this.triggers.set(name, new Subject<IBlueprintTrigger>());
            return true;
        }
    }

    public emit(issuer: Blueprint, name: string = "_default") {
        if(this.triggers.has(name)){
            Logger.log(`${issuer.header.namespace} emit ${name}` , "Blueprint");
            let trigger = this.triggers.get(name);
            trigger.next({ blueprint: this, name: issuer.header.namespace, timeout: new Date().getTime() });
        }
        else{
            Logger.log(`Trigger ${name} dont exists`, issuer.header.namespace);
        }
    }

    public triggerIdentify(trigger: IBlueprintTrigger): IBlueprintData{
        return new BlueprintData(trigger.blueprint, null, { value: `${trigger.name}::${trigger.blueprint.id}::${trigger.timeout}` })
    }

    public incorporate(): { [name: string]: IBlueprintIncorporate } { return {}; }
    
    public async bind(flow: Flow) {};

    public injectArgs(args?: IBlueprintInjectData[]): Promise<void>{
        return new Promise(async (resolve, reject) => {
            if(args && Array.isArray(args)) {
                for(let arg of args) {
                    if(this.inputs.has(arg.input)){
                        const input = this.inputs.get(arg.input);
    
                        if(this.transforms.has(arg.input)){
                            const transforms = this.transforms.get(arg.input);

                            for(let transform of transforms) {
                                const blueprint = await GlobalRegistry.retrieve(transform.blueprint);

                                if(arg.value && arg.value[transform.key]){
                                    
                                    await blueprint.injectArgs([{ 
                                        input: transform.input, 
                                        value: arg.value[transform.key] 
                                    }]);

                                    arg.value[transform.key] = (await blueprint.subscribePromise(transform.output))?.value;
                                }                        
                            } 

                            input.callback.apply(this, [this.generateData(this, arg)]);
                            resolve();
                        }
                        else{
                            input.callback.apply(this, [this.generateData(this, arg)]);
                            resolve();
                        }
                    }                        
                    else{
                        Logger.error(`Error to inject ${arg.input}(${arg.value})`, `Blueprint::${this.header.namespace}`);
                        reject(`Error to inject ${arg.input}(${arg.value})`);
                    }
                }
            }
        });
    }

    public validateInputData(header: IBlueprintInput, data: IBlueprintData): boolean{
        switch(header.type){
            case Types.String: return (typeof data.value === "string");
            case Types.Array: return Array.isArray(data.value);
            case Types.Boolean: return (typeof data.value === "boolean");
            case Types.Int: return (Number.isInteger(data.value));
            case Types.Float: return (Number.isFinite(data.value));
            case Types.Function: return isFunction(data.value);
            case Types.Object: return isObject(data.value);
        }

        return true;
    }

    static execute(){
        try{
            let instance = this.getInstance();
        
            GlobalRegistry.load().then(async (scope) => scope.createFlow(instance.incorporate())
            .then(flow => flow.buildListenAndExecute(flow => instance.bind(flow))));
        }
        catch(e){
            Logger.error(e, "Blueprint");
        }        
    }
}

export class BlueprintInput {
    callback: Function;

    header: IBlueprintInput;

    constructor(callback: Function, header: IBlueprintInput){
        this.callback = callback;
        this.header = header;
    }
}