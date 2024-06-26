<template>
  <div class="content">
    <div class="head-courses">
      <h1>Cursos Disponibles</h1>
      <a class="general-button" style="text-decoration: none;" href="/courses-educator-statistics">Ver Estadisticas</a>
      <button class="general-button" @click="createCourse()">Crear Curso</button>
    </div>
    <div v-if="isLoading" class="loading-container">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else>
      <div class="table-header">
        <div class="header-item">Nombre</div>
        <div class="header-item">Descripción</div>
        <div class="header-item">Categoría</div>
        <div class="header-item">Idioma</div>
        <div class="header-item">Precio</div>
        <div class="header-item">Editar</div>
        <div class="header-item">Estado</div>
      </div>
      <div class="courses-container">
        <div v-for="course in courses" :key="course.courseId" class="course-card">
          <div class="course-item">{{ course.courseName }}</div>
          <div class="course-item">{{ course.courseDescription }}</div>
          <div class="course-item">{{ course.category.categoryName }}</div>
          <div class="course-item">{{ course.language.languageName }}</div>
          <div class="course-item">Bs {{ course.courseStandardPrice }}</div>
          <div class="course-item course-edit-item">
            <button class="edit-button" @click="navigateToEditCourse(course.courseId)">
              <font-awesome-icon icon="pencil-alt" />
            </button>
          </div>
          <div class="course-item course-status-item">
            <label class="switch">
              <input type="checkbox" v-model="course.courseIsPublic" @change="changeCourseIsPublic(course.courseId)">
              <span class="slider round" :class="{ 'checked': course.courseIsPublic }"></span>
            </label>
            <span class="status-text">{{ course.courseIsPublic ? 'Publicado' : 'No Publicado' }}</span>
          </div>
        </div>
        <div v-if="!courses.length && !isLoading" class="no-courses">
          <v-alert type="info" dismissible>No se encontraron cursos para mostrar.</v-alert>
        </div>
        <div v-else class="pagination-container">
          <button :disabled="page <= 0" @click="fetchPreviousPage">Anterior</button>
          <span>Página {{ page + 1 }} de {{ totalPages }}</span>
          <button :disabled="page + 1 >= totalPages" @click="fetchNextPage">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCourseStore } from "@/stores/getCourseStore";
import { onMounted, computed, ref } from "vue";
import { keycloak } from '@/main'

const router = useRouter();
const courseStore = useCourseStore();
const page = ref(0);

onMounted(async () => {
  console.log("Desde componente CourseEducatorComponent" + keycloak.tokenParsed.sub)
  await courseStore.fetchCourses(page.value, 10, "asc", keycloak.tokenParsed.sub);
});

const isLoading = computed(() => courseStore.isLoading);
const courses = computed(() => courseStore.courses);
const totalPages = computed(() => courseStore.searchResults.totalPages);
    
function navigateToEditCourse(courseId) {
  router.push({ name: 'edit-course', params: { id: courseId } });
}

const changeCourseIsPublic = async (courseId) => {
  let token = keycloak.token;
  await courseStore.changeCourseIsPublic(courseId, keycloak.tokenParsed.sub, token);
  await courseStore.fetchCourses(page.value, 10, "asc", keycloak.tokenParsed.sub);
};

const fetchPreviousPage = async () => {
  page.value -= 1;
  if (page.value < 0) {
    page.value = 0;
  }
  await courseStore.fetchCourses(page.value, 10, "asc", keycloak.tokenParsed.sub);
};

const fetchNextPage = async () => {
  page.value += 1;
  if (page.value > totalPages.value) {
    page.value = totalPages.value;
  }
  await courseStore.fetchCourses(page.value, 10, "asc", keycloak.tokenParsed.sub);
};

const createCourse = () => {
  router.push({ name: 'new-course' });
};
</script>

<style scoped>
@import "../styles/CoursesEducatorStyle.css";
</style>
