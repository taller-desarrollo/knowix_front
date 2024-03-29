<template>
  <div class="input-container">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type === 'number' ? 'text' : type"
      :placeholder="placeholder"
      v-model="internalValue"
      @blur="formatValue"
      @input="updateValue"
      :class="{ 'has-error': error }"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: "InputVue",
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
    modelValue: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    error: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      internalValue: this.modelValue,
    };
  },
  methods: {
    updateValue(event) {
      this.$emit("update:modelValue", event.target.value);
    },

    formatValue() {
      this.internalValue = this.internalValue.replace(/,/g, ".");
      this.$emit("update:modelValue", this.internalValue);

      if (this.type === "number") {
        this.internalValue = parseFloat(this.internalValue).toFixed(2);
        this.$emit("update:modelValue", this.internalValue);
        if (this.internalValue < 0) {
          this.internalValue = 0;
          this.$emit("update:modelValue", this.internalValue);
        }
        //si es NaN devuelve 0:
        if (isNaN(this.internalValue)) {
          this.internalValue = 0;
          this.$emit("update:modelValue", this.internalValue);
        }
      }
    },
  },
  watch: {
    modelValue(val) {
      this.internalValue = val;
    },
    internalValue(newVal) {
      this.$emit("update:modelValue", newVal);
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

input {
  padding: 10px;
  margin: 0.5em 0;
  color: black;
  background: white;
  border: 2px solid rgb(81, 81, 81);
  border-radius: 15px;
  font-size: 1.1em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

input::placeholder {
  color: gray;
}

input:focus {
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

label {
  color: black;
  font-size: 1.2em;
  margin-bottom: 0.25em;
}
</style>
