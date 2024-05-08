import { defineStore } from 'pinia';
import { ENDPOINTS } from '@/shared/endpoints';
import axios from 'axios';

export const useCourseStore = defineStore('course', {
    state: () => ({
        courses: [],
        searchResults: {
            content: [],
            totalPages: 0,
            totalElements: 0,
            currentPage: 0
        },
        isLoading: false, 
    }),
    actions: {
        async fetchCourses(page = 0, size = 10, sort = "asc", sub) {
            this.isLoading = true; // Inicia la carga
            try {
                let url = `${ENDPOINTS.course}/user/${sub}`;
                url += `?page=${page}&size=${size}&sort=${sort}`;
                const response = await axios.get(url);
                this.courses = response.data.content;
                this.searchResults.content = response.data.content;
                this.searchResults.totalElements = response.data.totalElements;
                this.searchResults.totalPages = response.data.totalPages;
                this.searchResults.currentPage = page;
                console.log('Courses:', response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                this.courses = [];
            } finally {
                this.isLoading = false; 
            }
        },
        async changeCourseIsPublic(courseId, sub, token){
            try {
                const url = `${ENDPOINTS.course}/${courseId}/is-public`;
                const response = await axios.put(url, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-UUID': sub
                    }
                });
                console.log('Course is now public:', response.data);
            } catch (error) {
                console.error('Error updating course is public:', error);
            }
        }
    },
});
