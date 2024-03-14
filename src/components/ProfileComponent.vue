<template>
    <NavBarComponent />
    <div class="container-perfil">
        <div class="profile1">
            <div class="edit">
                <h1>Mis Datos</h1>
            </div>
            <div class="up-profile">
                <div class="img-auth">
                    <font-awesome-icon icon="user" class="photouser" />
                </div>
                <div class="nameemail">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" readonly />

                    <label for="correo">Correo:</label>
                    <input type="email" id="correo" readonly />

                    <label for="ocupacion">Ocupación:</label>
                    <input type="text" id="ocupacion" readonly />
                </div>
            </div>
        </div>
        <div class="profile1">
            <div class="formulario-perfil">
                <div class="networks">
                    <h2>Redes Sociales</h2>
                    <button class="editbutton" id="editar">Editar</button>
                </div>
                <div class="social-links">
                    <div class="social-link" id="facebook">
                        <a :href="socialLinks.facebook"><img src="../assets/facebook.png" alt="Facebook"></a>
                    </div>
                    <div class="social-link" id="twitter">
                        <a :href="socialLinks.twitter"><img src="../assets/x.png" alt="Twitter"></a>
                    </div>
                    <div class="social-link" id="instagram">
                        <a :href="socialLinks.instagram"><img src="../assets/instagram.png" alt="Instagram"></a>
                    </div>
                </div>
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
    data() {
        return {
            socialLinks: JSON.parse(localStorage.getItem('socialLinks')) || {
                facebook: '#',
                twitter: '#',
                instagram: '#',
            },
        };
    },
    methods: {
        updateLinks(newLinks) {
            this.socialLinks = { ...this.socialLinks, ...newLinks };
            this.$forceUpdate();
        },
    },
    mounted() {
        makeFieldsEditable(this.updateLinks, this.socialLinks);
    }
};
</script>

<style>
@import "../styles/ProfileStyle.css";
</style>
