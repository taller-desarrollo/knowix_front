import { defineStore } from 'pinia';
import axios from 'axios';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    languages: [],
  }),
  actions: {
    async fetchLanguages() {
      try {
        const response = await axios.get('http://localhost:8081/api/v1/language');
        this.languages = response.data;
      } catch (error) {
        console.error('Hubo un error al obtener los idiomas: ', error);
      }
    },
  },
});
