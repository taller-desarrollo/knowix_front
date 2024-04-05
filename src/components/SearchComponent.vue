<template>
    <div class="courses-container">
      <div class="search-results">
        Resultados para la búsqueda de: "{{ searchTerm }}"
      </div>
      <div class="row" style="padding: 50px;">
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
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: page <= 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(page - 1)">Anterior</a>
          </li>
          <li class="page-item" :class="{ disabled: page >= totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(page + 1)">Siguiente</a>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useCoursesStore } from '../stores/course_list';
  
  const route = useRoute();
  const store = useCoursesStore();
  const searchTerm = ref(route.query.q);
  const page = ref(1);
  const totalPages = ref(0);
  
  const fetchSearchResults = async (page) => {
    await store.searchCourses(searchTerm.value, page);
    totalPages.value = store.searchResults.totalPages;
  };
  
  onMounted(() => {
    fetchSearchResults(page.value);
  });
  
  watch(route, () => {
    searchTerm.value = route.query.q;
    fetchSearchResults(page.value);
  });
  
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage;
      fetchSearchResults(newPage);
    }
  };
  
  const courses = ref(() => store.searchResults.content);
  </script>
  
  <style scoped>
  @import "../styles/ButtonsStyle.css";
  @import "../styles/PageStyle.css";
  @import "../../public/bootstrap.min.css";
  @import "../styles/CourseList.css";
  /* Estilos adicionales específicos de esta vista */
  </style>
  