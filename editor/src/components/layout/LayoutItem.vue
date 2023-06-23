<template>
    <div>{{ item.namespace }}</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ILayoutItem } from "../../interfaces";

export default defineComponent({
    props: {
        item: {
            type: Object as PropType<ILayoutItem>,
            required: true,
            default: { items: [] }
        }
    }
});
</script>