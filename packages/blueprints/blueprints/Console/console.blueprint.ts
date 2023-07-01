import { isFunction } from "@ucsjs/common";

import { 
    Types, 
    Input,
    IBlueprintData, 
    IBlueprintHeader, 
    IBlueprintSettings, 
    IBlueprintTrigger, 
    Blueprint, 
    Trigger
} from "@ucsjs/core";

export default class Console extends Blueprint {
    
    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "Console",
        group: "Debug",
        helpLink: "https://www.w3schools.com/jsref/met_console_log.asp",
        inputs: [
            { 
                name: "_default", 
                alias: "value", 
                type: Types.Any
            }
        ],
        events: [
            { 
                name: "_default"
            }
        ]
    }

    private customOutput = (data: IBlueprintData) => { console.log(data.value); };

    constructor(settings?: IBlueprintSettings) {
        super(settings);

        if(settings && settings.customOutput && isFunction(settings.customOutput))
            this.customOutput = settings.customOutput;
    }

    @Trigger("_default")
    private eventTrigger(trigger: IBlueprintTrigger){
        this.display(this.triggerIdentify(trigger))
    }

    @Input("_default")
    private display(data: IBlueprintData){
        if(this.customOutput && isFunction(this.customOutput))
            this.customOutput(data)
    }
}