import { hasher } from "node-object-hash";
import { Singleton } from "../abstracts";
import { Logger } from "../services";
const hashCoerce = hasher({ coerce: true });

export class IntegrityControl extends Singleton {
    private integrityList = new Map<any, string>();
    private integrityByRef = new Map<string, string>();

    public static registry(obj: any, ref: string = ""){
        const integrityControl = IntegrityControl.getInstance();

        //Logger.debug(`${typeof obj} ${hashCoerce.hash(obj).substring(0,5)}`, "IntegrityControl");

        if(ref && ref !== ""){
            //console.log(`${ref} -> ${hashCoerce.hash(obj)}`);

            if(!integrityControl.integrityByRef.has(ref)){
                integrityControl.integrityByRef.set(ref, hashCoerce.hash(obj));
            }
            else {
                const hash = integrityControl.integrityByRef.get(ref);
                const newHash = hashCoerce.hash(obj);
    
                if(hash != newHash && process.env.NODE_ENV === "dev")
                    Logger.debug(`Change ${ref} ${hash.substring(0,5)}::${newHash.substring(0,5)}`, "IntegrityControl");

                integrityControl.integrityByRef.set(ref, hashCoerce.hash(obj));
            }
        }
        else{
            if(!integrityControl.integrityList.has(obj)){
                integrityControl.integrityList.set(obj, hashCoerce.hash(obj));
            }
            else {
                const hash = integrityControl.integrityList.get(obj);
                const newHash = hashCoerce.hash(obj);
    
                if(hash != newHash && process.env.NODE_ENV === "dev")
                    Logger.debug(`Change object ${hash.substring(0,5)}::${newHash.substring(0,5)}`, "IntegrityControl");

                integrityControl.integrityList.set(obj, hashCoerce.hash(obj));
            }
        }    
    }

    public static get(obj: any): string | null {
        const integrityControl = IntegrityControl.getInstance();
        return (integrityControl.integrityList.has(obj)) ? integrityControl.integrityList.get(obj) : null;
    }

    public static valid(obj: any, hash: string): boolean {
        const integrityControl = IntegrityControl.getInstance();
        return (integrityControl.integrityList.has(obj)) ? integrityControl.integrityList.get(obj) === hash : false;
    }
}