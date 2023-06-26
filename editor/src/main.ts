import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import UUID from "vue3-uuid";
import Draggable from "vue3-draggable";
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

import App from './App.vue';

const app = createApp(App);
app.use(UUID);
app.use(PerfectScrollbar);
app.use(Draggable);
app.use(createPinia());
app.mount('#app');
