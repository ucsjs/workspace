import { 
    Blueprint, 
    IBlueprintHeader, 
    Types 
} from "@ucsjs/core";

export class HTTPController extends Blueprint {
    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "HTTPController",
        group: "HTTP",
        icon: "fa-solid fa-turn-down",
        helpLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods",
        displayName: "HTTP Controller",
        properties: [
            {
                name: "path",
                type: Types.String,
                displayName: "Path",
                default: "/mycontroller",
                required: true,
                hint: "Sets the base path of the controller"
            },
            { 
                name: "routes", 
                displayName: "Routes", 
                type: Types.Array, 
                objectArray: [
                    {
                        name: "ref",
                        type: Types.String,
                        required: true
                    },
                    { 
                        name: "path",
                        type: Types.String,
                        required: true
                    },
                    {
                        name: "method",
                        type: Types.Options,
                        required: true,
                        options: [
                            { name: "GET", value: "GET" },
                            { name: "POST", value: "POST" },
                            { name: "PUT", value: "PUT" },
                            { name: "DELETE", value: "DELETE" },
                            { name: "ALL", value: "ALL" },
                        ]
                    },
                    { 
                        name: "private",
                        type: Types.Boolean,
                        required: false
                    },
                ]
            }
        ]
    }

    public async build(){
        const controllerPath = this.getParameter<string>("path", "");
        const routes = this.getParameterObject("routes", "path");

        if(Array.isArray(routes)){
            for(let route of routes)
                this.output(`Route:${route.ref}`);
        }
    }
}