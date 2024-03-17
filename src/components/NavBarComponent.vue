<template>
    <div class="navbar">
        <div class="welcome">
            <strong>Bienvenido a Knowix {{ username }}!</strong>
        </div>
        <button class="menu-toggle" @click="toggleMenu">≡</button>
        <div class="optionsNavBar" :class="{ visible: menuOpen }">
            <a href="/" @click="toggleMenu">Inicio</a>
            <a href="/student" @click="toggleMenu">Estudiante</a>
            <a href="/educator" @click="toggleMenu">Educador</a>
            <a href="/profile" @click="toggleMenu">Perfil</a>
            <a class="cancel" @click="confirmLogout">Cerrar sesión</a>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
    data() {
        return {
            menuOpen: false,
        };
    },
    props: {
        username: String
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        async confirmLogout() {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Estás a punto de cerrar sesión",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Cerrar Sesión'
            });

            if (result.isConfirmed) {
                await this.$keycloak.logout();
                this.$router.push('/');
            }
        },
    },
};
</script>

<style scoped>
@import "../styles/NavBarStyle.css";
@import "../styles/ButtonsStyle.css";
</style>