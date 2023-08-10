<template>
	<Layout></Layout>
</template>

<script lang="ts">
import { Component, Setup } from 'vue-facing-decorator';
import { dataStorage } from '@stores/dataStore';
import { WS } from "@mixins/ws";

import Layout from "@/components/layout/Layout.vue";

@Component({
	components: { Layout }
})
export default class App extends WS {
	@Setup(() => dataStorage())
    dataStore;

	created(): void {
		this.initilize();
	}
}
</script>