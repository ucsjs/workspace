import { Module } from "@ucsjs/common";

import { 
    BlueprintController, 
    TokenizerController, 
    LLMController, 
    UsersController 
} from "@controllers";

@Module({
    controllers: [
        BlueprintController, 
        TokenizerController,
        LLMController,
        UsersController
    ]
})
export class MainModule {};