import { defineStore } from 'pinia';
import axios from 'axios';

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    searchResults: {
      content: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: 0
    }
  }),
  actions: {
    async fetchCourses(page = 0, size = 10, sort = "asc", minPrice = null, maxPrice = null, searchTerm = "", categoryIds = []) {
      try {
        let url = 'http://localhost:8081/api/v1/course?page=' + page + '&size=' + size + '&sort=' + sort;
        
        if (minPrice !== null && maxPrice !== null && minPrice <= maxPrice && minPrice >= 0 && maxPrice >= 0) {
          url += '&minPrice=' + minPrice;
          url += '&maxPrice=' + maxPrice;
        }
        if(searchTerm !== null && searchTerm !== "") {
          url += '&searchTerm=' + searchTerm;
        }
        if (categoryIds.length > 0) {
          url += '&categoryIds=' + categoryIds.join(',');
        }

        const response = await axios.get(url);
        this.courses = response.data.content;
        this.searchResults.content = response.data.content;
        this.searchResults.totalElements = response.data.totalElements;
        this.searchResults.totalPages = response.data.totalPages - 1; // Ajuste aquí
        this.searchResults.currentPage = page;
      } catch (error) {
        console.error('There was an error fetching the courses:', error);
      }
    },
    async searchCourses(name, page = 1) {
      try {
        const response = await axios.post('http://localhost:8081/api/v1/course/search', {
          name: name,
          page: page,
          size: 5
        });
        this.searchResults.content = response.data.content;
        this.searchResults.totalPages = response.data.totalPages - 1; // Ajuste aquí
        this.searchResults.totalElements = response.data.totalElements;
        this.searchResults.currentPage = page;
      } catch (error) {
        console.error('There was an error performing the search:', error);
      }
    }
  }
});
