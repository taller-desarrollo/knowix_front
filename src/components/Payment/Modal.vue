<template>
    <div class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-content">
          <slot></slot>
        </div>
        <button class="modal-close-btn" @click="closeModal">Cerrar</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    emits: ['close'],
    methods: {
      closeModal() {
        this.$emit('close');
      },
    },
  };
  </script>
  

  