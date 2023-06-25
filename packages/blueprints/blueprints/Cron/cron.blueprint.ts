import { CronJob } from 'cron';
import * as timezones from "google-timezones-json";
import { enumToList, Logger, objectKeysToList } from "@ucsjs/common";
import { Types, IBlueprintHeader, Blueprint } from "@ucsjs/core";
import { CronExpression } from "./cronexpression.enum";

export default class Cron extends Blueprint {

    private cron: CronJob;
    
    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "Cron",
        group: "Schedule",
        icon: "fa-solid fa-clock-rotate-left",
        helpLink: "https://www.w3schools.com/jsref/met_console_log.asp",
        properties: [
            { name: "startNow", displayName: "Start Now", default: true, type: Types.Boolean },
            { name: "cronTime", displayName: "Crontime", default: CronExpression.EVERY_10_SECONDS, type: Types.Options, options: enumToList(CronExpression)  },
            { name: "timezone", displayName: "Timezone", default: "America/Sao_Paulo", type: Types.Options, options: objectKeysToList(timezones) }
        ],
        triggers: [ { name: "_default" } ]
    }

    public async build() {
        let startNow: boolean = this.getParameter("startNow", false) as boolean;
        let cronTime: string = this.getParameter("cronTime", CronExpression.EVERY_10_SECONDS) as string;
        let timezone: string = this.getParameter("timezone", "America/Sao_Paulo");
        this.cron = new CronJob(cronTime, () => this.emit(this), undefined, startNow, timezone);
    }
}