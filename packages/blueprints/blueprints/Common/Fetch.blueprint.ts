import fetch from 'node-fetch';

import { 
    Blueprint, 
    GlobalRegistry, 
    IBlueprintData, 
    IBlueprintHeader, 
    Input 
} from "@ucsjs/core";

import { Logger, isObject, isString } from '@ucsjs/common';

const header = require("./Fetch.header.json");

export default class Fetch extends Blueprint {

    public header: IBlueprintHeader = GlobalRegistry.fixHeader(header);

    private url!: string;

    private body!: object;

    @Input("url")
    private reciveUrl(data: IBlueprintData){
        if(data && data.value && isString(data.value)) {
            const method = this.getParameter<string>("method", "GET");
            const awaitBody = this.getParameter<boolean>("awaitBody", true);
            this.url = data.value;

            if(method == "GET" || method == "DELETE" || !awaitBody)
                this.run();
        }
    }

    @Input("body")
    private reciveBody(data: IBlueprintData){
        if(data && data.value && isObject(data.value)){
            const method = this.getParameter<string>("method", "GET");
            this.body = data.value;

            if(method == "POST" || method == "PUT")
                this.run();
        }
    }

    private async run(){
        const method = this.getParameter<string>("method", "GET");
        const headers = this.getParameterKeyValue("headers") as HeadersInit;
        const redirect = this.getParameter<string>("redirect", "follow") as RequestRedirect;
        const follow = this.getParameter<number>("follow", 20);
        const compress = this.getParameter<boolean>("compress", true);
        const referrer = this.getParameter<string>("referrer", "");
        const referrerPolicy = this.getParameter<string>("referrerPolicy", "") as ReferrerPolicy;
        const highWaterMark = this.getParameter<number>("highWaterMark", 16384);
        const insecureHTTPParser = this.getParameter<boolean>("insecureHTTPParser", false);
        const returnJSON = this.getParameter<boolean>("returnJSON", true);

        const options = {
            method, headers, redirect,
            follow, compress, referrer,
            referrerPolicy, highWaterMark, 
            insecureHTTPParser
        };

        if(isObject(this.body) && (method === "POST" || method === "PUT"))
            options["body"] = JSON.stringify(this.body);
        
        try {
            if(isString(this.url)){
                const response = await fetch(this.url, options);

                if(response.ok){
                    const data = (returnJSON) ? await response.json() : response.body;
                    this.next(this.generateData(this, data), "result");  
                }
                else {
                    this.next(this.generateData(this, { 
                        error: `Error in request ${this.url} status ${response.statusText}(Code: ${response.status}).`
                    }), "result");
                }                
            }
        }
        catch(e) {
            Logger.error(e.message, `Fetch::${this.id}`);
            this.next(this.generateData(this, { error: e.message }), "result");
        }
        
    }
}