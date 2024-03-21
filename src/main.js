import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import { backendInterceptor } from './shared/interceptors/backend.interceptor.js';
import Keycloak from 'keycloak-js';


import 'vuetify/styles'; 
import { createVuetify } from 'vuetify'; 
import { createPinia } from 'pinia';

import * as components from 'vuetify/components'; 
import * as directives from 'vuetify/directives'; 

const vuetify = createVuetify({
  components,
  directives,
});
const pinia = createPinia();
const app = createApp(App);

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'Knowix',
  clientId: 'knowix_frontend'
});

keycloak.init({ onLoad: 'check-sso' }).then(authenticated => {
  console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
  app.use(router(keycloak));
  app.use(pinia);
  app.use(vuetify); 
  app.config.globalProperties.$keycloak = keycloak;
  app.config.globalProperties.$axios = backendInterceptor;
  app.mount('#app');
}).catch(error => {
  console.error('Failed to initialize adapter:', error);
});

export { keycloak };
