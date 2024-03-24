<template>
  <v-container>
    <h1 class="display-1 mb-5">Mis Cursos Publicados</h1>
    <div v-if="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="course in courses"
          :key="course.courseId"
        >
          <v-card class="ma-5 course-card" elevation="5">
            <!-- Elevación y clase personalizada -->
            <v-card-title>{{ course.courseName }}</v-card-title>
            <v-card-text>
              <div>Descripción: {{ course.courseDescription }}</div>
              <div>Categoría: {{ course.categoryName }}</div>
              <div>Idioma: {{ course.languageName }}</div>
              <div class="price-text">
                Precio: Bs {{ course.courseStandardPrice }}
              </div>
              <!-- Clase personalizada para el precio -->
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                :to="{ name: 'edit-course', params: { id: course.courseId } }"
              >
                Editar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" v-if="!courses.length && !isLoading">
          <v-alert type="info" dismissible
            >No se encontraron cursos para mostrar.</v-alert
          >
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.course-card {
  transition: transform 0.3s ease-in-out;
  border-radius: 15px;
  overflow: hidden;
  background: #ffffff;
  color: #494747;
}

.course-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.v-card-title {
  font-size: 1.6em;
  font-weight: bold;
  margin-bottom: 0.5em;
}

.v-card-text {
  font-size: 1em;
}

.v-card-text div {
  margin-bottom: 0.5em;
}

.v-card-text div:first-child {
  font-size: 1.1em;
  font-weight: bold;
  color: #0c6271;
}

.price-text {
  font-size: 2em;
  font-weight: bold;
  color: #326e2f;
}

.v-btn {
  background-color: #c06464;
  color: #ffffff;
}
</style>

<script>
import { onMounted, computed } from "vue";
import { useCourseStore } from "@/stores/getCourseStore";

export default {
  name: "CoursesView",
  setup() {
    const courseStore = useCourseStore();

    onMounted(async () => {
      await courseStore.fetchCourses();
    });

    const isLoading = computed(() => courseStore.isLoading);
    const courses = computed(() => courseStore.courses);

    return {
      isLoading,
      courses,
    };
  },
};
</script>
