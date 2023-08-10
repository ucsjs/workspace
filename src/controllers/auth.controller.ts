import { plainToClass } from 'class-transformer';
import * as JWT from "jsonwebtoken";

import { 
    Body, 
    Controller, 
    Headers, 
    Post, 
    SubscribeMessage 
} from "@ucsjs/common";

import { WsService } from '@ucsjs/protobuf';

export class AuthMessage {
    uuid: string;
    token: string;
}

@Controller("auth")
export class AuthController {
    constructor(
        private readonly wsService: WsService
    ){}

    @Post()
    async login(@Headers("uuid") uuid: string, @Body() body) {
        const token = JWT.sign({ uuid }, "SECRET");
        return token;
    }

    @SubscribeMessage("auth.Login")
    async authSocket(data: any, socket: any){
        try{
            const auth = plainToClass(AuthMessage, data);
            const validToken = JWT.verify(auth.token, "SECRET");
            
            if(validToken){
                socket.token = auth.token;
                socket.send(await this.wsService.pack("auth", "auth.Success"));
            }
            else{
                socket.send(await this.wsService.pack("auth", "auth.Error"));
            }
        }
        catch(err){
            const buffer = await this.wsService.pack("auth", "auth.Error", {
                error: err.message
            });

            socket.send(buffer); 
        }    
    }
}
