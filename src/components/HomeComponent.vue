<template>
  <div class="courses-container">
    <div class="search-container">
      <input type="text" v-model="searchTerm" placeholder="Buscar cursos..." class="search-input" />
      <button class="search-button" @click="search">BUSCAR</button>
    </div>

    <div class="category-filter">
      <div>
        <input type="checkbox" id="all-categories" value="" v-model="selectedCategories" @change="toggleAllCategories">
        <label for="all-categories">Todas las categorías</label>
      </div>
      <div v-for="category in categoryStore.categories" :key="category.categoryId">
        <input type="checkbox" :id="'category-' + category.categoryId" :value="category.categoryId"
          v-model="selectedCategories" :disabled="isCategoryDisabled">
        <label :for="'category-' + category.categoryId">{{ category.categoryName }}</label>
      </div>
    </div>

    <div class="row" style="padding: 50px;">
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

const toggleAllCategories = (event) => {
  if (event.target.checked) {
    selectedCategories.value = [''];
  } else {
    selectedCategories.value = [];
  }
};

const isCategoryDisabled = computed(() => {
  return selectedCategories.value.includes('');
});

const filteredCourses = computed(() => {
  let filtered = coursesStore.courses;

  if (selectedCategories.value.length > 0 && !selectedCategories.value.includes("")) {
    filtered = filtered.filter(course =>
      selectedCategories.value.includes(course.category.categoryId)
    );
  }

  if (searchTerm.value) {
    filtered = filtered.filter(course =>
      course.courseName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      course.courseDescription.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  return filtered;
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
