import mongoose from "mongoose";
import { Blueprint, BlueprintDataError, IBlueprintData } from "@ucsjs/core";
import { Logger } from "@ucsjs/common";

export class MongoDBBlueprint extends Blueprint {
    protected model: mongoose.Model<any>;

    protected query: object;

    protected queryById: mongoose.Types.ObjectId;

    public isMongooseModel(data: IBlueprintData): boolean {
        return (
            data && data.value &&
            typeof data.value === "function" && 
            typeof data.value.findOne === "function" && 
            typeof data.value.create === "function" 
        );
    }

    public validModel(data: IBlueprintData, scope: string) : Promise<void>{
        return new Promise((resolve, reject) => {
            if(this.isMongooseModel(data)) {
                resolve();
            }
            else if(data instanceof BlueprintDataError){
                Logger.error(`Recive error ${data.message}...`, scope);
                reject(data);
            }
            else {
                Logger.error(`The value entered is not a Mongoose template`, scope);
                reject(this.generateError(this, `The value entered is not a Mongoose template`, scope));
            } 
        });
    }

    public validObject(data: IBlueprintData, scope: string): Promise<void>{
        return new Promise((resolve, reject) => {
            if(data && data.value && typeof data.value === "object") {
                resolve();
            }
            else if(data instanceof BlueprintDataError){
                Logger.error(`Recive error ${data.message}...`, scope);
                reject(data);
            }
            else {
                Logger.error(`The entered value is not a valid object`, scope);
                this.next(this.generateError(this, `The entered value is not a valid object`, scope), "result");
            }
        });
    }

    public receiveModel(data: IBlueprintData, outputName: string){
        this.validModel(data, `${this.header.namespace}::${this.id}`).then(() => {
            this.model = data.value;
            this.run();
        })
        .catch((err: IBlueprintData) => {
            this.next(err, outputName);
        }); 
    }

    public receiveQuery(data: IBlueprintData, outputName: string){
        this.validObject(data, `${this.header.namespace}::${this.id}`).then(() => {
            this.query = data.value;
            this.run();
        })
        .catch((err: IBlueprintData) => {
            this.next(err, outputName);
        }); 
    }

    public receiveId(data: IBlueprintData, outputName: string){
        try{
            if(data && data.value && typeof data.value  === "string") {
                this.queryById = new mongoose.Types.ObjectId(data.value);
                this.run();
            }
            else {
                this.next(
                    this.generateError(this, `The given id is not in the correct type to be converted to an ObjectId`, `${this.header.namespace}::${this.id}`), 
                    outputName
                );
            }
        }
        catch(e){
            this.next(
                this.generateError(this, e.message, `${this.header.namespace}::${this.id}`), 
                outputName
            );
        }
    }

    public run(){}
}