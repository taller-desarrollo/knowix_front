<template>
  <div id="app">
    <Navbar :username="username"></Navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
export default {
  name: 'App',
  components: {
    Navbar
  },
  data(){
    return {
      username: ''
    }
  },
  async created(){
    if(this.$keycloak.authenticated){
      this.username = this.$keycloak.tokenParsed.preferred_username;
    }
  }
};
</script>

<style>
 * {
   margin: 0;
   padding: 0;
   box-sizing: border-box;
 }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 150px;
  }
</style>