<template>
    <div>
        <NavBarComponent />
        <div class="content">
            <h1>Mi Perfil</h1>
            <div class="formulario-perfil">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" />

                <label for="correo">Correo:</label>
                <input type="email" id="correo" />

                <label for="ocupacion">Ocupación:</label>
                <input type="text" id="ocupacion" />

                <label for="social">Redes Sociales:</label>
                <label for="facebook">Facebook:</label>
                <input type="text" id="facebook" />
                <label for="twitter">Twitter:</label>
                <input type="text" id="twitter" />
                <label for="instagram">Instagram:</label>
                <input type="text" id="instagram" />
                <label for="linkedin">Linkedin:</label>
                <input type="text" id="linkedin" />
            </div>
        </div>
    </div>
</template>

<script>
import NavBarComponent from './NavBarComponent.vue';

export default {
    components: {
        NavBarComponent,
    },
};
</script>

<style scoped>
@import '../styles/ProfileStyle.css';
</style>