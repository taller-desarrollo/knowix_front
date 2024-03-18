<template>
    <div class="container-perfil">
        <div class="profile1">
            <div class="edit">
                <h1>{{ username }}</h1>
            </div>
            <div class="up-profile">
                <div class="img-auth">
                    <font-awesome-icon icon="user" class="photouser" />
                </div>
                <div class="nameemail">
                    <label for="nombre">Nombre: </label>
                    <input type="text" id="nombre" :value="name" readonly />
                    <label for="correo">Correo: </label>
                    <input type="email" id="correo" :value="email" readonly />
                    <label for="ocupacion">Rol dentro de Knowix: </label>
                    <input type="text" id="ocupacion" :value="role" readonly />
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
import profile from '@/scripts/profile';
export default profile;
</script>

<style>
@import "../styles/ProfileStyle.css";
</style>
