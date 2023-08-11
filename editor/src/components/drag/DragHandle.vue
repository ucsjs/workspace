<template>
    <div 
        class="draggable" 
        @mousedown.left="dragStart" 
        @mousemove="drag"
        @mouseup="drop"
    >
        <slot></slot>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            draging: false,
            initialPosition: null
        }
    },

    methods: {
        dragStart(e) {
            this.initialPosition = { x: e.clientX, y: e.clientY };
            this.draging = true;
        },

        drag(e) {
            e.stopPropagation();

            if (this.initialPosition && this.draging) {
                const deltaY = this.initialPosition.y - e.clientY;
                const deltaX = this.initialPosition.x - e.clientX;
                this.initialPosition = { x: e.clientX, y: e.clientY };
                this.$emit('dragged', { deltaX, deltaY });
            }
        },

        drop(e) {
            e.stopPropagation();

            if(this.draging)
                this.draging = false;   
        }
    }
}
</script>
  