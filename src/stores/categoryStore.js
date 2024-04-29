import { defineStore } from 'pinia';
import axios from 'axios'; 

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
  }),
  actions: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:8081/api/v1/category');
        this.categories = response.data;
      } catch (error) {
        console.error('Hubo un error al obtener las categorias: ', error);
      }
    },
  },
});
