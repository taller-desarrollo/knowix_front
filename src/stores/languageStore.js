import { defineStore } from 'pinia';
import axios from 'axios';
import { ENDPOINTS } from '@/shared/endpoints';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    languages: [],
  }),
  actions: {
    async fetchLanguages() {
      try {
        const response = await axios.get(ENDPOINTS.language);
        console.log('mostrando languages: ', response.data);
        this.languages = response.data;
      } catch (error) {
        console.error('Hubo un error al obtener los idiomas: ', error);
      }
    },
  },
});
