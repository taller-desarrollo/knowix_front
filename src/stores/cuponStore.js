import { defineStore } from 'pinia';
import axios from 'axios';

export const useCuponStore = defineStore('cupon', {
  state: () => ({
    cupones: [],
  }),
  actions: {
    async createCupon(newCupon) {
      try {
        const response = await axios.post('http://localhost:8081/api/cupones/crear', newCupon);
        // Agregar el nuevo cupón a la lista
        this.cupones.push(response.data);
      } catch (error) {
        console.error('Error al crear cupón:', error);
        throw error;
      }
    },
    // Otras acciones como obtener la lista de cupones, editar y eliminar
  },
});
