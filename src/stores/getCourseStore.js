import { defineStore } from 'pinia';
import { getCurrentInstance } from "vue";
import axios from 'axios';

export const useCourseStore = defineStore('course', {
    state: () => ({
        courses: [],
        isLoading: false, 
    }),
    actions: {
        async fetchCourses() {
            const { proxy } = getCurrentInstance();
            const userUuid = proxy.$keycloak.tokenParsed.sub;
            console.log('userUuid:', userUuid);
            this.isLoading = true; 
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/course/user/${userUuid}`);
                this.courses = response.data;
                console.log('Courses:', response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                this.courses = [];
            } finally {
                this.isLoading = false; 
            }
        },
    },
});
