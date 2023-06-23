import { defineStore } from "pinia";
import { IDragStorageState, ILayoutItem, ILayoutPanel } from "../interfaces";

export const dragStorage = defineStore("dragStorage", {
    state: () : IDragStorageState => ({
        inDrag: false,
        item: null,
        target: null,
        currentPanel: null,
        layoutDrop: null,
        position: null
    }),

    actions: {
        startDrap(item: ILayoutItem, currentPanel: ILayoutPanel, row: number, index: number) {
            this.item = item;
            this.inDrag = true;
            this.currentPanel = currentPanel;
            this.position = { row, index };
        },

        changePanel(currentPanel: ILayoutPanel, position?: { row: number, index: number } | null) {
            this.currentPanel = currentPanel;

            if(position)
                this.position = position;
        },

        endDrap() {  
            this.inDrag = false;
            this.currentPanel = null;
        },

        isCurrentPanel(panel: ILayoutPanel): boolean {
            return (this.currentPanel) ? panel.id === this.currentPanel.id : false;
        },
        
        setLayoutDrop(position: string | null){
            this.layoutDrop = position;
        },

        removeItemFromCurrentPanel(id: string, scope: string){
            if(this.currentPanel && this.currentPanel.rows && this.position){
                if(this.currentPanel.rows[this.position.row]) {
                    this.currentPanel.rows[this.position.row].items = this.currentPanel.rows[this.position.row].
                    items.filter((value, key) => (value as ILayoutItem).id !== id); 
                }
                else{
                    console.log(scope);
                }
                
                this.currentPanel.rows = this.currentPanel.rows.filter((data) => data.items.length > 0);
            }
        },

        setTarget(target: EventTarget){

        }
    }
});