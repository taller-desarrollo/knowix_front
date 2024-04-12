<template>
  <div class="courses-container">
    <div class="search-container" style="display: flex; justify-content: space-between; align-items: center;">
      <input type="text" v-model="searchTerm" placeholder="Buscar cursos..." class="search-input" />
      <input type="number" v-model="minPrice" placeholder="Precio mínimo" class="search-input" />
      <input type="number" v-model="maxPrice" placeholder="Precio máximo" class="search-input" />
      <button class="search-button" @click="search">BUSCAR</button>
      <button class="search-button" @click="clearPrices">Limpiar Precios</button>
      <div class="dropdown">
        <button class="dropbtn">Filtrar por categoría</button>
        <div class="dropdown-content">
          <div>
            <input type="checkbox" id="all-categories" value="" v-model="selectedCategories"
              @change="toggleAllCategories">
            <label for="all-categories">Todas las categorías</label>
          </div>
          <div v-for="category in categoryStore.categories" :key="category.categoryId">
            <input type="checkbox" :id="'category-' + category.categoryId" :value="category.categoryId"
              v-model="selectedCategories" :disabled="isCategoryDisabled">
            <label :for="'category-' + category.categoryId">{{ category.categoryName }}</label>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="padding: 50px;">
      <div v-if="!filteredCourses.length">
        <v-alert type="info" dismissible>No se encontraron cursos para mostrar.</v-alert>
      </div>
      <div class="col-md-4" v-for="course in filteredCourses" :key="course.courseId">
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
    <div class="pagination-container">
      <button :disabled="coursesStore.searchResults.currentPage <= 0" @click="fetchPreviousPage">Anterior</button>
      <span>Página {{ coursesStore.searchResults.currentPage + 1 }} de {{ coursesStore.searchResults.totalPages +
        1 }}</span>
      <button :disabled="coursesStore.searchResults.currentPage >= coursesStore.searchResults.totalPages"
        @click="fetchNextPage">Siguiente</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watchEffect } from "vue";
import { useCoursesStore } from "../stores/course_list";
import { useCategoryStore } from "@/stores/categoryStore";
import { useRouter } from 'vue-router';

const coursesStore = useCoursesStore();
const categoryStore = useCategoryStore();
const searchTerm = ref("");
const minPrice = ref(null);
const maxPrice = ref(null);
const selectedCategories = ref([]);
const router = useRouter();
const page = ref(0);
const categoriesLoaded = ref(false);
onMounted(async () => {
  await categoryStore.fetchCategories();
  categoriesLoaded.value = true;
  await coursesStore.fetchCourses();
});

watchEffect(() => {
  if (categoriesLoaded.value && page.value !== undefined) {
    coursesStore.fetchCourses(page.value, 10, "asc", minPrice.value, maxPrice.value, searchTerm.value, selectedCategories.value)
      .catch(error => {
        console.error("Error fetching courses:", error);
      });
  }
});

const toggleAllCategories = () => {
  if (selectedCategories.value.includes('')) {
    selectedCategories.value = [''];
  } else {
    selectedCategories.value = [];
  }
};

const isCategoryDisabled = computed(() => {
  return selectedCategories.value.includes('');
});

const filteredCourses = computed(() => {
  return coursesStore.courses;
});

const clearPrices = async () => {
  minPrice.value = null;
  maxPrice.value = null;
  await coursesStore.fetchCourses(page.value, 10, "asc", minPrice.value, maxPrice.value, searchTerm.value, selectedCategories.value);
};
</script>


<style scoped>
@import "../styles/ButtonsStyle.css";
@import "../../public/bootstrap.min.css";
@import "../styles/CourseList.css";
@import "../styles/filterCategory.css";
</style>