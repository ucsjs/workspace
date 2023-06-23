import { componentIndexStorage } from "../stores/componentIndex";

export const globalMixin = {
    getComponentFromPoint(event: MouseEvent, filterByClass: string = "layout-panel-drop"): any | null{
        const componentIndex = componentIndexStorage();
        const elementsBelow = document.elementsFromPoint(event.clientX, event.clientY);
        const isDropArea = elementsBelow.filter(element => element.classList.contains(filterByClass));

        if(isDropArea && isDropArea.length > 0){
            const componentUUID = isDropArea[0].getAttribute("id");

            if(componentUUID){
                const component = componentIndex.get(componentUUID);
                return component;
            }
            else {
                return null;
            }
        } 

        return null;
    },

    getComponentHeader(event: MouseEvent){
        const componentIndex = componentIndexStorage();
        const elementsBelow = document.elementsFromPoint(event.clientX, event.clientY);
        const isDropArea = elementsBelow.filter(element => element.classList.contains("layout-item-header"));

        if(isDropArea && isDropArea.length > 0){
            const componentUUID = isDropArea[0].getAttribute("id");
            const row = isDropArea[0].getAttribute("row");

            if(componentUUID && row){
                const component = componentIndex.get(componentUUID);
                return { component, row: parseInt(row) };
            }
            else{
                return null;
            }
        } 

        return null;
    },

    getLayoutDropZone(event: MouseEvent){
        const elementsBelow = document.elementsFromPoint(event.clientX, event.clientY);
        const isDropArea = elementsBelow.filter(element => element.classList.contains("layout-drop-area"));

        if(isDropArea && isDropArea.length > 0){
            const direction = isDropArea[0].getAttribute("direction");
            return direction;
        } 

        return null;
    }
};