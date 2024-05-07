<template>
  <form @submit.prevent="registerUser" class="register-form">
    <div class="icon-container">
      <font-awesome-icon :icon="['fas', 'user']" /> 
    </div>
    <div class="form-group">
      <label for="username">Nombre de usuario:</label>
      <input type="text" id="username" v-model="userData.username" required>
    </div>

    <div class="form-group">
      <label for="email">Correo electrónico:</label>
      <input type="email" id="email" v-model="userData.email" required>
    </div>

    <div class="form-group">
      <label for="firstName">Primer nombre:</label>
      <input type="text" id="firstName" v-model="userData.firstName" required>
    </div>

    <div class="form-group">
      <label for="lastName">Apellido:</label>
      <input type="text" id="lastName" v-model="userData.lastName" required>
    </div>

    <div class="form-group">
      <label for="password">Contraseña:</label>
      <input type="password" id="password" v-model="userData.password" required>
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirmar contraseña:</label>
      <input type="password" id="confirmPassword" v-model="confirmPassword" required>
    </div>

    <div class="role-selection">
      <label>Seleccione sus roles:</label>
      <div class="checkbox-group">
        <input type="checkbox" id="student" v-model="userData.roles" value="student">
        <label for="student">Soy un estudiante</label>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="educator" v-model="userData.roles" value="educator">
        <label for="educator">Soy un educador</label>
      </div>
    </div>

    <div v-if="userData.roles.length > 0" class="selected-roles">
      <p>Roles seleccionados:</p>
      <ul>
        <li v-for="role in userData.roles" :key="role">{{ role }}</li>
      </ul>
    </div>

    <button type="submit">Registrarse</button>
  </form>
</template>

<style scoped>
@import "../styles/FormStyle.css";



</style>


  
  <script>
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faUser } from '@fortawesome/free-solid-svg-icons'; 
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import environment from '../config.js';

  library.add(faUser); 

  export default {
    components: {
        FontAwesomeIcon,
    },
    data() {
      return {
        userData: {
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          roles: []
        },
        confirmPassword: ''
      };
    },
    methods: {
      async registerUser() {
        try {
          if (this.userData.password !== this.confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
          }
  
          const tokenResponse = await this.$axios.post(environment.keycloakUrl + '/realms/Knowix/protocol/openid-connect/token', 
            new URLSearchParams({
              grant_type: 'client_credentials',
              client_id: 'knowix_applications',
              client_secret: 'uUuA5N4SDK9KdaufADG44fIvCiNwIM5a'
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );
  
          this.token = tokenResponse.data.access_token;
          console.log(this.token);
  
          const response = await this.$axios.post('http://localhost:8081/api/v1/user', this.userData, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          console.log(response.data);
          alert('Usuario registrado exitosamente!');
          this.$router.push('/');
        } catch (error) {
          alert('Error al registrar usuario. Por favor, inténtalo de nuevo.');
          console.error(error);
        }
      }
    },
  };
  </script>
  
 