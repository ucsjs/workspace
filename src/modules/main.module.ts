import { Module } from "@ucsjs/common";
import { BlueprintController, TokenizerController, LLMController } from "@controllers";

@Module({
    controllers: [
        BlueprintController, 
        TokenizerController,
        LLMController
    ]
})
export class MainModule {};