import { Module } from "@ucsjs/common";

import { 
    FilesController, 
    EditorController 
} from "../controllers";

@Module({
    controllers: [
        EditorController,
        FilesController
    ]
})
export class EditorModule {} 