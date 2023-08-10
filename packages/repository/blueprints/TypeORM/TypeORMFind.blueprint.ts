import { Repository } from "typeorm";

import { 
    IBlueprintHeader, 
    Types, 
    Blueprint, 
    Input, 
    IBlueprintData 
} from "@ucsjs/core";

import { Logger } from "@ucsjs/common";

export default class TypeORMFind extends Blueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "TypeORMFind",
        group: "Repository",
        icon: "/assets/img/typeorm.png",
        helpLink: "https://typeorm.io/#/find-options",
        displayName: "TypeORM Find",
        editorHeaderColor: "#306090",
        inputs: [{
            name: "repository",
            type: Types.Object
        }],
        outputs: [{
            name: "result",
            type: Types.Object
        }],
        properties: [
            {
                name: "where",
                displayName: "Where",
                type: Types.Object
            },
            {
                name: "limit",
                displayName: "Limit",
                type: Types.Int
            },
            {
                name: "offset",
                displayName: "Offset",
                type: Types.Int
            },
            {
                name: "order",
                displayName: "Order",
                type: Types.Object,
                required: false
            }
        ]
    };

    @Input("repository")
    public async find(data: IBlueprintData) {
        try {
            const repository: Repository<any> = data.value;
            const where = this.getParameter<Object>("where", {});
            const limit = this.getParameter<number>("limit", 10);
            const offset = this.getParameter<number>("offset", 0);
            const order = this.getParameter<Object>("order", {});

            const options = {
                where,
                take: limit,
                skip: offset,
                order
            };

            const result = await repository.findBy(options);
            this.next(this.generateData(this, result), "result");
        } catch (e) {
            Logger.error(e.message, `TypeORMFind::${this.id}`);
            this.next(this.generateData(this, { error: e.message }), "result");
        }
    }
}
