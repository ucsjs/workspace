<template>
    <div class="layout-box">
        <LayoutPanel 
            v-for="(value, key) in contents" 
            :key="key" 
            :content="value" 
            class="layout-panel"
            @mousemove="removeEmptyPanels"
        >
            <slot/>
        </LayoutPanel>

        <LayoutDragPreview @addItemRoot="addItemRoot" @change="removeEmptyPanels" @drop="drop"></LayoutDragPreview>

        <div class="layout-drop-areas" v-if="storage.inDrag">
            <div class="layout-drop-area-left layout-drop-area" direction="left"></div>
            <div class="layout-drop-area-right layout-drop-area" direction="right"></div>
        </div>
    </div>
</template>

<style scoped>
.layout-box {
    overflow: hidden;
    background-color: rgb(67, 67, 67);
    display: flex; 
    flex-direction: row; 
    height: 100vh;
}

.layout-panel {
    flex: 1;
}

.layout-drop-area-left {
    position: fixed;
    min-width: 100px;
    height: 100%;
    z-index: 999;
    top: 0px;
    left: 0px;
}

.layout-drop-area-right {
    position: fixed;
    min-width: 100px;
    height: 100%;
    z-index: 999;
    top: 0px;
    right: 0px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { uuid } from "vue3-uuid";

import { componentIndexStorage } from "../../stores/componentIndex";
import { dragStorage } from "../../stores/dragStorage";
import { ILayoutItem, ILayout, ILayoutPanel } from "../../interfaces";
import LayoutPanel from "./LayoutPanel.vue";
import LayoutDragPreview from "./LayoutDragPreview.vue";

import BlueprintEditor from "../blueprint/BlueprintEditor.vue";

export default defineComponent({
    components: { 
        LayoutPanel,
        LayoutDragPreview
    },

    setup(props, context){
        const componentIndex = componentIndexStorage();
        const storage = dragStorage();
        componentIndex.setLayout({ props, context });
        return { storage };
    },

    data(): ILayout {
        return {            
            index: new Map<string, ILayoutItem>(),
            previewDragPainel: null,
            dropAreaSelected: null,
            contents: [
                {
                    id: uuid.v4(),                        
                    rows: [{
                        currentItemSelected: 0,
                        items: [
                            { 
                                id: "content-1", 
                                namespace: "item 1", 
                                icon: "fa-solid fa-file", 
                                items: [],
                                content: BlueprintEditor
                            }
                        ]
                    }]                        
                }
            ] 
        }
    },

    methods: {
        addItemRoot(item: ILayoutItem, unshift: boolean) {
            if(this.previewDragPainel === null){
                this.previewDragPainel = item.id;

                if(this.storage.currentPanel && this.storage.currentPanel.rows && this.storage.position){
                    this.storage.currentPanel.rows[this.storage.position.row].items = this.storage.currentPanel.rows[this.storage.position.row].
                        items.filter((value, key) => (value as ILayoutItem).id !== item.id); 
                }

                let newPanel : ILayoutPanel =  {
                    id: uuid.v4(),
                    rows: [ { items: [ item ], currentItemSelected: 0 } ]
                };

                if(this.contents){
                    if(unshift)
                    this.contents.unshift(newPanel);
                else 
                    this.contents.push(newPanel);
                }
                
                this.removeEmptyPanels();
            }
        },

        drop(){
            this.previewDragPainel = null;
        },

        removeEmptyPanels(){
            if(this.storage.inDrag){
                this.contents = (this.contents) ? this.contents?.filter((item) => item.rows.length > 0) : null; 
                this.reIndex();
            }               
        },

        reIndex(){
            for(let itemKey in this.index){
                if(this.contents?.filter((item) => item.id === itemKey).length === 0){
                    this.index.delete(itemKey);
                }
            }                
        }
    }
});
</script>
