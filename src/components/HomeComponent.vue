<template>
  <div class="courses-container">
    <div class="search-container">
      <input type="text" v-model="searchTerm" placeholder="Buscar cursos..." class="search-input" />
      <button class="search-button" @click="search">BUSCAR</button>
    </div>

    <!-- Filtro de categorías -->
    <div class="category-filter">
      <select v-model="selectedCategories" multiple class="category-select">
        <option value="">Todas las categorías</option>
        <option v-for="category in categoryStore.categories" :key="category.categoryId" :value="category.categoryId">
          {{ category.categoryName }}
        </option>
      </select>
    </div>

    <div class="row" style="padding: 50px;">
      <!-- Mostrar cursos filtrados -->
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
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useCoursesStore } from "../stores/course_list";
import { useCategoryStore } from "@/stores/categoryStore";
import { useRouter } from 'vue-router';

const coursesStore = useCoursesStore();
const categoryStore = useCategoryStore();
const searchTerm = ref("");
const selectedCategories = ref([]);
const router = useRouter();

onMounted(async () => {
  await coursesStore.fetchCourses();
  await categoryStore.fetchCategories();
});

// Computado para filtrar los cursos basados en la categoría seleccionada
const filteredCourses = computed(() => {
  // Si no hay categorías seleccionadas, retornar todos los cursos
  if (!selectedCategories.value.length) {
    return coursesStore.courses;
  }
  return coursesStore.courses.filter(course =>
    selectedCategories.value.includes(course.category.categoryId)
  );
});

const search = () => {
  router.push({ name: 'SearchComponent', query: { q: searchTerm.value } });
};
</script>


<style scoped>
@import "../styles/ButtonsStyle.css";
@import "../../public/bootstrap.min.css";
@import "../styles/CourseList.css";
</style>