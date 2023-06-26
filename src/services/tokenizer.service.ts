import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as readline from 'readline';
import { glob } from "glob";
import { Injectable } from "@ucsjs/common";
import { v4 as uuidv4 } from "uuid";
import * as NodeRSA from "node-rsa";

import { ITokenizer } from "@interfaces";
import { TokenizerDTO } from "@dtos";

@Injectable()
export class TokenizerService implements ITokenizer {
    static tokenStorage = new Map<string, string>();

    async getAllTokens(){
        return (fs.existsSync(".secure/tokens.json")) ? JSON.parse(fs.readFileSync(".secure/tokens.json", "utf-8")) : {};
    }

    async createToken(body: TokenizerDTO){
        const key = new NodeRSA({ b: 512 });
        const uuid = uuidv4();
        const certFilename = path.join(".secure", uuid + ".pem");
        let index = (fs.existsSync(".secure/tokens.json")) ? JSON.parse(fs.readFileSync(".secure/tokens.json", "utf-8")) : {};
        let lineCount = 0;

        if(fs.existsSync(".secure/tokens.bin")){
            let readInterface = readline.createInterface(fs.createReadStream(".secure/tokens.bin"))

            for await (const line of readInterface) 
                lineCount++;
        }

        if(index[body.key])
            throw new Error("The informed key is already in use, if you really want to use this key, delete the existing value");

        if(!fs.existsSync(".secure"))
            await fs.mkdirSync(".secure");

        const sign = key.sign(body.value, "hex");

        index[body.key] = { sign, timeout: Date.now() + 24 * 60 * 60 * 1000, index: lineCount };
        await fs.writeFileSync(certFilename, key.exportKey('private'));
        await fs.appendFileSync(".secure/tokens.bin", key.encrypt(body.value, "base64") + "\n", "binary");
        index[body.key].cert = await crypto.createHash('sha256').update(fs.readFileSync(certFilename)).digest('hex');
        await fs.writeFileSync(".secure/tokens.json", JSON.stringify(index), { encoding: "utf-8" });
        
        return {
            message: "Token successfully created!",
            uuid, sign 
        }
    }

    async getToken(key: string, certName?: string): Promise<string> {
        if(TokenizerService.tokenStorage.has(key)){
            return TokenizerService.tokenStorage.get(key);
        }
        else{
            let index = (fs.existsSync(".secure/tokens.json")) ? JSON.parse(fs.readFileSync(".secure/tokens.json", "utf-8")) : {};

            if(index[key] && fs.existsSync(".secure/tokens.bin")){           
                const buffer = await this.getLine(".secure/tokens.bin", index[key].index);
                const cert = await this.getCert(index[key].cert, certName);
                const data = (cert) ? cert.decrypt(buffer, "utf8") : null;
                TokenizerService.tokenStorage.set(key, data);
                return data;     
            }
            else {
                return "";
            }
        }
    }

    async removeToken(position: number){
        if(typeof position == "string")
            position = parseInt(position);

        let index = (fs.existsSync(".secure/tokens.json")) ? JSON.parse(fs.readFileSync(".secure/tokens.json", "utf-8")) : {};
        let newIndex = {};
        let removed = false;

        for(let key in index){            
            if(index[key].index === position)
                removed = true;            
            else if(removed)
                newIndex[key] = { ...index[key], index: index[key].index-1 };            
            else 
                newIndex[key] = index[key];            
        }

        await fs.writeFileSync(".secure/tokens.json", JSON.stringify(newIndex), { encoding: "utf-8" });

        return "Token removed successfully!"
    }

    async getLine(filename: string, lineNumber: number){
        let lineCount = 0;
        const stream = fs.createReadStream(filename);
        const rl = readline.createInterface({ input: stream });
    
        for await (const line of rl) {
            if (lineCount === lineNumber) {
                stream.close();
                return line.replace("\n", "").trim();
            }

            lineCount++;
        }
    
        throw new Error(`File has less than ${lineNumber} lines`);
    }

    async getCert(certHash: string, uuid?: string): Promise<NodeRSA>{
        let keyData = null;

        if(uuid){
            const certFilename = path.join(".secure", uuid + ".pem");
            keyData = fs.readFileSync(certFilename, "utf-8");
        }
        else {
            const files = await glob(path.join(".secure", "*.pem"));

            for await (let certFilename of files){
                const hashCert = await crypto.createHash('sha256').update(fs.readFileSync(certFilename)).digest('hex');

                if(hashCert == certHash){
                    keyData = fs.readFileSync(certFilename, "utf-8");
                    break;
                }
            }
        }

        if(keyData){
            const key = new NodeRSA({ b: 512 });
            key.importKey(keyData, 'private');
            return key;
        }
        else{
            return null;
        }
    }

    textToBinary(data: string): Buffer{
        let bufferData = new ArrayBuffer(data.length * 2);
        let view = new Uint16Array(bufferData);

        for (let i = 0, strLen = data.length; i < strLen; i++) 
            view[i] = data.charCodeAt(i);
        
        return Buffer.from(new Uint8Array(bufferData));
    }

    binaryToText(bufferData: Buffer): string{
        let data = '';
        let view = new Uint16Array(bufferData.buffer);

        for (let i = 0, strLen = view.length; i < strLen; i++) 
            data += String.fromCharCode(view[i]);
        
        return data;
    }
}