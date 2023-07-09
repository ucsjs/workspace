import { Flow } from "../core";
import { IBlueprintControllerCatch } from "../interfaces";

export abstract class BlueprintController {
    protected flow: Flow;

    protected catchExeption: IBlueprintControllerCatch;
    
    protected catch(message: string, scope: string){
        this.catchExeption = { message, scope };
    }

    public getFlow(){
        return this.flow;
    }

    /*protected async getOrCreateCaching(caching: CachingService, key: string, createPromise: Promise<IBlueprintData>){
        return (this.catchExeption) ? this.catchExeption : await caching.get(key).then((data) => data).catch(() => {
            return new Promise((resolve, reject) => {
                createPromise.then(async (data) => {
                    if(!data.data.error){
                        let dataHTTP = HTTPUtils.DataToHTTP(data); 

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
                            message: data.data.error, 
                            scope: `${data.parent.header.namespace}::${data.parent.id}` 
                        });
                    }
                });
            });            
        });  
    }*/

    created(){ }
}