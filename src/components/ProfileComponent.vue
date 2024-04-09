<template>
  <div class="container-perfil">
    <div class="profile1">
      <div class="edit">
        <div class="buttonsEditProfile">
          <h1>{{ username }}</h1>
          <button class="general" v-if="!editing" @click="toggleEdit">Editar perfil</button>
          <div class="buttonsGC" v-if="editing">
            <button class="general" @click="saveProfile">Guardar</button>
            <button class="cancel" @click="cancelEdit">Cancelar</button>
          </div>
        </div>
      </div>
      <div class="up-profile">
        <div class="img-auth">
          <font-awesome-icon :icon="faUserIcon" class="photouser" />
          <div v-if="!editing" class="social-links">
            <div v-for="(link, index) in socialLinks" :key="'icon' + index" class="social-link">
              <a v-if="link.url !== '-'" :href="link.url" target="_blank">
                <img :src="getSocialMediaIcon(link.url)" alt="Social Icon">
              </a>
            </div>
          </div>
        </div>
        <div class="nameemail">
          <label for="nombre">Nombre: </label>
          <input type="text" id="nombre" :value="name" readonly />
          <label for="correo">Correo: </label>
          <input type="email" id="correo" :value="email" readonly />
          <label for="ocupacion">Rol dentro de Knowix: </label>
          <input type="text" id="ocupacion" :value="role" readonly />
          <div v-if="editing">
            <p>Si no tienes una red social, coloca - por favor.</p>
            <div v-for="(link, index) in socialLinks" :key="link.socialMediaId">
              <label :for="'social' + index">Red Social {{ index + 1 }}: </label>
              <input :id="'social' + index" type="text" v-model="link.url" placeholder="Ingrese el URL">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import profile from '../scripts/editProfile.js';
export default profile;
</script>

<style>
@import "../styles/ProfileStyle.css";
</style>
