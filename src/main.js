import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import { backendInterceptor } from './shared/interceptors/backend.interceptor.js';

const app = createApp(App);

app.use(router);

app.config.globalProperties.$axios = backendInterceptor;

app.mount('#app');