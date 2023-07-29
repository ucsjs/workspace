<template>
    <div class="blueprint-editor">
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
                    v-for="(item, key) in items" :key="key" 
                >
                    <blueprint-component   
                        :id="item[0]"                      
                        :content="item[1]" 
                        :inputSelected="inputSelected"
                        :selectedItem="selectedItem"
                        @click="selectItem(item[0], item[1].component)"                        
                        @mouseover="mouseOverComponent(item[1].component.id)"
                        @mouseleave="mouseLeaveComponent"    
                        ref="components"                    
                    ></blueprint-component>
                </drag-handle>

                <blueprint-nodes-navbar 
                    ref="nodesNavbar"
                    @create-blueprint="createBlueprint"
                ></blueprint-nodes-navbar>
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
import { Component, Ref } from 'vue-facing-decorator';
import { Subscriber } from '@decorators';
import { WS } from "@mixins/ws";
import { uuid } from "vue3-uuid";

import { 
    IBlueprintInput,  
    IBlueprintComponent,
    BlueprintComponentType
} from "../../interfaces";

import DragHandle from "../drag/DragHandle.vue";
import BlueprintNavbar from "./BlueprintNavbar.vue";
import BlueprintInputs from "./BlueprintInputs.vue";
import BlueprintComponent from "./BlueprintComponent.vue";
import BlueprintInspector from "./BlueprintInspector.vue";
import BlueprintNodesNavbar from "./BlueprintNodesNavbar.vue";

@Component({
    components: { 
        DragHandle,
        BlueprintNavbar,
        BlueprintInputs, 
        BlueprintComponent,
        BlueprintInspector,
        BlueprintNodesNavbar 
    }
})
export default class BlueprintEditor extends WS {
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

    items= new Map<string, IBlueprintComponent>();

    @Ref
    readonly contents!: HTMLDivElement;

    @Ref
    readonly inputs!: typeof BlueprintInputs;

    @Ref
    readonly nodesNavbar!: typeof BlueprintNodesNavbar;

    async mounted(){
        await this.deserialize();
    }

    @Subscriber("auth.Success")
    loadDependeces(){
        WS.send(WS.pack("blueprint", "Request"));
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
        this.items.set(id, { id, x, y, component: item, type: BlueprintComponentType.Input });
        this.dragItem = null;
        this.saveLocal();
    }

    hiddenPreview(event){
        event.dataTransfer.setDragImage(new Image(), 0, 0);
    }

    mouseOverComponent(itemId: string){
        this.inputs.itemMouseOver(itemId);
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
        let item = this.items.get(componentId);

        if(item){
            item.x = item.x - x;
            item.y = item.y - y;

            this.items.set(componentId, item);
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

        this.items.forEach((value: IBlueprintComponent, key: string) => {
            if(value.component.id === componentId)
                value.component.name = name;

            items.set(key, value);
        });

        this.items = items;
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

    saveLocal(){
        localStorage.setItem(`editor-${this.id}`, JSON.stringify(this.serialize()));
    }

    deserialize(){
        let storageData = localStorage.getItem(`editor-${this.id}`);

        if(storageData){
            let settings = JSON.parse(storageData);
            this.inputs.inputs = settings.inputs;

            settings.items.forEach(obj => {
                this.items.set(obj[0], obj[1]);
            });
        }            
    }

    serialize(){
        return {
            inputs: this.inputs.serialize(),
            items: Array.from(this.items)
        }
    }
}
</script>
