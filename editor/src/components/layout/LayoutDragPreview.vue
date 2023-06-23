<template>
    <div 
        :class="[(hiddenPreview) ? 'layout-item-drag-preview-hidden' : '', 'layout-item-drag-preview layout-panel']" 
        :style="{top: `${position.y - 90}px`, left: `${position.x - 135}px`}" 
        @mouseup="dropItem"
        @mousemove="moveItem"
        v-if="storage.inDrag"
    >
        <header >
            <div class="layout-item-active">
                <i :class="storage.item?.icon" v-if="storage.item?.icon" class="layout-item-icon" />
                <span>{{ storage.item?.namespace }}</span>
            </div>
        </header>
    </div>
</template>

<style scoped>
.layout-item-drag-preview{
    position: fixed;
    width: 270px;
    height: 180px;
    border: 1px solid #000;
    background-color: #3c3c3c;
    overflow: hidden;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    z-index: 999999;
}

.layout-panel header {
    width: 100%;
    height: 30px;
    background-color: #282828;
    display: flex;
    font-size: 14px;
    user-select: none;
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

.layout-panel header .layout-item-active {
    background-color: #3c3c3c;
    border-top: 3px solid #2c5d87;
}
</style>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import { ILayoutItem, ILayoutPanel } from "../../interfaces";
import { dragStorage } from "../../stores/dragStorage";
import { componentIndexStorage } from "../../stores/componentIndex";
import { globalMixin } from "../../lib/mixin";

export default defineComponent({
    emits: {
        addItemRoot: (data: ILayoutItem, unshift: boolean) => true,
        change: () => true,
        drop: () => true
    },

    setup(props, context) {
        const storage = dragStorage();
        const componentIndex = componentIndexStorage();
        const position = ref({ x: 0, y: 0 });
        const hiddenPreview = ref(false);

        const updatePosition = (event) => {
            position.value = { x: event.pageX, y: event.pageY };
        };

        watch(() => storage.$state, (newValue, oldValue) => {
            console.log('DrapStorage foi alterado:', newValue);
        });

        const moveItem = (event: MouseEvent) => {
            event.preventDefault();
            let data = storage.item as ILayoutItem;

            const componentBottom = globalMixin.getComponentFromPoint(event, "layout-item-bottom-dropzone");
            const componentHeader = globalMixin.getComponentHeader(event);
            const component = globalMixin.getComponentFromPoint(event);            
            const layoutDropArea = globalMixin.getLayoutDropZone(event);

            hiddenPreview.value = true;

            if(layoutDropArea){
                try{
                    switch(layoutDropArea){
                        case "left": context.emit("addItemRoot", data, true);
                        case "right": context.emit("addItemRoot", data, false);
                    }    
                    
                    context.emit("change");
                }
                catch(e){}
            }
            else if(componentBottom){ //Create new row   
                context.emit("drop");

                const { props } = component;
                let content = props.content as ILayoutPanel;

                if(content && content.rows){
                    storage.removeItemFromCurrentPanel(data.id, "componentBottom");                    
                    content.rows.push({ items: [ data ], currentItemSelected: 0 }); 
                    storage.changePanel(content, { row: content.rows.length -1,  index: 0 });
                    context.emit("change");
                } 
            }
            else if(componentHeader){ //On header
                context.emit("drop");

                const { props } = component;
                let content = props.content as ILayoutPanel;

                if(content && content.rows && componentHeader.row){
                    storage.removeItemFromCurrentPanel(data.id, "componentHeader");                    
                    content.rows[componentHeader.row].items.push(data); 
                    storage.changePanel(content, { row: content.rows.length -1,  index: 0 });
                    context.emit("change");
                } 
            }            
            else if(component){ //Drop on panel    
                context.emit("drop");

                const { props } = component;
                let content = props.content as ILayoutPanel;

                if(content && content.rows && !storage.isCurrentPanel(content)){
                    storage.removeItemFromCurrentPanel(data.id, "component");                              
                    content.rows[0].items.push(data);
                    content.rows[0].currentItemSelected = content.rows[0].items.length - 1;
                    storage.changePanel(content, { row: 0,  index: content.rows[0].items.length - 1 });
                    context.emit("change");
                }                    
            }
        }

        const dropItem = (event: MouseEvent) => {
            event.preventDefault();
            storage.endDrap();     
            context.emit("drop");  
        };

        return {
            storage,
            componentIndex,
            position,
            hiddenPreview,
            dropItem,
            moveItem,
            updatePosition,                        
            item: {} as ILayoutItem
        };
    },

    mounted(){
        window.addEventListener('mousemove', this.updatePosition);
    },

    beforeUnmount() {
        window.removeEventListener('mousemove', this.updatePosition);
    },

    methods: {
        updatePosition(event){
            this.position = { x: event.pageX, y: event.pageY };
        }
    }
})
</script>
