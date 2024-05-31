<template>
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content" @click.stop>
        <!-- Formulario de creación de cupón -->
        <h2>Crear Nuevo Cupónsd</h2>
        <form @submit.prevent="createCupon">
          <!-- Campos del formulario -->
          <label for="discountType">Tipo de Descuento:</label>
          <input type="text" v-model="newCupon.discountType" required>
          <!-- Otros campos del formulario -->
          <button type="submit">Crear Cupón</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    props: ['show'],
    emits: ['close', 'create'],
    setup(props, { emit }) {
      const newCupon = ref({
        discountType: '',
        // Otros campos del nuevo cupón
      });
  
      const createCupon = async () => {
        emit('create', newCupon.value);
        newCupon.value = { discountType: '' }; // Limpiar formulario después de enviar
      };
  
      return {
        newCupon,
        createCupon,
      };
    },
  });
  </script>
  
  <style>
  /* Estilos para el modal */
  .modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
    animation: fadeIn 0.5s;
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }
  
  /* Animación para el modal */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  </style>
  