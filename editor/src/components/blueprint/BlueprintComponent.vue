<template>
    <div>
        <div
            v-if="isBlueprintInput() && content && content.component"
            :class="[(inputSelected === content.component?.id || selectedItem === id) ? 'component-input-selected' : '', 'component-input component']"
            :style="{left: `${content.x}px`, top: `${content.y}px`}"
        > 
            <span>{{ content.component?.name }}</span>
            
            <BlueprintConnection :content="content"></BlueprintConnection>
        </div>
        <div 
            v-else-if="isBlueprint() && content && content.blueprint"
            class="component-node"
            :style="{left: `${content.x}px`, top: `${content.y}px`}"
        >
            <header>
                <img 
                    v-if="content.blueprint.icon && content.blueprint.icon.includes('/')"
                    :src="content.blueprint.icon" 
                    class="component-node-icon" 
                />

                <i 
                    v-if="content.blueprint.icon && !content.blueprint.icon.includes('/')"
                    :class="[content.blueprint.icon, 'component-node-icon']" 
                    style="margin-top: 5px"
                ></i>

                {{ (content.blueprint.displayName) ? 
                    content.blueprint.displayName : 
                    content.blueprint.namespace }}
            </header>

            <div 
                class="component-node-intputs-outputs" 
            >
                <div class="component-node-intputs">
                    <div 
                        v-for="intput in content.blueprint.inputs"
                        :key="intput.name"
                        class="component-blueprint-input"
                    >
                        <BlueprintConnection 
                            :intput="intput"
                            @mousedown.left.stop
                        ></BlueprintConnection>

                        <span>{{ intput.name }}</span>
                    </div>
                </div>
                <div class="component-node-outputs">
                    <div 
                        v-for="output in content.blueprint.outputs"
                        :key="output.name"
                        class="component-blueprint-output"
                    >
                        <span>{{ output.name }}</span>

                        <BlueprintConnection 
                            :output="output"
                            @mousedown.left.stop
                        ></BlueprintConnection>
                    </div>
                </div>
            </div>

            <div 
                class="component-node-properties"
                @mousedown.left.stop
            >
                <div 
                    v-for="property in content.blueprint.properties"
                    :key="property.name"
                    class="component-blueprint-property"
                >
                    {{ property.displayName }}

                    <blueprint-property 
                        :property="property"
                        class="component-blueprint-property-input"
                    ></blueprint-property>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.component {
    position: absolute;
    display: flex;
    align-items: center;
}

.component span {
    padding: 5px;
}

.component-input {
    background-color: #575758;
    padding: 5px 10px;
    border: 1px solid #191919;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    border-radius: 25px;
    color: #b1b1b1;
    font-size: 12px;
}

.component-blueprint-input, .component-blueprint-output {
    padding: 5px 10px;
    color: #b1b1b1;
    font-size: 12px;
    display: flex;
    align-items: center;
}

.component-blueprint-input {
    padding-left: 5px;
}  

.component-blueprint-output {
    padding-right: 5px;
}   

.component-input-selected {
    outline: 2px solid #327090;
}

.component-input:hover{
    outline: 3px solid #327090;
}

.component-node {
    position: absolute;
    min-width: 240px;
    min-height: 100px;
    max-width: 300px;
    background-color: #2b2b2b;
    border: 1px solid #191919;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
}

.component-node header {
    width: 100%;
    color: #FFF;
    padding: 5px 10px;
    background-color: #393939;
    border-bottom: 1px solid #191919;
    -webkit-border-top-left-radius: 5px;
    -webkit-border-top-right-radius: 5px;
    -moz-border-radius-topleft: 5px;
    -moz-border-radius-topright: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
}

.component-node header span {
    padding-top: 5px;
    padding-left: 5px;
}

.component-node-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.component-node-intputs-outputs {
    display: flex;
}

.component-node-intputs-outputs span {
    padding: 5px;
}

.component-node-intputs {
    align-items: flex-start;
    display: flex;
    width: 50%;
    background-color: #393939;
}

.component-node-outputs {
    display: flex;
    width: 50%;
    overflow: hidden;
    margin: auto;
    text-align: right;
    justify-content: flex-end; 
}

.component-node-properties {
    background-color: #393939;
    border-top: 1px solid #191919;
    padding: 5px;
}

.component-blueprint-property {
    display: flex;
    padding: 5px;
    color: #b1b1b1;
    font-size: 12px;
}

.component-blueprint-property-input {
    display: flex; 
    justify-content: flex-end;
    margin-left: auto;
    right: 0px;
    width: 50%;
    overflow: hidden;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';

import { 
    IBlueprintComponent, 
    BlueprintComponentType 
} from "../../interfaces";

import BlueprintConnection from "./BlueprintConnection.vue";
import BlueprintProperty from "./BlueprintProperty.vue";

@Component({
    components: {
        BlueprintConnection,
        BlueprintProperty
    }
})
export default class BlueprintComponent extends Vue {
    @Prop({ required: false, default: null })
    id!: String;

    @Prop({ required: true, default: { } })
    content!: IBlueprintComponent;

    @Prop({ required: false, default: null })
    inputSelected!: String;

    @Prop({ required: false, default: null })
    selectedItem!: String

    public isBlueprintInput(){
        return (this.content.type === BlueprintComponentType.Input);
    }

    public isBlueprint(){
        return (this.content.type === BlueprintComponentType.Blueprint);
    }
}
</script>
