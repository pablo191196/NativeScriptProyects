import { createApp, registerElement } from 'nativescript-vue';
import Home from './components/Home.vue';
import {createPinia} from "pinia";

const pinia = createPinia();

createApp(Home).use(pinia).start();
