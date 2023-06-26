import * as YAML from "yaml";
import { Controller, Get, Header } from "@ucsjs/common";
import { GlobalRegistry, BlueprintParser, Blueprint } from "@ucsjs/core";

@Controller("blueprint")
export class BlueprintController { 
    @Get("/")
    async getBlueprints(){      
        return GlobalRegistry.retrieveAll().map(async data => {
            const blueprintInstance = await GlobalRegistry.retrieve(data[0]);
            return (blueprintInstance instanceof Blueprint) ? new BlueprintParser(blueprintInstance).export() : null;
        }).filter(item => item);
    }

    @Get("/yml", { raw: true })
    @Header("content-type", "text/yaml")
    async getBlueprintsYML(){     
        return YAML.stringify(GlobalRegistry.retrieveAll().map(async data => {
            const blueprintInstance = await GlobalRegistry.retrieve(data[0]);
            return (blueprintInstance instanceof Blueprint) ? new BlueprintParser(blueprintInstance).export() : null;
        }).filter(item => item));
    }
}
