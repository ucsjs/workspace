import { Logger } from "@ucsjs/common";
import { BlueprintDataError } from "../dto";
import { IBlueprintData } from "../interfaces";

export class HTTPUtils {
    static DataToHTTP(data: IBlueprintData){
        if(data instanceof BlueprintDataError){
            Logger.error(data.message, "HTTPUtils");
            throw new Error(data.message);
        }
        else {
            return data.value;
        }
    }
}