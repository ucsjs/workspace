import * as path from "path";
import { DocsService } from "../services";
import { Controller, Get, Param, Response } from "@ucsjs/common";

@Controller("docs")
export class DocsController {
    private routes: {};

    constructor(
        private docsService: DocsService
    ){
        this.routes = require(path.join(process.cwd(), "docs/index.json"));
    }
    
    @Get("/")
    async getIndexDocs(@Response() res){
        return res.render('docs/index', await this.docsService.getDocsStrutucture());
    }

    @Get("/:item")
	async getDoc(@Param("item") item: string, @Response() res) {
        const filename = this.routes[item];

        if(filename)
		    return res.render('docs/index', await this.docsService.getDocsStrutucture(filename));
        else
            res.status(404).end();
	}
}