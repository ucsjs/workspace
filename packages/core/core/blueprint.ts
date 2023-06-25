import { BehaviorSubject, Subject } from "rxjs";
import { v4 as uuidv4 } from 'uuid'; 
import { Singleton, Logger } from "@ucsjs/common";

import { BlueprintData } from "../dto";
import { GlobalRegistry } from "../utils";

import { 
    IBlueprint, IBlueprintData, IBlueprintHeader, IBlueprintIncorporate, 
    IBlueprintProperties, IBlueprintSettings, IBlueprintTrigger 
} from "../interfaces";

import Flow from "./flow";

export class Blueprint extends Singleton implements IBlueprint{

    public id: string;
    public settings: IBlueprintSettings | undefined;
    protected outputs: Map<string, BehaviorSubject<any>> = new Map();
    protected inputs: Map<string, BlueprintInput> = new Map();
    protected triggers: Map<string, Subject<IBlueprintTrigger>> = new Map();
    protected events: Map<string, Function> = new Map();
    private started = false;

    header: IBlueprintHeader = {
        useInEditor: true,
        namespace: "Blueprint",
        group: "Common"
    };

    propertiesIndex: Map<string, IBlueprintProperties> = new Map();

    constructor(settings?: IBlueprintSettings) {
        super();        
        this.id = uuidv4();
        if(settings) this.settings = settings;
    }

    public async setup() {
        this.propertiesIndex.clear();

        if(this.header.inputs && this.header.inputs.length > 0) {
            for(let input of this.header.inputs)
                this.input(input.callback, input.name);
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
            for(let event of this.header.events)
                this.event(event.callback, event.name); 
        }

        if(this.header.triggers && this.header.triggers.length > 0){
            for(let trigger of this.header.triggers)
                this.trigger(trigger.name);
        }
                
        if(this.settings) {
            for(let property in this.propertiesIndex){
                if(this.settings[property])
                    this.propertiesIndex[property].value = this.settings[property];
            }
        }

        this.started = true;
    }
      
    public next(data: IBlueprintData, name: string = "_default"): Blueprint {
        if(this.started && this.outputs.has(name)){
            let output = this.outputs.get(name);

            if(output && data.value != null && data.value != undefined)
                output?.next(data);
        }

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

    public input(callback: Function, name: string = "_default"): boolean {
        if(this.inputs.has(name)) {
            return false;
        }
        else{
            this.inputs.set(name, new BlueprintInput(callback));
            return true;
        }
    }

    public event(callback: Function, name: string = "_default"): boolean {
        if(this.events.has(name)) {
            return false;
        }
        else{
            this.events.set(name, callback);
            return true;
        }
    }

    public subscribe(blueprint: IBlueprint, outputName: string = "_default", inputName: string = "_default"): void{
        if(this.outputs.has(outputName)){
            let output = this.outputs.get(outputName);

            if(output){
                output?.subscribe((data: IBlueprintData) => {
                    if(data){
                        if(blueprint.receive && typeof(blueprint.receive) == "function")
                            blueprint.receive(data, inputName);
                    }                    
                });
            }
            else{
                Logger.error(`Output '${outputName}' not exists in ${this.header.namespace}`);
            }
        }
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

        switch(typeof data){
            case "object": dataParsed = { ...dataParsed, ...data }; break;
            default: dataParsed.value = data; break;
        }

        return new BlueprintData(blueprint, mergedSettings, dataParsed);
    }

    public receive(data: IBlueprintData, inputName: string = "_default"): void {
        if(this.inputs.has(inputName)){
            let input = this.inputs.get(inputName);

            if(input)
                input.receive(data);
        }
    }

    public getParameter<T>(name: string, defaultValue: T): T;

    public getParameter(name: string, defaultValue: any): any | null {
        let returnValue = defaultValue;

        if(this.propertiesIndex.has(name)) {
            let property = this.propertiesIndex.get(name);
            returnValue = (property.value && typeof property.value !== "boolean") ? this.header.properties[name].value : property.default;

            if(!returnValue)
                returnValue = (!returnValue && returnValue !== false && defaultValue) ? defaultValue : null;
        }

        return returnValue;
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
            Logger.log(`Trigger ${name} dont exists` , issuer.header.namespace);
        }
    }

    public triggerIdentify(trigger: IBlueprintTrigger): IBlueprintData{
        return new BlueprintData(trigger.blueprint, null, { value: `${trigger.name}::${trigger.blueprint.id}::${trigger.timeout}` })
    }

    public incorporate(): { [name: string]: IBlueprintIncorporate } { return {}; }
    
    public async bind(flow: Flow) {};

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

    constructor(callback: Function){
        this.callback = callback;
    }

    public receive(data: IBlueprintData){
        if(this.callback)
            this.callback(data);
    }
}