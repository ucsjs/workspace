import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as readline from 'readline';
import { Injectable } from "@ucsjs/common";
import { v4 as uuidv4 } from "uuid";
import * as NodeRSA from "node-rsa";

import { ITokenizer } from "@interfaces";
import { TokenizerDTO } from "@dtos";

@Injectable()
export class TokenizerService implements ITokenizer{
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
        await fs.writeFileSync(certFilename, key.exportKey('public'));
        await fs.appendFileSync(".secure/tokens.bin", key.encrypt(body.value, "hex") + "\n", "binary");
        index[body.key].cert = await crypto.createHash('sha256').update(fs.readFileSync(certFilename)).digest('hex');
        await fs.writeFileSync(".secure/tokens.json", JSON.stringify(index), { encoding: "utf-8" });
        
        return {
            message: "Token successfully created!",
            uuid, sign 
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