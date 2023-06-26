<template>
    <div 
        class="draggable" 
        @dragstart="dragStart" 
        @drag="drag"
        @dragover.prevent 
        @drop="drop"
        draggable="true"
    >
        <slot></slot>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            initialPosition: null
        }
    },

    methods: {
        dragStart(e) {
            this.initialPosition = { x: e.clientX, y: e.clientY };
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setDragImage(new Image(), 0, 0);
        },

        drag(e) {
            if (this.initialPosition) {
                const deltaY = this.initialPosition.y - e.clientY;
                const deltaX = this.initialPosition.x - e.clientX;
                this.initialPosition = { x: e.clientX, y: e.clientY };
                this.$emit('dragged', { deltaX, deltaY });
            }
        },

        drop(e) {
            e.stopPropagation();
        }
    }
}
</script>
  