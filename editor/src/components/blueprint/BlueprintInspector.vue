<template>
    <div class="blueprint-inspector">
        <header>
            <span>Inspector</span>
        </header>

        <div class="blueprint-inspector-inputs" v-if="rootItem">
            <div>
                <div class="blueprint-inspector-input-label">ID:</div> 
                <input class="blueprint-inspector-input" :value="rootItem.id" disabled />
            </div>

            <div>
                <div class="blueprint-inspector-input-label">Name:</div> 
                <input class="blueprint-inspector-input" :value="rootItem.name" />
            </div>

            <div>
                <div class="blueprint-inspector-input-label">Default:</div> 
                <input class="blueprint-inspector-input" :value="rootItem.default" />
            </div>            
        </div>
    </div>
</template>

<style scoped>
.blueprint-inspector{
    position: absolute;
    width: 300px;
    height: 380px;
    background-color: #2b2b2b;
    right: 20px;
    top: 20px;
    border: 1px solid #191919;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
}

.blueprint-inspector header {
    color: #FFF;
    padding: 10px;
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

.blueprint-inspector header span {
    padding-top: 5px;
    padding-left: 5px;
}

.blueprint-inspector-input{
    flex: 1;
    padding: 5px;
    background-color: #2e2e2e;
    border: 1px solid #212121;
    color: #757575;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
}

.blueprint-inspector-inputs {
    padding: 5px 10px;
}

.blueprint-inspector-input-label{
    width: 50%;
    align-items: center;
    font-size: 12px;
}

.blueprint-inspector-inputs div {
    padding: 2px 0px;
    color: #757575;
    display: flex;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IBlueprintComponent } from "../../interfaces";

export default defineComponent({
    props: {
        rootItem: {
            type: Object as PropType<IBlueprintComponent>,
            require: true
        }
    },
})
</script>
