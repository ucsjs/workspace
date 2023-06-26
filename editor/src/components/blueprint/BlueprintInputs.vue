<template>
    <div class="blueprint-inputs">
        <header>
            <span>Inputs</span>

            <div class="blueprint-inputs-minimenu">
                <blueprint-context-menu :items="inputTypes" @select="addInput">
                    <button class="blueprint-inputs-add">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </blueprint-context-menu>                
            </div>
        </header>

        <main class="blueprint-inputs-contents">
            <perfect-scrollbar>
                <div v-for="item in inputs" :key="item" class="blueprint-inputs-item">
                    <div 
                        :class="[(selectedItem === item.id || itemOver === item.id) ? 'blueprint-inputs-item-selected' : '', 'blueprint-inputs-item-name']" 
                        v-if="renameInput !== item.id"
                        @dragstart="$emit('start-drag', item)" 
                        @mouseover="mouseOver(item.id)"
                        @mouseout="mouseOut"
                        @click="selectInput(item.id)"
                        @dblclick="rename(item.id)"
                        draggable="true"
                    >{{ item.name }}</div>
                    <div class="blueprint-inputs-item-type" v-if="renameInput !== item.id">{{ item.type }}</div>
                    <input 
                        :value="item.name" class="blueprint-input-contents-rename" 
                        v-if="renameInput === item.id" 
                        @blur="(e) => changeName(item.id, e.target.value)"
                        @keyup.enter="(e) => changeName(item.id, e.target.value)"
                        @keyup.esc="renameInput = null"
                        ref="renameInput"
                    />
                </div>
            </perfect-scrollbar>
        </main>
    </div>
</template>

<style scoped>
.blueprint-inputs{
    position: absolute;
    width: 300px;
    height: 380px;
    background-color: #2b2b2b;
    left: 20px;
    top: 20px;
    border: 1px solid #191919;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
}

.blueprint-inputs header {
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

.blueprint-inputs header span {
    padding-top: 5px;
    padding-left: 5px;
}

.blueprint-inputs-minimenu{
    display: flex; 
    justify-content: flex-end;
    margin-left: auto;
    right: 0px;
    width: 50px;
    height: 100%;
}

.blueprint-inputs-add{
    padding: 5px 10px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    border: 1px solid #393939;
    cursor: default;
}

.blueprint-inputs-add:hover{
    background-color: #676767;
    border: 1px solid #191919;
}

.blueprint-inputs-contents{
    position: relative;
    width: 100%;
    height: calc(100% - 54px);
    padding: 5px 0 5px 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}

.blueprint-inputs-item{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 5px 10px;
}

.blueprint-inputs-item-name{
    background-color: #575758;
    padding: 5px 10px;
    border: 1px solid #191919;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    border-radius: 25px;
    color: #b1b1b1;
    font-size: 12px;
}

.blueprint-inputs-item-selected {
    outline: 2px solid #327090;
}

.blueprint-inputs-item-name:hover {
    outline: 3px solid #327090;
}

.blueprint-inputs-item-type{
    display: flex; 
    justify-content: flex-end;
    margin-left: auto;
    color: #757575;
    align-items: center;
    font-size: 12px;
    margin-right: 15px;
}

.blueprint-input-contents-rename{
    flex: 1;
    padding: 5px;
    background-color: #2b2b2b;
    border: 1px solid #757575;
    color: #757575;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { uuid } from "vue3-uuid";
import { IBlueprintInputs, IBlueprintInput, IBlueprintType } from "../../interfaces/blueprint/IBlueprintInputs";
import BlueprintContextMenu from "./BlueprintContextMenu.vue";

export default defineComponent({
    components: { BlueprintContextMenu },

    emits: {
        "start-drag": (item: IBlueprintInput) => true,
        "change": () => true,
        "over": (id: string) => true,
        "out": () => true,
        "rename": (id: string, value: string) => true,
        "select-input": (input: IBlueprintInput) => true 
    },
    
    data(): IBlueprintInputs {
        return {
            itemOver: null,
            selectedItem: null,
            renameInput: null,
            inputTypes: [
                { label: "Float", value: "float", default: 0 },
                { label: "Integer", value: "int", default: 0 },
                { label: "String", value: "string", default: "" },
                { label: "Date", value: "date", default: Date.now() },
                { label: "Color", value: "color", default: "#000000" },
                { label: "Image", value: "image", default: null }
            ],
            inputs: []
        }
    },

    methods: {
        addInput(item: IBlueprintType){
            this.inputs.push({
                id: uuid.v4(),
                name: `${item.label} (${this.inputs.length + 1})`,
                type: item.label,
            });

            this.$emit("change");
        },

        removeInput(id: string){
            this.inputs = this.inputs.filter((input) => input.id !== id).filter(item => item);
            this.$emit("change");
        },

        itemMouseOver(id: string){
            this.itemOver = id;
        },

        itemMouseOut(){
            this.itemOver = null;
        },

        mouseOver(id: string){
            this.$emit("over", id);
        },

        mouseOut(){
            this.$emit("out");
        },

        rename(id: string){
            this.renameInput = id;
            this.$forceUpdate();

            setTimeout(() => {
                this.$refs.renameInput[0].focus()
            }, 100);           
        },

        selectInput(id: string){
            this.selectedItem = id;

            this.inputs.map((input) => {
                if(input.id === id)
                    this.$emit("selectInput", input);
            });            
        },

        changeName(id: string, value: string){
            this.inputs = this.inputs.map((input) => {
                if(input.id === id)
                    input.name = value;

                return input;
            }).filter(item => item);

            this.$emit("rename", id, value);
            this.renameInput = null;
        },

        serialize(){
            return this.inputs;
        }
    }
})
</script>
