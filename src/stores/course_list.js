import { defineStore } from 'pinia';
import axios from 'axios';

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    searchResults: {
      content: [],
      totalPages: 0
    }
  }),
  actions: {
    async fetchCourses() {
      try {
        const response = await axios.get('http://localhost:8081/api/v1/course');
        this.courses = response.data;
      } catch (error) {
        console.error('There was an error fetching the courses:', error);
      }
    },
    async searchCourses(name, page) {
      try {
        const response = await axios.post('http://localhost:8081/api/v1/course/search', {
          name: name,
          page: page,
          size: 5
        });
        this.searchResults = {
          content: response.data.content,
          totalPages: response.data.totalPages
        };
      } catch (error) {
        console.error('There was an error performing the search:', error);
      }
    }
  }
});
