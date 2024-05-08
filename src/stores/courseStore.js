import { defineStore } from 'pinia';
import axios from 'axios';
import { ENDPOINTS } from '@/shared/endpoints';

export const useCourseStore = defineStore('course', {
  state: () => ({
    courseRegistrationResponse: null,
    error: null,
  }),
  actions: {
    async registerCourse(courseData) {
      try {
        const response = await axios.post(ENDPOINTS.course, courseData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        this.courseRegistrationResponse = response.data;
        this.error = null;
        return response.data;  // Devuelve la respuesta para su uso posterior (ej. para obtener el courseId)
      } catch (error) {
        this.error = error.response ? error.response.data : error.message;
        throw error;  // Lanza el error para que pueda ser manejado por el componente que invoca esta acción
      }
    },
  },
});
