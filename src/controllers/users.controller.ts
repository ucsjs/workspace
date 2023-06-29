import { BlueprintController } from "@abstracts";
import { UsersDTO, UsersUpdateDTO } from "@dtos";
import { CachingService, TokenizerService, BlueprintService } from "@services";
import { Body, Controller, Delete, Get, Param, Post, Put, Response } from "@ucsjs/common";
import { Flow, IBlueprintController } from "@ucsjs/core";

@Controller("users")
export class UsersController extends BlueprintController implements IBlueprintController {

    constructor(
        private readonly tokenizer: TokenizerService,
        private readonly caching: CachingService,
        private readonly blueprint: BlueprintService,
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
                "MongoDBInsert": { blueprint: "MongoDBInsert", transforms: {
                    query: [
                        { blueprint: "Crypto", input: "_default", output: "_default", key: "pass" }
                    ]
                } },
                "MongoDBUpdate": { blueprint: "MongoDBUpdate", transforms: {
                    set: [
                        { blueprint: "Crypto", input: "_default", output: "_default", key: "pass" }
                    ]
                } },
                "MongoDBDelete": { blueprint: "MongoDBDelete" }
            }, {
                "MongoDB->_default": "MongoDBSchema->connectionName",
                "MongoDBSchema->model": [
                    "MongoDBFind->model", 
                    "MongoDBInsert->model", 
                    "MongoDBUpdate->model", 
                    "MongoDBDelete->model"
                ]
            });
        }
        else {
            this.catch(`Error when trying to retrieve the necessary token for the controller to work`, "UsersController");
        }
    }

    @Get("/")
    async getAll(@Response() res) {
        return await this.blueprint.intercept(
            this.flow, res, 
            "MongoDBFind", "result",
            [ { input: "query", value: {} } ],
            this.caching, `Users::all`
        );  
    }

    @Get("/:id")
    async getById(@Param("id") id: string, @Response() res) {
        return await this.blueprint.intercept(
            this.flow, res, 
            "MongoDBFind", "result",
            [ { input: "id", value: id } ],
            this.caching, `Users::${id}`
        ); 
    }

    @Post("/")
    async createUser(@Body() body: UsersDTO, @Response() res){
        return await this.blueprint.insertDataAndIntercept(
            this.flow, res, 
            "MongoDBInsert", "result",
            [ { input: "query", value: body } ],
            this.caching, 'Users::all'
        );
    }

    @Put("/:id")
    async updateUser(@Param("id") id: string, @Body() body: UsersUpdateDTO, @Response() res){
        return new Promise((resolve, reject) => {
            this.blueprint.intercept(this.flow, res, "MongoDBUpdate", "result",
                [ 
                    { input: "id", value: id },
                    { input: "set", value: body }
                ]
            ).then(async (result) => {
                if(result === true){
                    await this.caching.del("Users::all");
                    await this.caching.del(`Users::${id}`);
                    resolve(`Record ${id} has been updated successfully`);
                }
                else{
                    reject("No records were updated with the given parameters");
                }                
            }).catch(reject);
        }); 
    }

    @Delete("/:id")
    async deleteUser(@Param("id") id: string, @Response() res){
        return new Promise((resolve, reject) => {
            this.blueprint.intercept(this.flow, res, "MongoDBDelete", "result",
                [ { input: "id", value: id } ]
            ).then(async (result) => {
                if(result === true){
                    await this.caching.del("Users::all");
                    await this.caching.del(`Users::${id}`);
                    resolve(`Record ${id} has been removed successfully`);
                }
                else{
                    reject("No records were removed with the given parameters");
                }                
            }).catch(reject);
        }); 
    }
}