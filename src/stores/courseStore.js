import { defineStore } from 'pinia';
import axios from 'axios'; 

export const useCourseStore = defineStore('course', {
    state: () => ({
        courseRegistrationResponse: null,
        error: null,
    }),
    actions: {
        async registerCourse(courseData) {
        try {
            const response = await axios.post('http://localhost:8081/api/v1/course', courseData, {
            headers: {
                'Content-Type': 'application/json',
            },
            });
            this.courseRegistrationResponse = response.data;
            this.error = null;
        } catch (error) {
            this.error = error.response ? error.response.data : error.message;
        }
        },
    },
});
