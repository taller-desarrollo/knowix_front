<template>
  <div class="input-container">
    <label v-if="label" :for="id">{{ label }}</label>
    <select
      :id="id"
      @change="onChange($event)"
      :value="modelValue"
      :class="{ 'has-error': error }"
    >
      <option disabled value="">{{ defaultOptionText }}</option>
      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.text }}
      </option>
    </select>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: "DropdownVue",
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    defaultOptionText: {
      type: String,
      default: "Selecciona una opción",
    },
    error: {
      type: String,
      default: "",
    },
  },
  methods: {
    onChange(event) {
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

select {
  padding: 10px;
  margin: 0.5em 0;
  color: black;
  background: white;
  border: 2px solid rgb(81, 81, 81);
  border-radius: 15px;
  font-size: 1.1em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
  appearance: none; 
  -moz-appearance: none;
  -webkit-appearance: none; 
}

select:focus {
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
</style>
