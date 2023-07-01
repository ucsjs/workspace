import * as fs from "fs";
import * as fg from "fast-glob";
import * as path from "path";
import { Injectable } from "@ucsjs/common";

@Injectable()
export class DocsService {
    constructor(){}

    async getDocsStrutucture(file = null){
        let strutucture = {
            index: "",
            navbar: [],
            breadcrumb: [],
            anchors: []
        };

        const filesAndDirsIndex = await fg(path.resolve("./docs/*"), { 
            dot: false, 
            onlyFiles: false, 
            ignore: [
                "./docs/index.html"
            ] 
        });

        if(file){
            const pathDivider = (process.platform === "win32") ? "\\" : "/";
            const [root, content] = file.replace(path.join(process.cwd(), "/docs/"), "").split(pathDivider);
            strutucture.breadcrumb[0] = root.split("-")[1]?.trim();

            if(typeof content == "string")
                strutucture.breadcrumb[1] = content.split("-")[1]?.trim();

            if(strutucture.breadcrumb[0] && strutucture.breadcrumb[0].includes("."))
                strutucture.breadcrumb[0] = strutucture.breadcrumb[0].split(".")[0];

            if(strutucture.breadcrumb[1] && strutucture.breadcrumb[1].includes("."))
                strutucture.breadcrumb[1] = strutucture.breadcrumb[1].split(".")[0];
        }

        strutucture.index = fs.readFileSync(path.resolve(file), "utf8") ;
     
        for(let fileOrDir of filesAndDirsIndex){
            try{
                let basename = path.basename(fileOrDir);
                let [indexRaw, nameRaw] = basename.split("-");
                let index = parseInt(indexRaw.trim());
                let name = (nameRaw?.includes(".")) ? nameRaw.split(".")[0].trim() : nameRaw.trim();
                const isDir = fs.lstatSync(fileOrDir).isDirectory(); 
                
                if(name){
                    strutucture.navbar[index-1] = {
                        uri: "/docs/" + this.convertLinkToCleanURL(
                            encodeURIComponent(fileOrDir.replace(process.cwd(), "").replace("/docs/", "").replace(/\\/g, "/"))
                        ),
                        isDir,
                        index: index,
                        name: name,
                        children: []
                    };
    
                    if(isDir){
                        const filesChildren = await fg(`${fileOrDir}/*.html`, { dot: false, onlyFiles: true });
                        
                        for(let children of filesChildren){
                            let basenameChildren = path.basename(children);
                            let [indexRawChildren, nameRawChildren] = basenameChildren.split("-");
                            let indexChildren = parseInt(indexRawChildren.trim());
                            let nameChildren = (nameRawChildren.includes(".")) ? nameRawChildren.split(".")[0].trim() : nameRawChildren.trim();
        
                            strutucture.navbar[index-1].children.push({
                                uri: "/docs/" + this.convertLinkToCleanURL(
                                    encodeURIComponent(children.replace(process.cwd(), "").replace("/docs/", "").replace(/\\/g, "/"))
                                ),
                                name: nameChildren
                            })
                        }
                    }
                }
            }
            catch(e){}
        }

        if(strutucture.index){
            const regex = /<a id="(.*?)".*?>/g;
            let match;

            while ((match = regex.exec(strutucture.index)) !== null) {
                strutucture.anchors.push({
                    id: match[1],
                    label: this.fixedLabel(match[1])
                });
            }
        }
        
        return strutucture;
    }

    uppercaseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    fixedLabel(value) {
        return (value) ? this.uppercaseFirstLetter(value === null || value === void 0 ? void 0 : value.replace(/([A-Z])/g, " $1")) : '';
    }

    convertLinkToCleanURL(link: string): string {
        const decodedLink = decodeURIComponent(link);
        const pathParts = decodedLink.split('/');
    
        const cleanPathParts = pathParts.map(part => {
            const cleanPart = part
            .replace(/\d+\s*-\s*/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();

            return cleanPart;
        });
    
        const cleanURL = cleanPathParts.join('-');
        return cleanURL;
    }
   
}
