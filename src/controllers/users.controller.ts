import { BlueprintController } from "@abstracts";
import { CachingService, TokenizerService } from "@services";
import { Controller, Get, Param } from "@ucsjs/common";
import { Flow, HTTPUtils, IBlueprintController } from "@ucsjs/core";

@Controller("users")
export class UsersController extends BlueprintController implements IBlueprintController {

    constructor(
        private tokenizer: TokenizerService,
        private caching: CachingService
    ) { 
        super();
        this.created();
    }

    async created(){
        let connectionString = await this.tokenizer.getToken("MONGODB_CONN");
        
        if(connectionString) {
            this.flow = await Flow.create({
                "MongoDB": { blueprint: "MongoDB", args: { connectionString } },
                "MongoDBSchema": { blueprint: "MongoDBSchema", args: { 
                    name: "users",
                    collection: "users",
                    timestamps: true,
                    fields: [
                        { name: "user", type: "String", index: true, required: true },
                        { name: "pass", type: "String", index: true, required: true },
                    ]
                } },
                "MongoDBFind": { blueprint: "MongoDBFind", args: { limit: 10 } },
            }, {
                "MongoDB->_default": "MongoDBSchema->connection",
                "MongoDBSchema->model": "MongoDBFind->model"
            });
        }
        else {
            this.catch(`Error when trying to retrieve the necessary token for the controller to work`, "UsersController");
        }
    }

    @Get("/")
    async getAll(){
        return await this.getOrCreateCaching(this.caching, "Users::all", this.flow.interceptOnPromise("MongoDBFind", "result", [
            { input: "query", value: {} }
        ]));   
    }

    @Get("/:id")
    async getById(@Param("id") id: string){
        return await this.getOrCreateCaching(this.caching, `Users::${id}`, this.flow.interceptOnPromise("MongoDBFind", "result", [
            { input: "query", value: { _id: id } }
        ])); 
    }
}