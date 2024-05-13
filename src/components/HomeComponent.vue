<template>
  <div class="courses-container">
    <div class="search-container" style="display: flex; justify-content: space-between; align-items: center;">
      <input type="text" v-model="searchTerm" placeholder="Buscar cursos..." class="search-input" />
      <input type="number" v-model="minPrice" placeholder="Precio mínimo" class="search-input" />
      <input type="number" v-model="maxPrice" placeholder="Precio máximo" class="search-input" />
      <button class="search-button" @click="clearPrices">Limpiar Precios</button>




      <div class="dropdown" style="position: relative; display: inline-block;">
        <button class="dropbtn">Filtrar por categoría</button>
        <div class="dropdown-content" style="
        display: none;
        position: absolute;
        background-color: white;
        min-width: 150px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 10px;
        z-index: 1;
        margin-top: 10px;
    ">
          <div style="
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        ">
            <input type="checkbox" id="all-categories" value="" v-model="selectedCategories"
              @change="toggleAllCategories" style="
                margin-right: 10px;
                cursor: pointer;
            ">
            <label for="all-categories" style="
                cursor: pointer;
                font-size: 14px;
            ">Todas las categorías</label>
          </div>
          <div v-for="category in categoryStore.categories" :key="category.categoryId" style="
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        ">
            <input type="checkbox" :id="'category-' + category.categoryId" :value="category.categoryId"
              v-model="selectedCategories" :disabled="isCategoryDisabled" style="
                margin-right: 10px;
                cursor: pointer;
            ">
            <label :for="'category-' + category.categoryId" style="
                cursor: pointer;
                font-size: 14px;
            ">{{ category.categoryName }}</label>
          </div>
        </div>
      </div>




    </div>
    <div class="row" style="padding: 50px;">
      <div v-if="!filteredCourses.length">
        <v-alert type="info" dismissible>No se encontraron cursos para mostrar.</v-alert>
      </div>
      <div class="col-md-4" v-for="course in filteredCourses" :key="course.courseId">
        <div class="cardcourse mb-4 shadow">
          <img :src="courseImages[course.courseId] || '@/src/assets/default.png'" class="card-img-top"
            alt="Imagen del curso" height="300px">
          <div class="card-body">
            <div class="card-tags">
              <span class="tag">{{ course.category.categoryName }}</span>
              <span class="tag">{{ course.language.languageName }}</span>
            </div>
            <h5 class="card-title">{{ course.courseName }}</h5>

          </div>
          <div class="card-footer d-flex justify-content-between">
            <span class="price">{{ course.courseStandardPrice }} bs.</span>
            <button type="button" class="btn btn-outline-dark btn-sm" @click="goToCourseDetails(course.courseId)">Ver
              más</button>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-container">
      <button :disabled="coursesStore.searchResults.currentPage <= 0" @click="fetchPreviousPage">Anterior</button>
      <span>Página {{ coursesStore.searchResults.currentPage + 1 }} de {{ coursesStore.searchResults.totalPages + 1
        }}</span>
      <button :disabled="coursesStore.searchResults.currentPage >= coursesStore.searchResults.totalPages"
        @click="fetchNextPage">Siguiente</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watchEffect, reactive } from "vue";
import { useCoursesStore } from "../stores/course_list";
import { useCategoryStore } from "@/stores/categoryStore";
import { useRouter } from 'vue-router';
import axios from 'axios';
import defaultImage from '@/assets/default.png';
import ENDPOINTS from '@/shared/endpoints';
import { environment } from '@/config.js';

const coursesStore = useCoursesStore();
const categoryStore = useCategoryStore();
const searchTerm = ref("");
const minPrice = ref(null);
const maxPrice = ref(null);
const selectedCategories = ref([]);
const router = useRouter();
const page = ref(0);
const categoriesLoaded = ref(false);
const courseImages = reactive({});
const dropdownVisible = ref(false);

onMounted(async () => {
  await categoryStore.fetchCategories();
  categoriesLoaded.value = true;
  await coursesStore.fetchCourses();
  updateCourseImages();
  initializeDropdownEvent();
});

const initializeDropdownEvent = () => {
  // Muestra/oculta el dropdown al hacer clic en el botón.
  const dropbtn = document.querySelector('.dropbtn');
  const dropdownContent = document.querySelector('.dropdown-content');

  dropbtn.addEventListener('click', () => {
    dropdownVisible.value = !dropdownVisible.value;
    dropdownContent.style.display = dropdownVisible.value ? 'block' : 'none';
  });

  // Oculta el dropdown al hacer clic fuera de su contenedor.
  window.addEventListener('click', (event) => {
    if (!dropbtn.contains(event.target) && !dropdownContent.contains(event.target)) {
      dropdownVisible.value = false;
      dropdownContent.style.display = 'none';
    }
  });
};

const updateCourseImages = async () => {
  for (const course of coursesStore.courses) {
    try {
      const response = await axios.get(`${ENDPOINTS.courseImage}/course/${course.courseId}`);
      if (response.data.length > 0 && response.data[0].image) {
        courseImages[course.courseId] = `${environment.backendUrl}/${response.data[0].image}`;
      } else {
        courseImages[course.courseId] = defaultImage;
      }
    } catch (error) {
      console.error("Error fetching course image:", error);
      courseImages[course.courseId] = defaultImage;
    }
  }
};

watchEffect(() => {
  if (categoriesLoaded.value) {
    if (page.value > coursesStore.searchResults.totalPages) {
      page.value = coursesStore.searchResults.totalPages;
    }
    coursesStore.fetchCourses(page.value, 12, "asc", minPrice.value, maxPrice.value, searchTerm.value, selectedCategories.value)
      .then(updateCourseImages)
      .catch(error => {
        console.log(error);
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
  await coursesStore.fetchCourses(page.value, 12, "asc", minPrice.value, maxPrice.value, searchTerm.value, selectedCategories.value);
};

const fetchPreviousPage = async () => {
  page.value -= 1;
  if (page.value < 0) {
    page.value = 0;
  }
  await coursesStore.fetchCourses(page.value, 12, "asc", minPrice.value, maxPrice.value, searchTerm.value, selectedCategories.value);
};

const fetchNextPage = async () => {
  page.value += 1;
  if (page.value > coursesStore.searchResults.totalPages) {
    page.value = coursesStore.searchResults.totalPages;
  }
  await coursesStore.fetchCourses(page.value, 12, "asc", minPrice.value, maxPrice.value, searchTerm.value, selectedCategories.value);
};

function goToCourseDetails(courseId) {
  router.push(`/course-details/${courseId}`);
}
</script>



<style scoped>
@import "../styles/ButtonsStyle.css";
@import "../../public/bootstrap.min.css";
@import "../styles/CourseList.css";
@import "../styles/filterCategory.css";
</style>