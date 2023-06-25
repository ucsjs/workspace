import { 
    Types, IBlueprintData, IBlueprintHeader, IBlueprintSettings, 
    IBlueprintTrigger, Blueprint, GlobalRegistry 
} from "@ucsjs/core";

export default class Console extends Blueprint {
    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "Console",
        group: "Debug",
        helpLink: "https://www.w3schools.com/jsref/met_console_log.asp",
        inputs: [
            { name: "_default", alias: "value", type: Types.String, callback: (data: IBlueprintData) => this.log(data) }
        ],
        events: [
            { name: "_default", callback: (trigger: IBlueprintTrigger) => this.log(this.triggerIdentify(trigger)) }
        ]
    }

    private customOutput = (data: IBlueprintData) => { console.log(data.value) };

    constructor(settings?: IBlueprintSettings) {
        super(settings);

        if(settings && settings.customOutput && typeof settings.customOutput == "function")
            this.customOutput = settings.customOutput;
    }

    public log(data: IBlueprintData){
        if(this.customOutput && typeof this.customOutput == "function")
            this.customOutput(data)
    }
}