<template>
  <div id="app">
    <div>
      <NavBarComponent :username="username"></NavBarComponent>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBarComponent from './components/NavBarComponent.vue';
export default {
  name: 'App',
  components: {
    NavBarComponent,
  },
  data() {
    return {
      username: '',
      name: '',
      email: '',
      role: ''
    }
  },
  async created() {
    if (this.$keycloak.authenticated) {
      this.username = this.$keycloak.tokenParsed.preferred_username;
      this.name = this.$keycloak.tokenParsed.name;
      this.email = this.$keycloak.tokenParsed.email;
      const clientRoles = this.$keycloak.tokenParsed.resource_access['knowix_frontend']?.roles;
      if (clientRoles && clientRoles.includes('educator')) {
        this.role = 'Educador';
      } else if (clientRoles && clientRoles.includes('student')) {
        this.role = 'Estudiante';
      } else {
        this.role = 'Rol no encontrado';
      }
    }
  }
};
</script>
