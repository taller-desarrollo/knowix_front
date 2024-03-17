import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import { backendInterceptor } from './shared/interceptors/backend.interceptor.js';
import Keycloak from 'keycloak-js';

(async () => {
  const keycloak = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'Knowix',
    clientId: 'knowix_frontend'
  });

  try {
    const authenticated = await keycloak.init({ onLoad: 'login-required' });
    console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
  } catch (error) {
    console.error('Failed to initialize adapter:', error);
  }

  const app = createApp(App);

  app.use(router);

  // Hacer que Keycloak esté disponible globalmente en la aplicación Vue
  app.config.globalProperties.$keycloak = keycloak;

  app.config.globalProperties.$axios = backendInterceptor;

  app.mount('#app');
})();
