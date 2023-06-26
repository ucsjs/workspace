import { CachingService, TokenizerService } from "@services";
import { Controller, Get, Param } from "@ucsjs/common";
import { Flow, HTTPUtils, IBlueprintController } from "@ucsjs/core";

@Controller("users")
export class UsersController implements IBlueprintController {
    private flow: Flow;

    constructor(
        private tokenizer: TokenizerService,
        private caching: CachingService
    ) {
        this.created();
    }

    async created(){
        let connectionString = this.tokenizer.getToken("MONGODB_CONN");

        this.flow = await Flow.create({
            "MongoDB": { blueprint: "MongoDB", args: { 
                name: "mongodb",
                host: "localhost",
                db: "ucs",
            } },
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

    @Get("/")
    async getAll(){
        return this.caching.get(`Users::all`).then((data) => data).catch(async () => {
            let data = HTTPUtils.DataToHTTP(await this.flow.interceptOnPromise("MongoDBFind", "result", [
                { input: "query", value: {} }
            ])); 

            await this.caching.set(`Users::all`, data);
            return data;
        });    
    }

    @Get("/:id")
    async getById(@Param("id") id: string){
        return this.caching.get(`Users::${id}`).then((data) => data).catch(async () => {
            let data = HTTPUtils.DataToHTTP(await this.flow.interceptOnPromise("MongoDBFind", "result", [
                { input: "query", value: { _id: id } }
            ])); 

            await this.caching.set(`Users::${id}`, data);
            return data;
        });   
    }
}