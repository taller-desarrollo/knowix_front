<template>
    <div class="navbar">
        <div class="welcome">
            <strong>Bienvenido a Knowix!</strong>
        </div>
        <button class="menu-toggle" @click="toggleMenu">≡</button>
        <div class="optionsNavBar" :class="{ visible: menuOpen }">
            <a href="/home" @click="toggleMenu">Inicio</a>
            <a href="/courseA" @click="toggleMenu">Cursos disponibles</a>
            <a href="/courseI" @click="toggleMenu">Cursos inscritos</a>
            <a href="/profile" @click="toggleMenu">Perfil</a>
            <a class="cancel" href="javascript:void(0)" @click="confirmLogout">Log Out</a>
        </div>
    </div>
</template>

<script>
import { route } from "../scripts/route.js";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            menuOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        toggleMenuAndRoute(path) {
            this.toggleMenu();
            route(this, path);
        },
        confirmLogout() {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Estás a punto de cerrar sesión",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Cerrar Sesión'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.toggleMenuAndRoute('/');
                }
            })
        },
    },
};
</script>

<style scoped>
@import "../styles/NavBarStyle.css";
@import "../styles/ButtonsStyle.css";
</style>