<template>
  <div>
    <div v-if="courses && courses.length === 0" class="no-results">
      Ops no se encontraron resultados.
    </div>
    <div v-else class="courses-container">
      <div class="search-results">
        Resultados para la búsqueda de: "{{ searchTerm }}"
      </div>
      <div class="row" style="padding: 50px">
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
      <nav aria-label="Page navigation" v-if="totalPages > 0">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: page <= 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(page - 1)"
              >Anterior</a
            >
          </li>
          <li
            class="page-item"
            v-for="pageNum in totalPages"
            :key="pageNum"
            :class="{ active: pageNum === page }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(pageNum)"
              >{{ pageNum }}</a
            >
          </li>
          <li class="page-item" :class="{ disabled: page >= totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(page + 1)"
              >Siguiente</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useCoursesStore } from "../stores/course_list";

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
  if (newPage >= 1 && newPage <= totalPages.value + 1) {
    page.value = newPage;
    fetchSearchResults(newPage);
  }
};

const courses = computed(() => store.searchResults.content);
</script>

<style scoped>
@import "../styles/ButtonsStyle.css";
@import "../../public/bootstrap.min.css";
@import "../styles/CourseList.css";

.no-results {
  text-align: center;
  padding: 50px;
  font-size: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
}

.page-item {
  margin: 5px 5px;
}

.page-link {
  border-radius: 20px;
  border: 1px solid #5b83ae;
  color: #5b83ae;
  padding: 5px 10px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.page-link:hover {
  background-color: #5b83ae;
  color: white;
}

.page-item.active .page-link {
  background-color: #5b83ae;
  color: white;
}

.page-item.disabled .page-link {
  color: grey;
  cursor: not-allowed;
}
</style>
