<template>
    <div class="courses-container">
      <!-- Diseño mejorado del espacio de búsqueda -->
      <div class="search-container">
        <input type="text" v-model="searchTerm" placeholder="Buscar cursos..." class="search-input">
        <button class="search-button">BUSCAR</button>
      </div>
  
      <h1 class="text-center mb-5">Cursos Disponibles</h1>
      <div class="row">
        <div class="col-md-4" v-for="course in courses" :key="course.courseId">
          <div class="card mb-4 shadow">
            <div class="card-body">
              <div class="card-tags">
                <span class="tag">{{ course.category.categoryName }}</span>
                <span class="tag">{{ course.language.languageName }}</span>
              </div>
              <h5 class="card-title">{{ course.courseName }}</h5>
              <p class="card-text">{{ course.courseDescription }}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <span class="price">{{ course.courseStandardPrice }} bs.</span>
              <button type="button" class="btn btn-outline-dark btn-sm">Ver más</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, computed, ref } from "vue";
  import { useCoursesStore } from "../stores/course_list";
  
  const coursesStore = useCoursesStore();
  const loading = ref(true);
  const searchTerm = ref("");
  
  onMounted(async () => {
    await coursesStore.fetchCourses();
    loading.value = false;
  });
  
  const courses = computed(() => coursesStore.courses);
  </script>
  
  <style scoped>
  @import "../styles/ButtonsStyle.css";
  @import "../styles/PageStyle.css";
  @import "../../public/bootstrap.min.css";
  
  .courses-container {
    background-color: #1a1a2e;
    padding: 20px;
    border-radius: 8px;
    color: #f5f5f5;
    min-height: 100vh;
  }
  
  .search-container {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
    align-items: center;
  }
  
  .search-input {
    padding: 10px;
    border-radius: 4px;
    border: 2px solid #d1c4b0;
    color: #f5f5f5;
    background-color: #333;
    flex-grow: 1;
    margin-right: 10px;
  }
  
  .search-button {
    padding: 10px 20px;
    background-color: #d1c4b0;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .search-button:hover {
    background-color: #f0e5d8;
    color: #1a1a2e;
  }
  
  .card {
    background-color: #f0e5d8;
    color: #333;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .card-tags, .card-footer {
    margin-bottom: 15px;
    padding: 0 15px;
  }
  
  .tag {
    background-color: #d1c4b0;
    color: #333;
    padding: 2px 8px;
    border-radius: 15px;
    margin-right: 5px;
    font-size: 0.8em;
  }
  
  .card-title, .card-text, .price {
    color: #333;
  }
  
  .btn-outline-dark {
    color: #9a2323;
    border-color: #333;
  }
  
  .btn-outline-dark:hover {
    background-color: #333;
    color: #f0e5d8;
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .price {
    font-weight: bold;
    font-size: 1.1em;
  }
  </style>
  