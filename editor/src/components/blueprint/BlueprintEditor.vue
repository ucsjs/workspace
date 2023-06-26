<template>
    <div class="blueprint-editor">
        <blueprint-navbar></blueprint-navbar>

        <perfect-scrollbar>        
            <div 
                class="grid-contents block shadow-black shadow-inner" 
                style="width: 5000px; height: 5000px" 
                ref="contents"  
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

                <blueprint-inspector :rootItem="rootItem" @click.stop></blueprint-inspector>

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
import { defineComponent } from 'vue';
import { uuid } from "vue3-uuid";

import { 
    IBlueprintInput, 
    IBlueprintEditor, 
    IBlueprintComponent,
    BlueprintComponentType
} from "../../interfaces";

import DragHandle from "../drag/DragHandle.vue";
import BlueprintNavbar from "./BlueprintNavbar.vue";
import BlueprintInputs from "./BlueprintInputs.vue";
import BlueprintComponent from "./BlueprintComponent.vue";
import BlueprintInspector from "./BlueprintInspector.vue";

export default defineComponent({
    components: { 
        DragHandle,
        BlueprintNavbar,
        BlueprintInputs, 
        BlueprintComponent,
        BlueprintInspector 
    },

    props: {
        id: {
            type: String,
            require: true
        }
    },

    data(): IBlueprintEditor {
        return {
            dragItem: null,
            inputSelected: null,
            selectedItem: null,
            rootItem: null, 
            items: new Map<string, IBlueprintComponent>()
        }
    },

    async mounted(){
        await this.deserialize();
    },

    methods: {
        createGhostDrag(item: IBlueprintInput){
            this.dragItem = item;
        },

        dropHandler(event){
            if(this.dragItem){
                const rootRect = this.$refs.contents.getBoundingClientRect();
                const x = event.clientX - rootRect.left;
                const y = event.clientY - rootRect.top;
                this.createComponentInput(x, y, this.dragItem);
            }            
        },

        createComponentInput(x: number, y: number, item: IBlueprintInput){
            this.items.set(uuid.v4(), { x, y, component: item, type: BlueprintComponentType.Input });
            this.dragItem = null;
            this.saveLocal();
        },

        hiddenPreview(event){
            event.dataTransfer.setDragImage(new Image(), 0, 0);
        },

        mouseOverComponent(itemId: string){
            this.$refs.inputs.itemMouseOver(itemId);
        },

        mouseLeaveComponent(){
            this.$refs.inputs.itemMouseOut();
        },

        inputMouseOver(id: string){
            this.inputSelected = id;
        },

        inputMouseOut(){
            this.inputSelected = null;
        },

        updatePosition(componentId, x, y){
            let item = this.items.get(componentId);
            item.x = item.x - x;
            item.y = item.y - y;

            this.items.set(componentId, item);
            this.saveLocal();
        },

        selectItem(componentId: string, rootId: IBlueprintComponent){
            this.selectedItem = componentId;
            this.rootItem = rootId;
        },

        selectInput(input: IBlueprintInput){
            this.rootItem = input;
        },

        renameComponent(componentId: string, name: string){
            let items = new Map<string, IBlueprintComponent>();

            this.items.forEach((value: IBlueprintComponent, key: string) => {
                if(value.component.id === componentId)
                    value.component.name = name;

                items.set(key, value);
            });

            this.items = items;
            this.saveLocal();
        },

        deselectIfClickedOutside(event) {
            if (this.selectedItem){
                this.selectedItem = null;
                this.rootItem = null;
            }                
        },

        saveLocal(){
            localStorage.setItem(`editor-${this.id}`, JSON.stringify(this.serialize()));
        },

        deserialize(){
            let storageData = localStorage.getItem(`editor-${this.id}`);

            if(storageData){
                let settings = JSON.parse(storageData);
                this.$refs.inputs.inputs = settings.inputs;

                settings.items.forEach(obj => {
                    this.items.set(obj[0], obj[1]);
                });
            }            
        },

        serialize(){
            return {
                inputs: this.$refs.inputs.serialize(),
                items: Array.from(this.items)
            }
        }
    }
})
</script>
