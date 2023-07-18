<template>
    <div>
        <i :class="[icon, 'input-icon']" v-if="icon"></i>
        
        <input 
            v-model="value"
            :type="type" 
            :placeholder="placeholder"
            class="input-input"
            @keyup.self="changeValue"
        />
    </div>
</template>

<style scoped>
.input-icon{
    margin-right: 15px;
}

.input-input {
    background: transparent;
    width: calc(100% - 30px);
    margin: auto;
    outline: none;
    padding: 2px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({  
    props: {
        type: {
            type: String,
            default: "text"
        },
        icon: {
            type: String,
            default: "fa-solid fa-search"
        },
        placeholder: {
            type: String,
            default: "Search"
        }
    },

    emits: {
        "change": (value: string | null) => true,
    },

    data() {
        return {
            value: null,
            modalSettings: {
                width: 700,
                height: 500,
                backgroundColor: "2B2B2B"
            }
        }
    },

    methods: {
        changeValue(){
            this.$emit("change", this.value);
        }
    }
});
</script>