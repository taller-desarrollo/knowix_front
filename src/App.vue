<template>
  <div id="app">
    <div class="navbar">
      <Navbar :username="username"></Navbar>
    </div>
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

  body {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: #f8f8f8;
  }

  .navbar {
    background-color: #f8f8f8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .navbar a {
    color: #2c3e50;
    text-decoration: none;
  }

  .navbar a:hover {
    color: #42b983;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>