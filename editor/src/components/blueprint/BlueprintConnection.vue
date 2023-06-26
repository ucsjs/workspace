<template>
    <div class="blueprint-connection" :style="{border: `2px solid ${getInputColor()}`}">
        <div class="blueprint-connection-inner" :style="{ backgroundColor: getInputColor() }"></div>
    </div>
</template>

<style scoped>
.blueprint-connection{
    height: 12px;
    width: 12px;
    background-color: #212121;
    border-radius: 50%;
    transition: background-color 0.5s ease;
    margin-left: 10px;
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
import { defineComponent, PropType } from 'vue';
import { IBlueprintComponent } from "../../interfaces";

export default defineComponent({
    props: {
        content: {
            type: Object as PropType<IBlueprintComponent>,
            required: true,
            default: { }
        }
    },

    methods: {
        getInputColor(){
            switch(this.content.component.type){
                case "Float": return "#84e4e7";
                case "Integer": return "#9aef92";
                case "String": return "#9aef92";
                case "Date": return "#917fdf";
                case "Color": return "#edf696";
                case "Image": return "#ff8b8b";
                default: return "#c1c1c1";
            }
        }
    }
})
</script>
