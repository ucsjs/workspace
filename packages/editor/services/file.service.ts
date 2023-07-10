import * as path from "path";
import * as fg from "fast-glob";
import * as fs from "fs";
import * as mime from "mime-types";
import * as crypto from 'crypto';
import * as languageDetect from "language-detect";
import { Injectable } from "@ucsjs/common";
import { IFileInfo } from "../interfaces";

@Injectable()
export class FileService {
    async getFiles(
        pathname: string = "", 
        onlyDirectories: boolean = false, 
        onlyFiles: boolean = false
    ): Promise<Array<IFileInfo>>{
        const resolvePath = (pathname) ? pathname : path.resolve(`./`);
		const directories = (!onlyFiles) ? await fg([`${resolvePath}/*`], { dot: false, onlyDirectories: true }) : [];
		const files = (!onlyDirectories) ? await fg([`${resolvePath}/*`], { dot: true, onlyFiles: true }) : [];
		let result = new Array<IFileInfo>();

		for(let diretory of directories) {
			const info = fs.lstatSync(diretory);
			
			result.push({
				name: diretory.replace(resolvePath, "").replace(/\//s, ""),
				path: diretory.replace(process.cwd(), ""),
				filename: diretory.replace(process.cwd(), ""),
				isDirectory: true,
				isFile: false,		
				pathHash: crypto.createHash('sha1').update(diretory).digest('hex'),		
				sha256: crypto.createHash('sha256').update(JSON.stringify(info)).digest('hex'),
				lastModified: info.mtime
			})
		}

		for(let file of files) {
			if(!file.includes(".blueprint.meta") && !file.includes(".page.meta")){
				const info = fs.lstatSync(file);
				const basename = path.basename(file);
				let language = info.isFile() ? languageDetect.filename(file)?.toLowerCase() : null;

				switch(path.extname(file).replace(".", "")){
					case "ts": language = "typescript"; break;
				}

				if(file.includes("blueprint.ts")) language = "blueprint";
				else if(file.includes("page.ts")) language = "page";

				result.push({
					name: file.replace(resolvePath, "").replace(/\//s, ""),
					path: file.replace(process.cwd(), ""),
					filename: file.replace(process.cwd(), ""),
					isDirectory: info.isDirectory(),
					isFile: info.isFile(),
					ext: path.extname(file).replace(".", ""),
					mime: mime.lookup(file),				
					sha256: crypto.createHash('sha256').update(JSON.stringify(info)).digest('hex'),
					pathHash: crypto.createHash('sha1').update(file).digest('hex'),
					hasMetadata: fs.existsSync(`${file.replace(basename, `.${basename.replace(".ts", "")}`)}.meta`),
					language,
					lastModified: info.mtime
				});
			}
		}

		return result;
    }

    steamFile(filename: string) : fs.ReadStream {
        const basename = path.basename(filename);

		return (
			(filename.includes("blueprint.ts") &&
			fs.existsSync(`${filename.replace(basename, `.${basename.replace(".ts", "")}`)}.meta`)) || 
			(filename.includes("page.ts") &&
			fs.existsSync(`${filename.replace(basename, `.${basename.replace(".ts", "")}`)}.meta`))
		) ? fs.createReadStream(`${filename.replace(basename, `.${basename.replace(".ts", "")}`)}.meta`) : fs.createReadStream(filename);
    }

    openFile(filename){

    }

    async createFile(pathname: string, filename: string){

    }

    async createDir(pathname: string, name: string){

    }

    async saveFile(item, parser = "default"){

    }

    async deleteFile(filename): Promise<boolean> {
		if(fs.existsSync(filename)){
			await fs.unlinkSync(filename);
			return true;
		}
		else{
			return false; 
		}
	}

    async deleteDir(dirname): Promise<boolean> {
		if(fs.existsSync(dirname)){
			await fs.rmSync(dirname, { recursive: true, force: true });
			return true;
		}
		else{
			return false;
		}
	}

    async checksum(filename: string): Promise<string>{
		const info = fs.lstatSync(filename);
		return await crypto.createHash('sha256').update(JSON.stringify(info)).digest('hex');
	}
}