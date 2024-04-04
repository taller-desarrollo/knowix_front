import { defineStore } from 'pinia'
import axios from 'axios'

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: []
  }),
  actions: {
    async fetchCourses() {
      try {
        const response = await axios.get('http://localhost:8081/api/v1/course')
        this.courses = response.data
      } catch (error) {
        console.error('There was an error fetching the courses:', error)
      }
    }
  }
})

