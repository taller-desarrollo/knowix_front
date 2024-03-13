<template>
    <NavBarComponent />
    <div class="container-perfil">
        <div class="profile">
            <div class="encabezado-perfil">
                <h1>Mis Datos</h1>
            </div>
            <div class="img-auth">
                <font-awesome-icon icon="user" class="photouser" />
            </div>
            <div class="formulario-perfil">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" />

                <label for="correo">Correo:</label>
                <input type="email" id="correo" />
            </div>
        </div>
        <div class="profile">
            <div class="edit">
                <h2>Información adicional</h2>
                <button class="editbutton" id="editar">Editar</button>
            </div>
            <div class="formulario-perfil">
                <label for="ocupacion">Ocupación:</label>
                <input type="text" id="ocupacion" />

                <h3>Redes Sociales</h3>
                <label for="facebook">Facebook:</label>
                <input type="text" id="facebook" />
                <label for="twitter">Twitter:</label>
                <input type="text" id="twitter" />
                <label for="instagram">Instagram:</label>
                <input type="text" id="instagram" />
            </div>
        </div>
    </div>
</template>

<script>
import NavBarComponent from './NavBarComponent.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { makeFieldsEditable } from '../scripts/editProfile.js';

library.add(faUser);

export default {
    components: {
        NavBarComponent,
        FontAwesomeIcon
    },
    mounted() {
        makeFieldsEditable();
    }
};
</script>

<style>
@import "../styles/ProfileStyle.css";
</style>