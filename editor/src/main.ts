import { createApp } from 'vue';
import { createPinia } from 'pinia';
import UUID from "vue3-uuid";

import App from './App.vue';

const app = createApp(App);
app.use(UUID);
app.use(createPinia());
app.mount('#app');
