<template>
  <div id="app">
    <div>
      <NavBarComponent :name="name"></NavBarComponent>
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
      name: ''
    }
  },
  async created() {
    if (this.$keycloak.authenticated) {
      this.name = this.$keycloak.tokenParsed.name;
    }
  }
};
</script>
