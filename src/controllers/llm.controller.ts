import { Controller, Get, Query } from "@ucsjs/common";
import { LLMServices } from "@service/llm.services";

@Controller("llm")
export class LLMController {
    constructor(private llmService: LLMServices){}

    @Get("/")
    async generateCompletation(@Query("prompt") prompt: string){
        return this.llmService.generateCompletation(prompt);
    }
}