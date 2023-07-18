<template>
    <div class="modal" @click.self="close" v-if="opened">
        <slot @click.stop="" @click.prevent="" />
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    background-color: rgba(0,0,0,0.5);
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    overflow: hidden;
    animation:fadein .5s;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

@keyframes fadein {
	from {
		opacity:0;
	}
	to {
		opacity:1;
	}
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({    
    data() {
        return {
            opened: true
        }
    },

    methods: {
        open(){
            this.opened = true;
        },

        close(){
            this.opened = false;
        }
    }
})
</script>