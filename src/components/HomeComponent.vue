<template>
  <div class="courses-container">
    <div class="search-container">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Buscar cursos..."
        class="search-input"
      />
      <button class="search-button" @click="search">BUSCAR</button>
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
            <button type="button" class="btn btn-outline-dark btn-sm">
              Ver más
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useCoursesStore } from "../stores/course_list";
import { useRouter } from 'vue-router';

const coursesStore = useCoursesStore();
const loading = ref(true);
const searchTerm = ref("");
const router = useRouter();


onMounted(async () => {
  await coursesStore.fetchCourses();
  loading.value = false;
});

const courses = computed(() => coursesStore.courses);

const search = () => {
  router.push({ name: 'SearchComponent', query: { q: searchTerm.value } });
};

</script>

<style scoped>
@import "../styles/ButtonsStyle.css";
@import "../styles/PageStyle.css";
@import "../../public/bootstrap.min.css";
@import "../styles/CourseList.css";
</style>
