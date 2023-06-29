import { Logger } from "@ucsjs/common";
import { BlueprintDataError } from "../dto";
import { IBlueprintData } from "../interfaces";

export class HTTPUtils {
    static DataToHTTP(result: IBlueprintData){
        if(result instanceof BlueprintDataError){
            Logger.error(result.message, "HTTPUtils");
            throw new Error(result.message);
        }
        else {
            return (result.value) ? result.value : JSON.parse(JSON.stringify(result.data), (key, value) => {
                if(value !== null) return value
            });
        }
    }
}