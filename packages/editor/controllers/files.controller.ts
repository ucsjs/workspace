import * as YAML from "yaml";
import * as WebSocket from 'ws';

import { ProtobufService } from "@ucsjs/protobuf";

import { 
	Body, 
	Controller, 
	Delete, 
	Get, 
	Header, 
	Post, 
	Put, 
	Query, 
	StreamableFile, 
	SubscribeMessage 
} from "@ucsjs/common";

import { AbstractEditor } from "../abstracts";
import { Navbar } from "../decorators";
import { ILayoutItem } from "../interfaces";
import { FileService } from "../services";

@Controller("files")
export class FilesController extends AbstractEditor {
    constructor(
        private readonly fileService: FileService,
		private readonly protobufService: ProtobufService
    ){ super(); }

    @Navbar({ namespace: "FILE_MANAGER", display: "File Manager", path: "Windows/File Manager" })
    async openFileTree(){
        this.createLayoutItem(new FileTree());
    }

    @Get()
	async getAll(
        @Query("path") path: string, 
        @Query("onlyDir") onlyDir: boolean, 
        @Query("onlyFiles") onlyFiles: boolean
    ) {
		return await this.fileService.getFiles(path, onlyDir, onlyFiles);
	}

	@Get("yml", { raw: true })
    @Header("content-type", "text/yaml")
    async getBlueprintsYML(
		@Query("path") path: string, 
        @Query("onlyDir") onlyDir: boolean, 
        @Query("onlyFiles") onlyFiles: boolean
	){     
		//console.log(path, onlyDir, onlyFiles);
        return YAML.stringify(await this.getAll(path, onlyDir, onlyFiles));
    }

	@Get("proto", { raw: true })
	@Header("content-type", "application/octet-stream")
	async getFilesToProto(
		@Query("path") path: string, 
        @Query("onlyDir") onlyDir: boolean, 
        @Query("onlyFiles") onlyFiles: boolean
	){
		const items = await this.getAll(path, onlyDir, onlyFiles);

		const buffer = await this.protobufService.generateBuffer(
			"files.proto", "editor.FileList",
			{ items }
		);

		return buffer;
	}

	@SubscribeMessage("files")
	async handleEvent(socket: WebSocket, data: any){
		const { path, onlyDir, onlyFiles } = data;
		const buffer = await this.getFilesToProto(path, onlyDir, onlyFiles);
		socket.emit("files", buffer);
	}

	@Delete()
	async deleteFile(@Query("filename") filename: string){
		return await this.fileService.deleteFile(filename);
	}

	@Get("open")
	async openFile(@Query("filename") filename: string){
		return await this.fileService.openFile(filename);
	}

	@Get("stream")
	async stream(@Query("filename") filename: string) {
		const file = this.fileService.steamFile(filename);
		return new StreamableFile(file);
	}

	@Post("create")
	async create(@Query("path") path: string, @Query("filename") filename: string){
		return await this.fileService.createFile(path, filename);
	}

	@Post("dir")
	async createDir(@Query("path") path: string, @Query("name") name: string){
		return await this.fileService.createDir(path, name);
	}

	@Delete("dir")
	async deleteDir(@Query("dirname") dirname: string){
		return await this.fileService.deleteDir(dirname);
	}

	@Put("save")
	async save(@Body() body){
		if(process.env.ALLOW_SAVEFILE !== "false")
			return await this.fileService.saveFile(body);
		else
			return false;
	}
}

export class FileTree implements ILayoutItem {
    namespace: string = "FileTree";
    title: string = "File Tree";
    component: string = "FileTree";

	created(){
		
	}
}