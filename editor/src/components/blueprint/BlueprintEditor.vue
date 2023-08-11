<template>
    <div class="blueprint-editor" ref="editor">
        <blueprint-navbar></blueprint-navbar>

        <perfect-scrollbar>        
            <div 
                class="grid-contents block shadow-black shadow-inner" 
                style="width: 5000px; height: 5000px" 
                ref="contents"  
                @contextmenu="openNodeNavbar"
                @click="deselectIfClickedOutside"
                @drop="dropHandler" 
                @dragover.prevent
            >
                <blueprint-inputs 
                    @change="saveLocal"
                    @start-drag="createGhostDrag" 
                    @select-input="selectInput"
                    @over="inputMouseOver"
                    @out="inputMouseOut"
                    @rename="renameComponent"
                    @click.stop
                    ref="inputs"
                ></blueprint-inputs>

                <blueprint-inspector v-if="rootItem" :rootItem="rootItem" @click.stop></blueprint-inspector>

                <drag-handle 
                    @dragged="({ deltaX, deltaY }) => updatePosition(item[0], deltaX, deltaY)" 
                    @click.stop
                    v-for="(item, key) in nodes" :key="key" 
                >
                    <blueprint-component   
                        :id="item[0]"                      
                        :content="item[1]" 
                        :inputSelected="inputSelected"
                        :selectedItem="selectedItem"
                        @click="selectItem(item[0], item[1].component)"                        
                        @mouseover="mouseOverComponent(item[1].component)"
                        @mouseleave="mouseLeaveComponent"    
                        ref="components"                    
                    ></blueprint-component>
                </drag-handle>

                <blueprint-nodes-navbar 
                    ref="nodesNavbar"
                    @create-blueprint="createBlueprint"
                ></blueprint-nodes-navbar>

                <blueprint-line-connector 
                    v-if="tmpLine" 
                    :line="tmpLine" 
                    :offset="linesOffset" 
                    :scale="scale"
                    :scrollOffset="scrollOffset"
                    :transformPosition="position"
                    :lineColor="tmpLine.lineColor"
                    ref="tmpLine"
                ></blueprint-line-connector>
            </div>
        </perfect-scrollbar>
    </div>
</template>

<style scoped>
.blueprint-editor{
    width: 100%;
    height: 100%;
    background-color: #232323;
    background-image:linear-gradient(#232323, #282828);
    position: relative;
}

.grid-contents{
    display: block;
    overflow: hidden;
    touch-action: none;
    outline: 0;
    background-color: transparent;
    background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent);
    height: 100%;
    background-size:50px 50px;
}
</style>

<script lang="ts">
import { Component, Ref, Setup, Watch } from 'vue-facing-decorator';
import { dataStorage } from '@stores/dataStore';
import { Subscribe } from '@decorators';
import { WS } from "@mixins/ws";
import { uuid } from "vue3-uuid";

import { 
    IBlueprintInput,  
    IBlueprintComponent,
    BlueprintComponentType,
    IBlueprint
} from "../../interfaces";

import DragHandle from "../drag/DragHandle.vue";
import BlueprintNavbar from "./BlueprintNavbar.vue";
import BlueprintInputs from "./BlueprintInputs.vue";
import BlueprintComponent from "./BlueprintComponent.vue";
import BlueprintInspector from "./BlueprintInspector.vue";
import BlueprintNodesNavbar from "./BlueprintNodesNavbar.vue";
import BlueprintNode from "./BlueprintNode.vue";

@Component({
    components: { 
        DragHandle,
        BlueprintNavbar,
        BlueprintInputs, 
        BlueprintComponent,
        BlueprintInspector,
        BlueprintNode,
        BlueprintNodesNavbar 
    }
})
export default class BlueprintEditor extends WS {
    @Setup(() => dataStorage())
    dataStore = dataStorage();
    
    id = uuid.v4();

    props = {
        id: {
            type: String,
            require: true
        }
    };

    dragItem: IBlueprintInput | undefined | null = undefined;

    inputSelected: string | undefined | null = undefined;

    selectedItem: string | undefined = undefined;
    
    rootItem: IBlueprintComponent | IBlueprintInput | undefined = undefined;

    lastMousePosition = { x: 0, y: 0 };

    nodes = new Map<string, IBlueprintComponent>();

    @Ref
    readonly editor!: HTMLDivElement;

    @Ref
    readonly contents!: HTMLDivElement;

    @Ref
    readonly inputs!: typeof BlueprintInputs;

    @Ref
    readonly nodesNavbar!: typeof BlueprintNodesNavbar;

    //Line
    linesOffset: any = null;

    scrollOffset = { x: 0, y: 0 };

    tmpLine: any = null;

    refreshLineInterval: any;

    onCreateLine: boolean = false;

    createLineElem: any;

    position = { x: 0, y: 0 };

    scale: number = 1;

    async mounted(){
        await this.deserialize();

        this.linesOffset = this.editor.getBoundingClientRect();

        this.refreshLineInterval = setInterval(() => {
            this.refreshLines();

            if(this.editor)
                this.linesOffset = this.editor.getBoundingClientRect();
        }, 1);
    }

    @Watch("dataStore",{
        immediate: true,
        deep:true
    })
    loadBlueprints(){
        const blueprint = dataStorage().getBlueprint("Interval");
        const blueprint2 = dataStorage().getBlueprint("Crypto");
        const blueprint3 = dataStorage().getBlueprint("MongoDBFind");

        this.nodes.set("1", {
            x: 400,
            y: 300,
            id: "Teste",
            type: BlueprintComponentType.Blueprint,
            blueprint
        });

        this.nodes.set("2", {
            x: 700,
            y: 300,
            id: "Teste2",
            type: BlueprintComponentType.Blueprint,
            blueprint: blueprint2
        });

        this.nodes.set("3", {
            x: 700,
            y: 100,
            id: "Teste3",
            type: BlueprintComponentType.Blueprint,
            blueprint: blueprint3
        });
    }

    @Subscribe("auth.Success")
    loadDependeces(){
        WS.send(WS.pack("blueprint", "Request"));
    }

    @Subscribe("blueprint.BlueprintList")
    async receiveBlueprints(data: any){
        let blueprintGroups = {};
        let blueprintIndex = {};

        dataStorage().save("blueprints", data?.blueprints);

        for(let blueprint of data?.blueprints){
            if(!blueprintGroups[blueprint.group])
                blueprintGroups[blueprint.group] = new Map();

            if(!blueprintGroups[blueprint.group].has(blueprint.namespace))
                blueprintGroups[blueprint.group].set(blueprint.namespace, blueprint as IBlueprint);

            blueprintIndex[blueprint.namespace] = blueprint as IBlueprint;
        }

        const sortedGroups = Object.keys(blueprintGroups).sort().reduce(
            (obj, key) => { 
                obj[key] = blueprintGroups[key]; 
                return obj;
            }, 
            {}
        );

        dataStorage().save("blueprintGroups", sortedGroups);
        dataStorage().save("blueprintIndex", blueprintIndex);
    }

    createGhostDrag(item: IBlueprintInput){
        this.dragItem = item;
    }

    dropHandler(event){
        if(this.dragItem){
            const rootRect = this.contents.getBoundingClientRect();
            const x = event.clientX - rootRect.left;
            const y = event.clientY - rootRect.top;
            this.createComponentInput(x, y, this.dragItem);
        }            
    }

    createComponentInput(x: number, y: number, item: IBlueprintInput){
        const id = uuid.v4();

        this.nodes.set(id, { 
            id, x, y, 
            component: item, 
            type: BlueprintComponentType.Input 
        });

        this.dragItem = null;
        this.saveLocal();
    }

    hiddenPreview(event){
        event.dataTransfer.setDragImage(new Image(), 0, 0);
    }

    mouseOverComponent(component: IBlueprintComponent | IBlueprintInput | undefined){
        if(component)
            this.inputs.itemMouseOver(component.id);
    }

    mouseLeaveComponent(){
        this.inputs.itemMouseOut();
    }

    inputMouseOver(id: string){
        this.inputSelected = id;
    }

    inputMouseOut(){
        this.inputSelected = null;
    }

    updatePosition(componentId, x, y){
        let item = this.nodes.get(componentId);

        if(item){
            item.x = item.x - x;
            item.y = item.y - y;

            this.nodes.set(componentId, item);
            this.saveLocal();
        }
    }

    selectItem(componentId: string, rootId: IBlueprintComponent | IBlueprintInput | undefined){
        this.selectedItem = componentId;
        this.rootItem = rootId;
    }

    selectInput(input: IBlueprintInput){
        this.rootItem = input;
    }

    renameComponent(componentId: string, name: string){
        let items = new Map<string, IBlueprintComponent>();

        this.nodes.forEach((value: IBlueprintComponent, key: string) => {
            if(value.component && value.component.id === componentId)
                value.component.name = name;

            items.set(key, value);
        });

        this.nodes = items;

        this.saveLocal();
    }

    deselectIfClickedOutside(event) {
        if (this.selectedItem){
            this.selectedItem = undefined;
            this.rootItem = undefined;
        }                
    }

    openNodeNavbar(event){
        const rootRect = this.contents.getBoundingClientRect();
        const x = event.clientX - rootRect.left;
        const y = event.clientY - rootRect.top;

        this.lastMousePosition = { x, y };
        this.nodesNavbar.open();
        event.preventDefault();
    }

    createBlueprint(blueprint){
        console.log(blueprint);
    }

    createLine(event, item, input, key, id) {
        if(!this.onCreateLine) {
            this.onCreateLine = true;
            this.createLineElem = { el: event.target, item, input, id, key };
            this.tmpLine = { from: event.target, to: this.$refs.mousePointer };
        }
    }

    refreshLines() {
        if(this.tmpLine !== null && this.tmpLine != undefined)
            this.$refs.tmpLine.draw();

        if(this.$refs.lines) {
            for(let line of this.$refs.lines)
                line.draw();
        }            
    }

    resertPosition() {
        this.position = { x: 0, y: 0 };
        this.scale = 1;
    }

    saveLocal(){
        localStorage.setItem(`editor-${this.id}`, JSON.stringify(this.serialize()));
    }

    deserialize(){
        let storageData = localStorage.getItem(`editor-${this.id}`);

        if(storageData){
            let settings = JSON.parse(storageData);
            this.inputs.inputs = settings.inputs;

            settings.items.forEach(obj => {
                this.nodes.set(obj[0], obj[1]);
            });
        }            
    }

    serialize(){
        return {
            inputs: this.inputs.serialize(),
            items: Array.from(this.nodes)
        }
    }
}
</script>
