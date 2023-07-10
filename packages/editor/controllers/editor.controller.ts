import { Controller, Get } from "@ucsjs/common";
import { EditorService } from "../services/editor.service";

@Controller("editor")
export class EditorController {
    constructor(
        private readonly editorService: EditorService
    ){}

    @Get()
    async getEditorMetadata(){
        return await this.editorService.getMetadata();
    }
}