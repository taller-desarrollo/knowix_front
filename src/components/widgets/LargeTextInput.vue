<template>
  <div class="input-container">
    <label v-if="label" :for="id">{{ label }}</label>
    <textarea
      :id="id"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :value="modelValue"
      @input="handleInput"
      :class="{ 'has-error': error }"
    ></textarea>
    <div class="character-count">
      Cantidad de caracteres máximo: {{ maxlength }}
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: "LargeTextInput",
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    modelValue: { // Cambiado de 'value' a 'modelValue'
      type: String,
      default: "",
    },
    maxlength: {
      type: Number,
      required: true,
    },
    error: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleInput(event) {
      // Emitir el evento 'update:modelValue' para actualizar el valor en el componente padre
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  margin: 1em;
}

textarea {
  padding: 10px;
  margin: 0.5em 0;
  color: black;
  background: white;
  border: 2px solid rgb(81, 81, 81);
  border-radius: 15px;
  font-size: 1.1em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
  resize: vertical; /* Permite que el usuario ajuste la altura del textarea */
}

textarea::placeholder {
  color: gray;
}

textarea:focus {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  border-color: #303030;
}

.has-error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.85em;
  margin-top: -1em;
  margin-bottom: 1em;
}

.character-count {
  font-size: 0.85em;
  align-self: flex-end;
  margin-top: -1em;
  color: gray;
}

/* Estilos adicionales para los labels, si es necesario */
label {
  color: black;
  font-size: 1.2em;
  margin-bottom: 0.25em;
}
</style>
./LargeTextInput.vue
