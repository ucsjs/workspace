<template>
    <div class="layout-panel">
        <div 
            :class="[(mouseOver && storage.inDrag) ? 'layout-panel-dropzone' : '','layout-panel-row layout-panel-drop']" 
            v-for="(row, keyRow) in content.rows" :key="keyRow"
            :id="id"
        >
            <div class="layout-panel-top-resize" v-if="keyRow > 0" @drag="resizeVertical($event, keyRow)">
                <div class="layout-panel-top-resize-handle"></div>
            </div>

            <div 
                class="layout-panel-row-contents"                 
                @drop="dropItem" 
            >
                <header v-if="row.items && row.items?.length > 0" class="layout-item-header" :id="id" :row="keyRow">
                    <div 
                        v-for="(item, key) in row.items" 
                        :key="item.namespace" 
                        :class="[(row.currentItemSelected === key) ? 'layout-item-active' : 'layout-item']"
                        draggable="true"
                        @click="selectItem(keyRow, key)"
                        @dragstart="startDrag(item, keyRow, key, $event)"
                        @mouseover="handleMouseOver"
                    >
                        <i :class="item.icon" v-if="item.icon" class="layout-item-icon" />
                        <span>{{ item.namespace }}</span>
                    </div>

                    <div class="layout-item-minimenu">
                        <button class="layout-item-minimenu-button"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    </div>
                </header>

                <main v-if="row.items && row.items?.length > 0" :id="id">
                    <div v-for="(item, key) in row.items" :key="item.id" class="layout-panel-contents">                        
                        <component v-if="item.content && row.currentItemSelected === key" :is="item.content" :id="item.id"></component>
                    </div>                    
                </main>

                <div class="layout-item-header-dropzone" v-if="storage.inDrag" :id="id" :row="keyRow"></div>
            </div>
        </div>

        <div class="layout-item-bottom-dropzone" v-if="storage.inDrag" :id="id"></div>
        <div class="layout-panel-resize-box" @drop="finishResize" @mousemove="resizeMoveMouse" v-if="resizeBox"></div>
    </div>
</template>

<style scoped>
.layout-panel{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;
    gap: 1px;
}

.layout-panel-row{
    flex: 1;
    border-right: 2px solid #000;
    margin-bottom: 1px;
    overflow: hidden;
}

.layout-panel-row-contents {
    position: relative;
    min-width: 300px;
    width: 100%;
    background-color: #3c3c3c;
    overflow: hidden;   
    height: 100%; 
}

.layout-panel header {
    width: 100%;
    height: 30px;
    background-color: #282828;
    display: flex;
    font-size: 14px;
    user-select: none;
}

.layout-panel main {
    width: auto;
    height: calc(100% - 30px);
    background-color: #282828;
    display: flex;
    font-size: 14px;
    user-select: none;
}

.layout-item-header-dropzone{
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    height: 300px;
    z-index: 999;
}

.layout-panel header .layout-item, .layout-item-active {
    border-top: 3px solid #282828;
    padding: 0 10px 0 10px;
    color: #c4c4c4;
    -webkit-border-top-left-radius: 3px;
    -webkit-border-top-right-radius: 3px;
    -moz-border-radius-topleft: 3px;
    -moz-border-radius-topright: 3px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    cursor: default;
}

.layout-panel header .layout-item:hover {
    background-color: #303030;
    color: #c4c4c4;
}

.layout-panel header .layout-item-active {
    background-color: #3c3c3c;
    border-top: 2px solid #2c5d87;
}

.layout-panel header .layout-item-active:hover {
    background-color: #3c3c3c;
    border-top: 2px solid #2c5d87;
}

.layout-item-icon{
    font-size: 12px;
    padding-right: 10px;
}

.layout-item-minimenu{
    display: flex; 
    justify-content: flex-end;
    margin-left: auto;
    right: 0px;
    width: 50px;
    height: 100%;
}

.layout-item-minimenu-button{
    width: 20px;
    padding: 0 5px 0 5px;
    margin: 2px 2px 2px 0;
    cursor: default;
    color: #c4c4c4
}

.layout-item-minimenu-button:hover{
    background-color: #3c3c3c;
}

.layout-item-bottom-dropzone{
    position: absolute;
    height: 300px;
    width: 100%;
    bottom: 0px;
}

.layout-panel-top-resize{
    background-color: #000;
    height: 2px;
}

.layout-panel-top-resize-handle{
    position: absolute;
    cursor: ns-resize;
    background-color: #2c5d87;
    height: 10px;
    width: 100%;
    z-index: 999;
}

.layout-panel-resize-box{
    position: fixed;
    width: 100%;
    height: 100em;
    z-index: 9999999;
}

.layout-panel-contents{
    height: 100%;
    width: 100%;
}
</style>

<script lang="ts">
import { uuid } from "vue3-uuid";
import { defineComponent, PropType, ref } from 'vue';

import { ILayoutItem, ILayoutPanel } from '../../interfaces';
import { dragStorage } from "../../stores/dragStorage";
import { componentIndexStorage } from "../../stores/componentIndex";

export default defineComponent({
    props: {
        content: {
            type: Object as PropType<ILayoutPanel>,
            required: true,
            default: { rows: [] }
        }
    },

    setup(props, context) {
        const storage = dragStorage();
        const componentIndex = componentIndexStorage();
        const id = uuid.v4();
        const resizeBox = ref(false);

        componentIndex.register(id, props, context);

        let mouseOver = ref(false);

        const selectItem = (row: number, index: number) => {
            if(index != props.content.rows[row].currentItemSelected)
                props.content.rows[row].currentItemSelected = index;
        };

        const startDrag = (item: ILayoutItem, keyRow: number, index: number, event: DragEvent) => {
            storage.startDrap(item, props.content, keyRow, index); 

            if(props.content.rows && props.content.rows[keyRow]){
                props.content.rows[keyRow].items = props.content.rows[keyRow].items.filter((value, key) => key !== index); 
                props.content.rows[keyRow].currentItemSelected = 0;
            }

            event.preventDefault();

            if(event && event.dataTransfer)
                event.dataTransfer.setDragImage(new Image(), 0, 0);
        };

        const dropItem = (event: DragEvent) => {
            event.preventDefault();
            let data = storage.endDrap();
        };

        const handleMouseOver = (event: MouseEvent) => {
            mouseOver.value = true;
            event.preventDefault();

            if(event && event.target)
                storage.setTarget(event.target);            
        };

        const resizeVertical = (event: DragEvent, index: number) => {
            resizeBox.value = true;
        };

        const resizeMoveMouse = (event: MouseEvent) => {

        };

        const finishResize = () => {

        };

        return {
            id,
            storage,
            resizeBox,
            selectItem,
            startDrag,
            dropItem,
            handleMouseOver,  
            resizeVertical, 
            resizeMoveMouse,
            finishResize,         
            componentIndex,
            mouseOver
        };
    }
});
</script>
