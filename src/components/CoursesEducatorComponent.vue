<template>
  <div class="content">
    <div class="head-courses">
      <h1 class="display-1 mb-5">Cursos Publicados</h1>
      <button class="general" @click="createCourse()">Crear Curso</button>
    </div>
    <div v-if="isLoading">
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
      </div>
      <div class="courses-container">
        <div v-for="course in courses" :key="course.courseId" class="course-card">
          <div class="course-item">{{ course.courseName }}</div>
          <div class="course-item">{{ course.courseDescription }}</div>
          <div class="course-item">{{ course.categoryName }}</div>
          <div class="course-item">{{ course.languageName }}</div>
          <div class="course-item">Bs {{ course.courseStandardPrice }}</div>
          <div class="course-item">
            <button @click="navigateToEditCourse(course.courseId)">
              <font-awesome-icon icon="pencil-alt" />
            </button>
          </div>
        </div>
        <div v-if="!courses.length && !isLoading">
          <v-alert type="info" dismissible>No se encontraron cursos para mostrar.</v-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useCourseStore } from "@/stores/getCourseStore";
import { onMounted, computed } from "vue";

export default {
  name: "CoursesView",
  setup() {
    const router = useRouter();
    const courseStore = useCourseStore();

    onMounted(async () => {
      await courseStore.fetchCourses();
    });

    const isLoading = computed(() => courseStore.isLoading);
    const courses = computed(() => courseStore.courses);

    function navigateToEditCourse(courseId) {
      router.push({ name: 'edit-course', params: { id: courseId } });
    }

    return {
      isLoading,
      courses,
      navigateToEditCourse,
    };
  },

  methods: {
    createCourse() {
      this.$router.push({ name: 'new-course' });
    },
  },
};
</script>

<style scoped>
@import "../styles/CoursesEducatorStyle.css";
</style>
