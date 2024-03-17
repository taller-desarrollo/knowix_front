<template>
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
          <router-link class="navbar-brand" to="/">Mi Aplicación</router-link>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
              <li class = "nav-item">
                <span class="navbar-text">Usuario: {{ username }}</span>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-danger" @click="logout">Cerrar sesión</button>
              </li>
              <li>
                <button>
                  <router-link to="/home">Home</router-link>
                </button>
              </li>
              <li>
                <button>
                  <router-link to="/">Login</router-link>
                </button>
              </li>
              <li>
                <button>
                  <router-link to="/educator">Educator</router-link>
                </button>
              </li>
              <li>
                <button>
                  <router-link to="/student">Student</router-link>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    props: {
      username: String
    },
    methods: {
      async logout() {
        try {
          await this.$keycloak.logout();
          console.log('Usuario desconectado correctamente');
           this.$router.push('/');
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  header {
    top: 0;
    width: 100%;
    z-index: 1000; 
  }
  
  .navbar {
    padding: 0 1rem; 
  }
  
  .navbar-brand {
    margin-right: auto;
  }
  
  .navbar-nav {
    margin-left: auto; 
  }
  </style>
  