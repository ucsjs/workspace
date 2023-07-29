import * as YAML from "yaml";

import { 
    Controller, 
    Get, 
    Header, 
    SubscribeMessage 
} from "@ucsjs/common";

import { 
    GlobalRegistry, 
    BlueprintParser, 
    Blueprint 
} from "@ucsjs/core";

import { WsService } from '@service/ws.service';

@Controller("blueprint")
export class BlueprintController { 
    constructor(
        private readonly wsService: WsService
    ){}

    @Get()
    async getBlueprints(){      
        return await Promise.all( GlobalRegistry.retrieveAll().map(async data => {            
            const blueprintInstance = await GlobalRegistry.retrieve(data[0]);
            return (blueprintInstance instanceof Blueprint) ? new BlueprintParser(blueprintInstance).export() : null;
        }).filter(item => item));
    }

    @Get("yml", { raw: true })
    @Header("content-type", "text/yaml")
    async getBlueprintsYML(){     
        return YAML.stringify(await Promise.all(GlobalRegistry.retrieveAll().map(async data => {
            const blueprintInstance = await GlobalRegistry.retrieve(data[0]);
            return (blueprintInstance instanceof Blueprint) ? new BlueprintParser(blueprintInstance).export() : null;
        }).filter(item => item)));
    }

    @SubscribeMessage("blueprint.Request")
    async getBlueprintsBinary(data: any, socket: any){
        const blueprints = await this.getBlueprints();
        const buffer = await this.wsService.pack("blueprint", "BlueprintList", { blueprints });
        socket.send(buffer);
    }
}
