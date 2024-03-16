<!-- Ejemplo de como reutilicar el card:
<CardComponent
title="NOMBRE DEL CURSO"
description="El nombre del curso con el que se registrará en la plataforma y será visible para los estudiantes."
width="45%"
inputPlaceholder="Nombre del curso"
cardBackgroundColor="#f0f0f0"
headerBackgroundColor="#292f56"
headerTextColor="#fff" 
bodyTextColor="#333" 
inputBorderColor="#81A4CD" 
inputTextColor="#000" 
/> -->

<template>
  <div
    class="card"
    :style="{ width: width, backgroundColor: cardBackgroundColor }"
  >
    <div
      class="card-header"
      :style="{
        backgroundColor: headerBackgroundColor,
        color: headerTextColor,
      }"
    >
      {{ title }}
    </div>
    <div class="card-body" :style="{ color: bodyTextColor }">
      <p>{{ description }}</p>
      <InputVue
  v-if="inputType === 'text' || inputType === 'number'"
  :id="inputId"
  :placeholder="inputPlaceholder"
  :type="inputType"
  v-model.number="inputValue" 
  :style="{ borderColor: inputBorderColor, color: inputTextColor }"
/>

      <DropdownVue
        v-else-if="inputType === 'dropdown'"
        :id="inputId"
        :options="dropdownOptions"
        v-model="inputValue"
        :style="{ borderColor: inputBorderColor, color: inputTextColor }"
      />
      <LargeTextInput
        v-else-if="inputType === 'largeText'"
        :id="inputId"
        :placeholder="inputPlaceholder"
        :value="inputValue"
        @input="updateInputValue"
        :maxlength="maxlength"
        :style="{ borderColor: inputBorderColor, color: inputTextColor }"
      />
    </div>
  </div>
</template>

<script>
import InputVue from "./input.vue"; // Asegúrate de que la ruta es correcta
import DropdownVue from "./dropdown.vue"; // Importa el componente DropdownVue
import LargeTextInput from "./LargeTextInput.vue"; // Importa el nuevo componente LargeTextInput

export default {
  name: "CardComponent",
  components: {
    InputVue,
    DropdownVue,
    LargeTextInput, // Registra el componente aquí
  },
  props: {
    title: String,
    description: String,
    width: String,
    inputId: {
      type: String,
      default: "card-input",
    },
    inputType: {
      type: String,
      default: "text", // 'text' para input normal, 'dropdown' para listas desplegables, 'largeText' para el área de texto grande
    },
    inputPlaceholder: String,
    dropdownOptions: Array, // Prop adicional para las opciones del dropdown
    maxlength: Number, // Nuevo prop para el límite de caracteres en LargeTextInput
    cardBackgroundColor: String,
    headerBackgroundColor: String,
    headerTextColor: String,
    bodyTextColor: String,
    inputBorderColor: String,
    inputTextColor: String,
  },
  data() {
    return {
      inputValue: "",
    };
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #6b6b6b;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: "Arial", sans-serif;
  margin-bottom: 20px;
  color: #333;
  background-color: #f5f5dc;
}

.card-header {
  background-color: #292f56;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  color: #f5f5dc;
}

.card-body {
  padding: 10px;
  color: #333;
}

p {
  color: #333;
}
</style>
