import { DataSource, EntitySchema } from "typeorm";
import { Logger } from "@ucsjs/common";
import { Blueprint, IBlueprintData, ConnectionsManager, Input, IBlueprintHeader, GlobalRegistry } from "@ucsjs/core";

const header = require("./TypeORMRepository.header.json");

export default class TypeORMTable extends Blueprint {

    header: IBlueprintHeader = GlobalRegistry.fixHeader(header);

    @Input("connectionName")
    public async createRepository(data: IBlueprintData) {
        const tableName = this.getParameter<string>("table", "");
        const columns = this.getParameterObject("columns", "name");
        const relations = this.getParameterObject("relations", "name");

        let conn = (await ConnectionsManager.getOrCreateConnection(data.value)).get() as DataSource;

        if (columns && !conn.getRepository(tableName)) {
            Logger.log(`Create entity ${tableName}...`, "TypeORMRepository");

            const schema = new EntitySchema({
                name: tableName,
                tableName,
                columns,
                relations
            });

            const manager = await conn.getRepository(schema);
            this.next(this.generateData(this, manager), "repository");
        }
        else {
            Logger.log(`Recovering entity ${tableName}...`, "TypeORMRepository");

            const manager  = conn.getRepository(tableName);
            this.next(this.generateData(this, manager), "repository");
        }
    }
}
