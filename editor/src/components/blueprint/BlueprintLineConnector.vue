<template>
    <svg 
        class="z-10 absolute svg" 
        @click="click" 
        :selected="line.selected"
    >
        <path     
            :class="[(lineDashAnimation) ? 'lineAnimation' : '',  'hover:stroke-slate-600']"
            :stroke="(selected) ? lineColorClicked : lineColor" 
            :stroke-width="lineWidth" 
            :stroke-dasharray="lineDashArray"  
            :stroke-dashoffset="dashOffset"                  
            :d="d"                 
            fill="none"
        ></path>
    </svg>
</template>

<style scoped>
.svg{
    user-select: none;
    overflow: visible !important;
    pointer-events: none;
}

.svg path{
    pointer-events: all;
    transform-origin: 0px 0px;
}

.lineAnimation {
    stroke-dashoffset: 0;
    animation: dash 4s infinite;
}

.lineAnimation:hover {
    animation-play-state: paused;
}

@keyframes dash {
    to {
        stroke-dashoffset: -50;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';

@Component({})
export default class BlueprintLineConnector extends Vue {
    @Prop()
    keyref!: string;

    @Prop()
    selected!: boolean;

    @Prop()
    line!: any;

    @Prop()
    offset!: any;

    @Prop()
    transformPosition!: object;

    @Prop()
    scrollOffset!: any;

    @Prop({ default: 100 })
    startOffset!: number;

    @Prop({ default: 50 })
    endOffset: number = 50;

    @Prop({ default: 2 })
    lineWidth!: number;

    @Prop({ default: "#ffffff" })
    lineColor!: string;

    @Prop({ default: "#ff0000" })
    lineColorClicked!: string;

    @Prop({ default: 0 })
    lineDashArray!: number;

    @Prop({ default: false })
    lineDashAnimation!: boolean;

    @Prop({ default: 1 })
    lineDashAnimationSpeed!: number;

    @Prop({ default: 1 })
    scale: number = 1;

    d = "";
    x = 0;
    timerAnimation = null;
    dashOffset = 0;
    clicked = false;
    top = 0;
    left = 0;
    width = 0;
    height = 0;

    mounted(){
        this.draw();
    }

    draw(){
        if(
            this.line.from && 
            this.line.to && 
            this.line.from.getBoundingClientRect && 
            this.line.to.getBoundingClientRect
        ){
            const fromPosition = this.line.from.getBoundingClientRect();
            const toPosition = this.line.to.getBoundingClientRect();

            if(fromPosition && toPosition) {
                let fromX = fromPosition.left - this.offset.x + this.scrollOffset.x;
                let offsetFromX = fromPosition.width;
                let fromY = fromPosition.top - this.offset.y + this.scrollOffset.y;

                let toX = toPosition.x - this.offset.x + this.scrollOffset.x;
                let toY = toPosition.y - this.offset.y + this.scrollOffset.y;

                fromY = fromY + (10 * this.scale);
                toY = toY + (12 * this.scale);
            
                const bezierFromX = fromX + offsetFromX;
                const bezierToX = toX + 10;
                const bezierIntensity = Math.min(100, Math.max(Math.abs(bezierFromX - bezierToX) / 2, Math.abs(fromY - toY)));                    
                this.d = 'M' + bezierFromX + ' ' + (fromY) + ' C' + (fromX + this.startOffset + bezierIntensity) + ' ' + fromY + ' ' + (toX - this.endOffset - bezierIntensity) + ' ' + toY + ' ' + bezierToX + ' ' + toY;
                this.x = fromX;
            }
        }
    }

    remove(){
        this.$emit("remove", this.line);
    }

    click(){
        if(this.keyref){
            this.$emit("clickLine", this.keyref);
            this.$forceUpdate();
        }
    }
} 
</script>