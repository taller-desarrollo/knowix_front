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
    NavBarComponent
  },
  data() {
    return {
      username: ''
    }
  },
  async created() {
    if (this.$keycloak.authenticated) {
      this.username = this.$keycloak.tokenParsed.name;
    }
  }
};
</script>