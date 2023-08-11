import { UsersDTO, UsersUpdateDTO } from "@dtos";
import { TokenizerService } from "@ucsjs/core";

import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post, 
    Put
} from "@ucsjs/common";

import { 
    Flow, 
    IBlueprintController, 
    Cache, 
    GlobalModules, 
    CacheModule, 
    Intercept, 
    BlueprintController 
} from "@ucsjs/core";

@Controller("users")
export class UsersController extends BlueprintController implements IBlueprintController {

    constructor(
        private readonly tokenizer: TokenizerService
    ) { 
        super();
    }

    async created(){
        let connectionString = await this.tokenizer.getToken("MONGODB_CONN");
        
        if(connectionString) 
            this.flow = await Flow.fromMetadata("users", { connectionString });        
        else 
            this.catch(`Error when trying to retrieve the necessary token for the controller to work`, "UsersController");        
    }

    @Get("/") 
    @Cache("Users::all")
    async getAll(
        @Intercept("MongoDBFind", "result", [ 
            { input: "query", value: {} } 
        ]) data
    ) {
        await GlobalModules.retrieve(CacheModule)?.set("Users::all", data);
        return data;         
    }

    @Get("/:id")
    async getById(
        @Param("id") id: string, 
        @Intercept("MongoDBFind", "result", [ 
            { input: "id", value: "$param.id" } 
        ]) data
    ) {
        await GlobalModules.retrieve(CacheModule)?.set(`Users::${id}`, data);
        return data;
    }

    @Post("/")
    async createUser(
        @Body() body: UsersDTO,
        @Intercept("MongoDBInsert", "result", [ 
            { input: "query", value: "$body" } 
        ]) data
    ) {
        await GlobalModules.retrieve(CacheModule)?.del("Users::all");
        return data;
    }

    @Put("/:id")
    async updateUser(
        @Param("id") id: string,
        @Body() body: UsersUpdateDTO,
        @Intercept("MongoDBUpdate", "result", [
            { input: "id", value: "$param.id" },
            { input: "set", value: "$body" }
        ]) result
    ) {
        if (await result === true) {
            await GlobalModules.retrieve(CacheModule)?.del("Users::all");
            await GlobalModules.retrieve(CacheModule)?.del(`Users::${id}`);
            return `Record ${id} has been updated successfully`;
        } else {
            throw new Error("No records were updated with the given parameters");
        }
    }

    @Delete("/:id")
    async deleteUser(
        @Param("id") id: string,
        @Intercept("MongoDBDelete", "result", [ 
            { input: "id", value: "$param.id" } 
        ]) result
    ) {
        if (await result === true) {
            await GlobalModules.retrieve(CacheModule)?.del("Users::all");
            await GlobalModules.retrieve(CacheModule)?.del(`Users::${id}`);
            return `Record ${id} has been removed successfully`;
        } else {
            throw new Error("No records were removed with the given parameters");
        }
    }
}