<template>
    <modal :options="modalSettings" ref="window">
        <div class="blueprint-nodes-navbar">
            <header>
                <tabs 
                    :items="tabsItems" 
                    class="blueprint-nodes-navbar-tabs"
                    @change="selectTab"
                ></tabs>

                <custom-input 
                    type="text" 
                    class="blueprint-nodes-navbar-search" 
                    @change="search"
                />

                <button 
                    class="blueprint-nodes-navbar-close" 
                    @click="close"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </header>

            <main>
                <div v-if="tabIndex==0" class="blueprint-nodes-navbar-blueprints">
                    <perfect-scrollbar>
                        <div 
                            v-for="(group, index) in dataStore.blueprintGroups" 
                            :key="index"
                            class="blueprint-nodes-navbar-blueprints-group"
                        >
                            <div 
                                class="blueprint-nodes-navbar-blueprints-group-item"
                                @click="toggleItem(index.toString())"
                            >
                                <span class="font-bold">{{ index }}</span>

                                <button class="mt-1">
                                    <i 
                                        class="fa-solid fa-chevron-up" 
                                        v-if="blueprintGroupsOpened.hasOwnProperty(index) && 
                                        blueprintGroupsOpened[index] === true"
                                    ></i>
                                    <i 
                                        class="fa-solid fa-chevron-down" 
                                        v-if="!blueprintGroupsOpened.hasOwnProperty(index) || 
                                        blueprintGroupsOpened[index] === false"
                                    ></i>
                                </button>
                            </div>

                            <div 
                                class="blueprint-nodes-navbar-blueprints-items" 
                                v-if="blueprintGroupsOpened.hasOwnProperty(index) && 
                                blueprintGroupsOpened[index] === true"
                            >
                                <div 
                                    class="blueprint-nodes-navbar-blueprints-items-item"
                                    :style="{backgroundColor: (item[1].currentColor) ? 
                                        item[1].currentColor : 
                                        item[1].editorHeaderColor}"
                                    v-for="(item, index) in group" 
                                    :key="index"
                                    @mouseover="item[1].currentColor = darkenColor(item[1].editorHeaderColor, 20)"
                                    @mouseout="item[1].currentColor = item[1].editorHeaderColor"
                                    @click="createBlueprint(item[1])"
                                >
                                    <img 
                                        v-if="item[1].icon && item[1].icon.includes('/')"
                                        :src="item[1].icon" 
                                        class="blueprint-nodes-navbar-blueprints-items-icon" 
                                    />

                                    <i 
                                        v-if="item[1].icon && !item[1].icon.includes('/')"
                                        :class="[item[1].icon, 'blueprint-nodes-navbar-blueprints-items-icon']" 
                                        style="margin-top: 5px"
                                    ></i>

                                    {{ item[1].displayName ? item[1].displayName : item[1].namespace }}
                                </div>
                            </div>
                        </div>
                    </perfect-scrollbar>
                </div>
                <div v-if="tabIndex==1">1</div>
                <div v-if="tabIndex==2">2</div>
                <div v-if="tabIndex==3">3</div>
            </main>
        </div>
    </modal>
</template>

<style scoped>
.blueprint-nodes-navbar {
    position: fixed;
    width: 800px;
    height: 600px;
    background-color: #292828;
    border: 1px solid #191919;
    top: 50%;
    left: 50%;
    margin-left: -400px;
    margin-top: -300px;
}

.blueprint-nodes-navbar header {
    border-bottom: 1px solid #191919;
}

.blueprint-nodes-navbar main {
    width: 100%;
    height: 100%;
}

.blueprint-nodes-navbar-tabs{
    margin-left: 15px;
    margin-right: 15px;
    color: #eaeaea;
}

.blueprint-nodes-navbar-search {
    background-color: #191919;
    width: calc(100% - 30px);
    margin: 15px;
    padding: 15px;
    color: #eaeaea;
}

.blueprint-nodes-navbar-blueprints {
    width: 300px;
    height: calc(100% - 118px);
    border-right: 1px solid #191919;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}

.blueprint-nodes-navbar-blueprints-group {
    width: 100%;
    border-bottom: 1px solid #191919;
    border-left: 5px solid #EFEFEF;
    color: #eaeaea;
    cursor: pointer;
}

.blueprint-nodes-navbar-blueprints-group button {
    display: flex; 
    justify-content: flex-end;
    margin-left: auto;
}

.blueprint-nodes-navbar-blueprints-group-item:hover {
    background-color: #393939;
}

.blueprint-nodes-navbar-blueprints-group-item {
    padding: 5px 10px;
    display: flex;
    flex: 1;
}

.blueprint-nodes-navbar-blueprints-items {
    flex: 1;
    padding: 0px 10px;
}

.blueprint-nodes-navbar-blueprints-items-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.blueprint-nodes-navbar-blueprints-items-item {
    background-color: #393939;
    padding: 5px 10px;
    margin: 10px 5px;
    display: flex;
    transition: background-color 0.3s ease;
    color: #eaeaea;
}

.blueprint-nodes-navbar-blueprints-items-item:hover{
    background-color: rgba(0, 0, 0, 0.1);
}

.blueprint-nodes-navbar-close{
    position: absolute;
    padding: 5px 10px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    border: 1px solid #292828;
    cursor: default;
    color: #eaeaea;
    top: 5px;
    right: 5px;
}

.blueprint-nodes-navbar-close:hover{
    background-color: #676767;
    border: 1px solid #191919;
}
</style>

<script lang="ts">
import { Component, Emit, Ref, Setup } from 'vue-facing-decorator';
import { dataStorage } from '@stores/dataStore';
import { WS } from "@mixins/ws";
import { uuid } from "vue3-uuid";

import Modal from "@/components/windows/Modal.vue";
import Tabs from "@/components/navigation/Tabs.vue";
import CustomInput from "@/components/form/Input.vue";

@Component({
    components: { Modal, Tabs, CustomInput }
})
export default class BlueprintNodesNavbar extends WS {

    @Setup(() => dataStorage())
    dataStore;

    id = uuid.v4();

    tabsItems = ["Blueprints", "Prefabs", "Plugins", "Import"];

    blueprintGroupsOpened= {};

    tabIndex= 0;

    searchText: string = "";

    @Ref
    readonly window!: typeof Modal;

    modalSettings = {
        width: 700,
        height: 500,
        backgroundColor: "2B2B2B"
    }

    public open(){
        this.window.open();
    }

    public close(){
        this.window.close();
    }

    public selectTab(index: number){
        this.tabIndex = index;
    }

    public search(value: string){
        this.searchText = value;
    }

    darkenColor(color: string, percent: number): string{
        if(color){
            let num = parseInt(color.replace("#",""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) - amt,
            B = (num >> 8 & 0x00FF) - amt,
            G = (num & 0x0000FF) - amt;
            return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
        }
        else{
            return "";
        }
    }

    toggleItem(index: string): void {
        if(this.blueprintGroupsOpened[index])
            this.blueprintGroupsOpened[index] = !this.blueprintGroupsOpened[index];
        else
            this.blueprintGroupsOpened[index] = true;
    }

    @Emit
    createBlueprint(blueprint){
        this.$emit("create-blueprint", blueprint);
    }
}
</script>