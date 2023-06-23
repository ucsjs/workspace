import * as YAML from "yaml";
import { Controller, Get, Header } from "@ucsjs/common";
import { GlobalRegistry, BlueprintParser } from "@ucsjs/blueprint";

@Controller("blueprint")
export class BlueprintController { 
    @Get("/")
    async getBlueprints(){      
        return GlobalRegistry.retrieveAll().map(data => {
            const blueprintInstance = GlobalRegistry.retrieve(data[0]);
            return new BlueprintParser(blueprintInstance).export();
        }).filter(item => item);
    }

    @Get("/yml", { raw: true })
    @Header("content-type", "text/yaml")
    async getBlueprintsYML(){     
        return YAML.stringify(GlobalRegistry.retrieveAll().map(data => {
            const blueprintInstance = GlobalRegistry.retrieve(data[0]);
            return new BlueprintParser(blueprintInstance).export();
        }).filter(item => item));
    }
}
