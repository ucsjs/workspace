import { Body, Controller, Delete, Get, Param, Post } from "@ucsjs/common";
import { TokenizerService } from "@service/tokenizer.service";
import { TokenizerDTO } from "@dto/tokenizer.dto";

@Controller("tokenizer")
export class TokenizerController { 
    constructor(private tokenizerService: TokenizerService){}

    @Get("/")
    async getAllTokens(){
        return this.tokenizerService.getAllTokens();
    }

    @Post("/")
    async createToken(@Body() body: TokenizerDTO){      
        return this.tokenizerService.createToken(body);
    }

    @Delete("/:index")
    async removeToken(@Param("index") index: number){
        return this.tokenizerService.removeToken(index);
    }
}
