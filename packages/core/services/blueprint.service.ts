import * as express from 'express';
import { Injectable } from "@ucsjs/common";

import { 
    Flow, 
    HTTPUtils, 
    IBlueprintControllerCatch, 
    IBlueprintData, 
    IBlueprintInjectData 
} from "../index";

import { CachingService } from "./caching.service";

@Injectable()
export class BlueprintService {
    public async intercept(
        flow: Flow, 
        res: express.Response, 
        blueprintName: string, 
        outputName: string, 
        args?: IBlueprintInjectData[],
        caching?: CachingService,
        cachingKey?: string       
    ): Promise<any>{
        if(flow){
            if(caching && cachingKey){
                return (flow) ? this.getOrCreateCaching(
                    caching, 
                    cachingKey, 
                    flow.interceptOnPromise(blueprintName, outputName, args)
                ) : res.status(500).send("The system is still loading...");
            }
            else{
                return (await flow.interceptOnPromise(blueprintName, outputName, args)).value;
            }
        }
        else{
            throw new Error(`Error when trying to run a flow`);
        }
    }

    public async insertDataAndIntercept(
        flow: Flow, 
        res: express.Response, 
        blueprintName: string, 
        outputName: string, 
        args?: IBlueprintInjectData[],
        caching?: CachingService,
        cachingKey?: string   
    ){
        return (flow) ? flow.interceptOnPromise(blueprintName, outputName, args)
        .then((result: IBlueprintData) => {
            if(result.data.error) throw new Error(result.data.error);
            else {
                try{ caching.del(cachingKey + result.data.value._id); } 
                catch(e){}     
                           
                return result.data;
            }            
        }).catch((err) => {
            throw new Error(`An error occurred when trying to add the record: ${err.message}`);
        }) : res.status(500).send("The system is still loading...");
    }

    protected async getOrCreateCaching(
        caching: CachingService, 
        key: string, 
        createPromise: Promise<IBlueprintData>
    ){
        return await caching.get(key)
        .then((data) => data)
        .catch(() => {
            return new Promise((resolve, reject) => {
                createPromise.then(async (result) => {
                    if(result && result.data && !result.data.error){
                        let dataHTTP = HTTPUtils.DataToHTTP(result); 

                        if(dataHTTP){
                            await caching.set(key, dataHTTP);
                            resolve(dataHTTP);
                        }
                        else{
                            reject({ 
                                message: "It was not possible to return data from the given function", 
                                scope: "BlueprintController" 
                            } as IBlueprintControllerCatch);
                        }
                    }
                    else{
                        reject({ 
                            message: result.data?.error, 
                            scope: `${result.parent.header.namespace}::${result.parent.id}` 
                        });
                    }
                });
            });            
        });  
    }
}