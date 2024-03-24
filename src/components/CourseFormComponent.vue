<template>
  <div class="content">
    <h1>REGISTRA UN CURSO NUEVO</h1>
    <div class="container">
      <div class="left-block">
        <div class="cards-container">
          <CardComponent title="NOMBRE DEL CURSO"
            description="El nombre del curso con el que se registrará en la plataforma y será visible para los estudiantes."
            inputPlaceholder="Nombre del curso" width="45%" v-model="courseDetails.courseName" />

          <CardComponent title="PRECIO BASE (En Bs.)"
            description="Es el precio inicial del curso, el cual se puede modificar en cualquier momento."
            inputPlaceholder="Bs. 0.00" inputType="number" width="45%" v-model="courseDetails.basePrice" />

          <CardComponent title="IDIOMA DEL CURSO" description="Selecciona el idioma en el que se impartirá el curso."
            inputType="dropdown" inputPlaceholder="Selecciona un idioma" width="45%" :dropdownOptions="languageStore.languages.map((language) => ({
              id: language.languageId,
              text: language.languageName,
            }))
              " v-model="courseDetails.courseLanguage" />

          <CardComponent title="CATEGORÍA DEL CURSO" description="Selecciona la categoría a la que pertenece el curso."
            inputType="dropdown" inputPlaceholder="Selecciona una categoría" width="45%" :dropdownOptions="categoryStore.categories.map((category) => ({
              id: category.categoryId,
              text: category.categoryName,
            }))
              " v-model="courseDetails.courseCategory" />

          <CardComponent title="Descripción del Curso" description="Agrega una descripción detallada para el curso."
            inputType="largeText" inputPlaceholder="Escribe la descripción aquí..." maxlength="300" width="45%"
            v-model="courseDetails.detailedDescription" />

          <CardComponent title="Requerimientos del Curso"
            description="Agrega los requerimientos necesarios para el curso." inputType="largeText"
            inputPlaceholder="Escribe los requerimientos aquí..." maxlength="500" width="45%"
            v-model="courseDetails.courseRequirements" />
        </div>
      </div>
      <div class="right-block">
        <div class="summary-header">
          <h2>📝 RESUMEN DEL CURSO</h2>
          <p>Verifica que la información es correcta</p>
        </div>
        <div class="course-price-highlight">
          <span>Precio Base:</span>
          <strong> Bs. {{ courseDetails.basePrice }}</strong>
        </div>
        <div class="summary-content">
          <div class="info-block">
            <span>Nombre del Curso:</span>
            <p>{{ courseDetails.courseName }}</p>
          </div>
          <div class="info-block">
            <span>Idioma:</span>

            <p>
              {{
              languageStore.languages.find(
                (language) =>
                  language.languageId ===
                  parseInt(courseDetails.courseLanguage, 10)
              )?.languageName || "Idioma no seleccionado"
            }}
            </p>
          </div>
          <div class="info-block">
            <span>Categoría:</span>

            <p>
              {{
                categoryStore.categories.find(
                  (category) =>
                    category.categoryId ===
                    parseInt(courseDetails.courseCategory, 10)
                )?.categoryName || "Categoría no seleccionada"
              }}
            </p>

          </div>
          <div class="info-block description">
            <span>Descripción:</span>
            <p>{{ courseDetails.detailedDescription }}</p>
          </div>
          <div class="info-block requirements">
            <span>Requerimientos:</span>
            <p>{{ courseDetails.courseRequirements }}</p>
          </div>

          <button class="accept_button" @click="registerCourse">
            Registrar Curso
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, getCurrentInstance, ref } from "vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useCourseStore } from "@/stores/courseStore";
import CardComponent from "./widgets/card.vue";
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';

export default {
  name: "AppView",
  components: {
    CardComponent,
  },

  data() {
    return {
      courseDetails: {
        courseName: "",
        basePrice: "",
        courseLanguage: "",
        courseLanguageText: "",
        courseCategory: "",
        detailedDescription: "",
        courseRequirements: "",
      },
    };
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const languageStore = useLanguageStore();
    const categoryStore = useCategoryStore();
    const courseStore = useCourseStore();
    const router = useRouter();
    const isLoading = ref(false);

    onMounted(async () => {
      await languageStore.fetchLanguages();
      await categoryStore.fetchCategories();
    });

    const registerCourse = async () => {
      isLoading.value = true;
      Swal.fire({
        title: 'Registrando el curso...',
        html: 'Por favor, espera.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      const courseData = {
        courseName: proxy.courseDetails.courseName,
        courseStandardPrice: parseFloat(proxy.courseDetails.basePrice),
        courseDescription: proxy.courseDetails.detailedDescription,
        courseRequirements: proxy.courseDetails.courseRequirements,
        status: "true",
        categoryCategoryId: parseInt(proxy.courseDetails.courseCategory, 10),
        languageLanguageId: parseInt(proxy.courseDetails.courseLanguage, 10),
        kcUserKcUuid: proxy.$keycloak.tokenParsed.sub,
      };

      try {
        await courseStore.registerCourse(courseData);
        Swal.fire({
          icon: 'success',
          title: '¡Curso registrado!',
          text: 'El curso ha sido registrado con éxito.',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/');
          }
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Algo salió mal al intentar registrar el curso. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Aceptar'
        });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      languageStore,
      categoryStore,
      registerCourse,
      isLoading,
    };
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  line-height: 1.6;
}

h1,
h2,
p {
  margin-bottom: 0.75em;
  color: #fff;
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px auto;
  max-width: 1200px;
}

.left-block,
.right-block {
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #ffffff76;
}

.left-block {
  width: 70%;
}

.right-block {
  width: 28%;
  background-color: #f5f5dc;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  padding-left: 20px;
  margin: 20px 0 0 0;
}

CardComponent {
  flex: 1;
  min-width: calc(50% - 10px);
  margin-bottom: 20px;
}

.accept_button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.accept_button:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .left-block,
  .right-block {
    width: 100%;
  }

  .cards-container {
    padding-left: 0;
    padding-right: 0;
  }
}

.summary-header h2,
.info-block span {
  color: #4caf50;
  font-weight: bold;
}

.info-block p,
.summary-header p {
  color: #666;
}
</style>
