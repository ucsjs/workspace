<template>
    <div ref="blueprintContextMenu">
        <div @click="toggleMenu">
            <slot></slot>
        </div>

        <div v-if="isOpen" class="blueprint-context-menu">
            <div
                class="blueprint-context-menu-item"
                v-for="(item, index) in items"
                :key="index"
                @click="selectItem(item)"
            >
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<style scoped>
    .blueprint-context-menu {
        position: absolute;
        min-width: 150px;
        background-color: #2b2b2b;
        border: 1px solid #191919;
        padding: 10px;
        z-index: 999;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        user-select: none;
        cursor: default;
    }

    .blueprint-context-menu-item {
        cursor: default;
        padding: 5px 0;
        padding-left: 20px;
    }

    .blueprint-context-menu-item:hover {
        background: #393939;
    }
</style>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IBlueprintType } from "../../interfaces/blueprint";

export default defineComponent({
    emits: { 
        select: (item: IBlueprintType) => true
    },

    props: {
        items: {
            type: Object as PropType<IBlueprintType[]>,
            required: true,
            default: []
        }
    },

    data() {
        return {
            isOpen: false
        }
    },

    mounted() {
        window.addEventListener('click', this.closeIfClickedOutside)
    },

    beforeUnmount() {
        window.removeEventListener('click', this.closeIfClickedOutside)
    },

    methods: {
        toggleMenu() {
            this.isOpen = !this.isOpen;
        },

        selectItem(item) {
            this.isOpen = false;
            this.$emit('select', item);
        },

        closeIfClickedOutside(event) {
            if (this.isOpen && !this.$refs.blueprintContextMenu.contains(event.target)) 
                this.isOpen = false;
        }
    }
})
</script>
