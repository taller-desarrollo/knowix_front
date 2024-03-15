<template>
  <div class="card" :style="{ width: width }">
    <div class="card-header">{{ title }}</div>
    <div class="card-body">
      <p>{{ description }}</p>
      <InputVue
        id="card-input"
        placeholder="Ingresa el texto"
        v-model="inputValue"
        @input="updateValue"
      />
    </div>
  </div>
</template>

<script>
import InputVue from "./input.vue"; // Asegúrate de que la ruta es correcta

export default {
  name: "CardComponent",
  components: {
    InputVue,
  },
  props: {
    title: {
      type: String,
      default: "Título",
    },
    description: {
      type: String,
      default: "Descripción",
    },
    width: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      inputValue: "",
    };
  },
  methods: {
    updateValue(value) {
      this.inputValue = value;
      // Aquí puedes emitir el valor hacia el componente padre o realizar otras acciones
    },
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
