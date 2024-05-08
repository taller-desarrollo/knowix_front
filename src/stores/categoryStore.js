import { defineStore } from 'pinia';
import axios from 'axios'; 
import { ENDPOINTS } from '@/shared/endpoints';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
  }),
  actions: {
    async fetchCategories() {
      try {
        const response = await axios.get(ENDPOINTS.category);
        this.categories = response.data;
      } catch (error) {
        console.error('Hubo un error al obtener las categorias: ', error);
      }
    },
  },
});
