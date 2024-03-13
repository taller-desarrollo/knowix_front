<template>
    <div class="navbar">
        <div class="welcome">
            <strong>Bienvenido a Knowix!</strong>
        </div>
        <button class="menu-toggle">Menú</button>
        <div class="optionsNavBar hidden">
            <a @click="toggleMenu; routes('/home')">Inicio</a>
            <a @click="toggleMenu; routes('/courseA')">Cursos disponibles</a>
            <a @click="toggleMenu; routes('/courseI')">Cursos inscritos</a>
            <a @click="toggleMenu; routes('/profile')">Perfil</a>
            <button class="cancel" @click="toggleMenu; routes('/')">Log Out</button>
        </div>
    </div>
</template>


<script>
import { route } from '../scripts/route.js';

export default {
    methods: {
        routes(path) {
            route(this, path);
        },
    },
    toggleMenu() {
        this.$el.querySelector('.optionsNavBar').classList.toggle('hidden');
    },
};
</script>

<style scoped>
@import '../styles/NavBarStyle.css';
</style>