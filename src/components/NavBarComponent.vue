<template>
  <div class="navbar">
    <div class="welcome">
      <img src="../assets/icon/logo.png" alt="logo" height="50" style="margin-left: 10px; cursor: pointer"
        @click="redirectToHome" />

      <strong style="margin-left: 35px">¡Bienvenido {{ name }}!</strong>
    </div>
    <button class="menu-toggle" @click="toggleMenu">≡</button>
    <div class="optionsNavBar" :class="{ visible: menuOpen }">
      <a href="/" @click="toggleMenu">Inicio</a>
      <a v-if="this.$keycloak.hasResourceRole('student')" href="#" @click.prevent="toggleSubMenu">Estudiante</a>
      <div class="submenu" v-if="submenuOpen && this.$keycloak.hasResourceRole('student')">
        <a href="/course-student" @click="toggleMenu">Cursos Inscritos</a>
        <a href="/payment-student" @click="toggleMenu">Mis Pagos</a>
      </div>

      <a v-if="this.$keycloak.hasResourceRole('educator')" href="#" @click.prevent="toggleSubMenu">Educador</a>
      <div class="submenu" v-if="submenuOpen && this.$keycloak.hasResourceRole('educator')">
        <a href="/new-course" @click="toggleMenu">Crear Curso</a>
        <a href="/courses-educator" @click="toggleMenu">Ver mis Cursos</a>
        <a href="/payment-administrator" @click="toggleMenu">Mis Formas de Pago</a>
        <a href="/payment-check" @click="toggleMenu">Administrar Ventas</a>
        <a href="/verification-list" @click="toggleMenu">Solicitar verificación</a>
      </div>
      
      <a v-if="this.$keycloak.hasResourceRole('administrator')" href="#" @click.prevent="toggleSubMenu">Administrador</a>
      <div class="submenu" v-if="submenuOpen && this.$keycloak.hasResourceRole('administrator')">
        <a href="/pending-verification" @click="toggleMenu">Verificaciones pendientes</a>
      </div>

      <a v-if="authenticated" href="/profile" @click="toggleMenu">Perfil</a>
      <a v-if="authenticated" class="cancel" @click="confirmLogout">Cerrar sesión</a>
      <a v-if="!authenticated" class="register" @click="goToRegister">Registrarse</a>
      <a v-if="!authenticated" class="login" @click="logIn">Iniciar sesión</a>
    </div>
  </div>
</template>

<script>
import { keycloak } from "@/main";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      menuOpen: false,
      submenuOpen: false,
      authenticated: false,
    };
  },
  props: {
    name: String,
  },
  created() {
    this.authenticated = this.$keycloak.authenticated;
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    toggleSubMenu() {
      this.submenuOpen = !this.submenuOpen;
    },
    async confirmLogout() {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Estás a punto de cerrar sesión",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Cerrar Sesión",
      });

      if (result.isConfirmed) {
        await this.$keycloak.logout({
          redirectUri: window.location.origin + "/",
        });
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
    logIn() {
      keycloak.login();
    },
    redirectToHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
@import "../styles/NavBarStyle.css";
@import "../styles/ButtonsStyle.css";
</style>
