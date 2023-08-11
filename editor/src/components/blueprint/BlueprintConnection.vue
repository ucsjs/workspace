<template>
    <div 
        class="blueprint-connection" 
        :style="{ border: `2px solid ${getInputColor()}` }"
        :title="`Type: ${returnTypeString()}`"
    >
        <div 
            class="blueprint-connection-inner" 
            :style="{ backgroundColor: getInputColor() }"
        ></div>
    </div>
</template>

<style scoped>
.blueprint-connection{
    height: 12px;
    width: 12px;
    background-color: #212121;
    border-radius: 50%;
    transition: background-color 0.5s ease;
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
}

.blueprint-connection:hover .blueprint-connection-inner{
    display: block;
}

.blueprint-connection-inner{
    display: none;
    height: 4px;
    width: 4px;
    border-radius: 50%;
    margin: auto;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { Types, TypeToString } from "../../enums/types.enum";

import { 
    IBlueprintComponent, 
    IBlueprintInput, 
    IBlueprintOutput 
} from "../../interfaces";

@Component({})
export default class BlueprintConnection extends Vue {
    @Prop({ default: {} })
    content!: IBlueprintComponent;

    @Prop({ default: null })
    output!: IBlueprintOutput;

    @Prop({ default: null })
    input!: IBlueprintInput;

    getInputColor(){
        if(this.content.component) {
            switch(this.content.component.type){
                case "Float": return "#84e4e7";
                case "Integer": return "#858de5";
                case "String": return "#9aef92";
                case "Date": return "#917fdf";
                case "Color": return "#edf696";
                case "Image": return "#ff8b8b";
                default: return "#c1c1c1";
            }
        }
        else if(this.output || this.input) {
            const type = (this.output) ? 
                this.output.type as Types : 
                this.input.type as Types;

            switch(type){
                case Types.String: return "#9aef92";
                case Types.Boolean: return "#8588e5";
                case Types.Int: return "#858de5";
                case Types.Float: return "#9aef92";
                case Types.Any: return "#e385e5";
                case Types.Array: return "#8ee585";
                case Types.Object: return "#e5ca85";
                case Types.Function: return "#6458e2";
                case Types.Options: return "#e59d85";
            }
        }
        else {
            return "#c1c1c1";
        }            
    }

    returnTypeString(){
        if(this.content.component) return this.content.component.type;
        else if(this.output || this.input) return TypeToString(
            (this.output) ? 
            this.output.type as Types : 
            this.input.type as Types
        )
        else return null;
    }
}
</script>
