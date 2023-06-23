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

    public setup() {
        this.propertiesIndex.clear();

        if(this.header.properties && this.header.properties.length > 0) {
            for(let property of this.header.properties)
                this.propertiesIndex.set(property.name, property);
        }

        if(this.header.events && this.header.events.length > 0){
            for(let event of this.header.events)
                this.events.set(event.name, event.callback);
        }

        if(this.header.triggers && this.header.triggers.length > 0){
            for(let trigger of this.header.triggers)
                this.triggers.set(trigger.name, new Subject<IBlueprintTrigger>());
        }
                
        if(this.settings) {
            for(let property in this.propertiesIndex){
                if(this.settings[property])
                    this.propertiesIndex[property].value = this.settings[property];
            }
        }
    }
      
    public next(data: IBlueprintData, name: string = "_default"): Blueprint {
        if(this.outputs.has(name)){
            let output = this.outputs.get(name);
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

            output?.subscribe((data: IBlueprintData) => {
                if(data){
                    if(blueprint.receive && typeof(blueprint.receive) == "function")
                        blueprint.receive(data, inputName);
                }                    
            });
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

    public getParameter<T>(key: string, defaultValue: T): T;

    public getParameter(key: string, defaultValue: any): any | null {
        let returnValue = defaultValue;

        if(this.propertiesIndex.has(key)) {
            let property = this.propertiesIndex.get(key);
            returnValue = (property.value && typeof property.value !== "boolean") ? this.header.properties[key].value : property.default;

            if(!returnValue)
                returnValue = (!returnValue && returnValue !== false && defaultValue) ? defaultValue : null;
        }

        return returnValue;
    }

    public trigger(key: string = "_default") {
        if(this.triggers.has(key)) {
            return false;
        }
        else{
            this.triggers.set(key, new Subject<IBlueprintTrigger>());
            return true;
        }
    }

    public emit(issuer: Blueprint, key: string = "_default") {
        if(this.triggers.has(key)){
            Logger.log(`${issuer.header.namespace} emit ${key}` , "Blueprint");
            let trigger = this.triggers.get(key);
            trigger.next({ blueprint: this, name: issuer.header.namespace, timeout: new Date().getTime() });
        }
        else{
            Logger.log(`Trigger ${key} dont exists` , issuer.header.namespace);
        }
    }

    public triggerIdentify(trigger: IBlueprintTrigger): IBlueprintData{
        return new BlueprintData(trigger.blueprint, null, { value: `${trigger.name}::${trigger.blueprint.id}::${trigger.timeout}` })
    }

    public incorporate(): { [key: string]: IBlueprintIncorporate } { return {}; }
    
    public async bind(flow: Flow) {};

    static execute(){
        let instance = this.getInstance();
        
        GlobalRegistry.load().then((scope) => scope.createFlow(instance.incorporate())
        .buildListenAndExecute(flow => instance.bind(flow)));
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