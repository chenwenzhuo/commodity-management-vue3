import {createApp} from 'vue'
import {createPinia} from 'pinia'
//持久化存储pinia中数据
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import '@/assets/css/reset.css'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia)
app.use(router)

app.mount('#app')
