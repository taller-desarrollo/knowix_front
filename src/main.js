import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import { backendInterceptor } from './shared/interceptors/backend.interceptor.js';
import Keycloak from 'keycloak-js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { createPinia } from 'pinia';

import environment from './config.js';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

library.add(faPencilAlt);

console.log(environment);

const vuetify = createVuetify({
  components,
  directives,
});
const pinia = createPinia();
const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

const keycloak = new Keycloak({
  url: environment.keycloakUrl,
  realm: 'Knowix',
  clientId: 'knowix_frontend'
});
keycloak.init(
  { onLoad: 'check-sso', checkLoginIframe: false }).then(authenticated => {
    console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
    app.config.globalProperties.$keycloak = keycloak;
    app.config.globalProperties.$axios = backendInterceptor;
    app.use(router(keycloak));
    app.use(pinia);
    app.use(vuetify);
    app.mount('#app');
  }).catch(error => {
    console.error('Failed to initialize adapter:', error);
  });

export { keycloak };


