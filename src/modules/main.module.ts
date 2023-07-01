import { Module } from "@ucsjs/common";

import { 
    BlueprintController, 
    TokenizerController, 
    LLMController, 
    UsersController,
    DocsController 
} from "@controllers";

@Module({
    controllers: [
        BlueprintController, 
        TokenizerController,
        LLMController,
        UsersController,
        DocsController
    ]
})
export class MainModule {};