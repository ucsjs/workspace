import { 
    Types, IBlueprintData, IBlueprintHeader, IBlueprintSettings, 
    IBlueprintTrigger, Blueprint, GlobalRegistry 
} from "@ucsjs/blueprint";

export default class Console extends Blueprint {
    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "Console",
        group: "Debug",
        helpLink: "https://www.w3schools.com/jsref/met_console_log.asp",
        inputs: [
            { key: "_default", alias: "value", type: Types.String }
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

    public async build() {
        this.input((data: IBlueprintData) => this.log(data));
    }

    public log(data: IBlueprintData){
        if(this.customOutput && typeof this.customOutput == "function")
            this.customOutput(data)
    }
}