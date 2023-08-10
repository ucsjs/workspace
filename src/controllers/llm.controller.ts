import { Controller, Get, Query } from "@ucsjs/common";
import { LLMServices } from "@ucsjs/core";

@Controller("llm")
export class LLMController {
    constructor(private llmService: LLMServices){}

    @Get("/")
    async generateCompletation(@Query("prompt") prompt: string){
        return this.llmService.generateCompletation(prompt);
    }
}