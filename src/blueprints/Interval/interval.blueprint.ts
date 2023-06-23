import { BehaviorSubject } from "rxjs";
import { Logger } from "@ucsjs/common";
import { Types, IBlueprintHeader, Blueprint, GlobalRegistry } from "@ucsjs/blueprint";

export default class Interval extends Blueprint {
    public header: IBlueprintHeader = {
        useInEditor: true,
        namespace: "Interval",
        group: "Common",
        version: 1,
        properties: [
            { name: "start", type: Types.Int, displayName: "Initial value", default: 0 },
            { name: "max", type: Types.Int, displayName: "Max value", default: 100 },
            { name: "increment", type: Types.Int, displayName: "Increment", default: 1 },
            { name: "timeout", type: Types.Int, displayName: "Timeout", default: 1000 }
        ]
    };

    private count: BehaviorSubject<number> | undefined;
    private interval: any | undefined;

    public async build() {
        Logger.log(`Build`, "Interval Blueprint");
        this.count = new BehaviorSubject<number>(0);
        this.count.subscribe((v) => this.next(this.generateData(this, v)));
        this.output();
    }

    execute(): boolean {
        let increment = this.getParameter<number>("increment", 1);
        let max = this.getParameter<number>("max", 100);
        let timeout = this.getParameter<number>("timeout", 1000);

        this.interval = setInterval(() => {
            if(this.count){
                if(this.count.value + increment < max)
                    this.count.next(this.count.value + increment);
                else
                    this.stop();
            }
        }, timeout);

        return true;
    }    

    stop(): void {
        if(this.interval)
            clearInterval(this.interval);
    }
}