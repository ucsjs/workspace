<template>
    <div>
        <header>
            <button  
                v-for="(item, index) in items" 
                :key="index"
                :class="[(tabIndex == index) ? 'tabs-item-active' : '', 'tabs-item']"
                @click.self="selectTab(index)"
            >{{ item }}</button>
        </header>
        <slot :tabIndex="tabIndex"></slot>
    </div>
</template>

<style scoped>
.header{
    display: flex;
    justify-content: space-around;
}

.tabs-item {
    margin-right: 20px;
    padding-top: 10px;
    border-top: 1px solid transparent;
}

.tabs-item-active {
    font-weight: bold;
    color: #FFF;
    border-top: 1px solid #FFF;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({    
    props: {
        items: {
            type: Array,
            default: []
        }
    },

    emits: {
        change: (index: number) => true
    },

    data() {
        return {
            tabIndex: 0,
        }
    },

    methods: {
        selectTab(index: number) {
            this.tabIndex = index;
            this.$emit("change", index);
        }
    }
})
</script>