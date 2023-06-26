<template>
    <div
        v-if="isBlueprintInput() && content && content.component"
        :class="[(inputSelected === content.component?.id || selectedItem === id) ? 'component-input-selected' : '', 'component-input component']"
        :style="{left: `${content.x}px`, top: `${content.y}px`}"
    > 
        <span>{{ content.component?.name }}</span>
        
        <BlueprintConnection :content="content"></BlueprintConnection>
    </div>
</template>

<style scoped>
.component{
    position: absolute;
    display: flex;
    align-items: center;
}

.component span {
    padding: 5px;
}

.component-input{
    background-color: #575758;
    padding: 5px 10px;
    border: 1px solid #191919;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    border-radius: 25px;
    color: #b1b1b1;
    font-size: 12px;
}

.component-input-selected {
    outline: 2px solid #327090;
}

.component-input:hover{
    outline: 3px solid #327090;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IBlueprintComponent, BlueprintComponentType } from "../../interfaces";
import BlueprintConnection from "./BlueprintConnection.vue";

export default defineComponent({
    components: { BlueprintConnection },

    props: {
        id: {
            type: String,
            require: false,
            default: null
        },
        content: {
            type: Object as PropType<IBlueprintComponent>,
            required: true,
            default: { }
        },
        inputSelected: {
            type: String,
            require: false,
            default: null
        },
        selectedItem: {
            type: String,
            require: false,
            default: null
        }
    },

    methods: {
        isBlueprintInput(){
            return (this.content.type === BlueprintComponentType.Input);
        }
    }
})
</script>
