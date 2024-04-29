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
            inputPlaceholder="Bs. 0.00" inputType="number" mask="0000000" width="45%"
            v-model="courseDetails.basePrice" />

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

          <div class="card-component">
            <div class="label-container">
              <label for="courseImage">Imagen del Curso (Miniatura)</label>
            </div>
            <input type="file" id="courseImage" @change="handleFileUpload" accept="image/*" />
            <p>Tamaño máximo de imagen: 1000x1000 píxeles.</p>
          </div>

        </div>
      </div>
      <div class="right-block">
        <div class="summary-header">
          <h2>📝 RESUMEN DEL CURSO</h2>
          <p>Verifica que la información es correcta</p>
        </div>

        <div class="imgpreview" v-if="courseDetails.imagePreview">
          <h5>Vista previa de la Imagen:</h5>
          <img :src="courseDetails.imagePreview" alt="Image Preview" style="max-width: 100%; max-height: 200px;">
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
import { ref, getCurrentInstance, onMounted } from 'vue';
import { useLanguageStore } from "@/stores/languageStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useCourseStore } from "@/stores/courseStore";
import CardComponent from "./widgets/card.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import axios from 'axios';
// En la parte superior de tu script
import defaultCourseImage from '@/assets/icon/logocourse.png';


export default {
  name: "AppView",
  components: {
    CardComponent,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const languageStore = useLanguageStore();
    const categoryStore = useCategoryStore();
    const courseStore = useCourseStore();
    const router = useRouter();
    const isLoading = ref(false);
    const courseDetails = ref({
      courseName: "",
      basePrice: "",
      courseLanguage: "",
      courseCategory: "",
      detailedDescription: "",
      courseRequirements: "",
      courseImageFile: null,
      imagePreview: null,
    });

    onMounted(async () => {
      await languageStore.fetchLanguages();
      await categoryStore.fetchCategories();
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      courseDetails.value.courseImageFile = file;
      if (file) {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          if (img.width > 1000 || img.height > 1000) {
            Swal.fire({
              icon: 'error',
              title: 'Imagen no válida',
              html: `La imagen subida tiene dimensiones de ${img.width}px por ${img.height}px, lo cual supera el máximo permitido de 1000x1000 píxeles.`,
            });
            courseDetails.value.imagePreview = null;
            event.target.value = null;
          } else {
            const reader = new FileReader();
            reader.onload = (e) => {
              courseDetails.value.imagePreview = e.target.result;
            };
            reader.readAsDataURL(file);
          }
          URL.revokeObjectURL(url);
        };
        img.src = url;
      } else {
        courseDetails.value.imagePreview = null;
      }
    };
    const registerCourse = async () => {
      if (!courseDetails.value.courseName || !courseDetails.value.basePrice || !courseDetails.value.courseLanguage || !courseDetails.value.courseCategory || !courseDetails.value.detailedDescription || !courseDetails.value.courseRequirements) {
        Swal.fire({
          icon: "error",
          title: "Campos vacíos",
          text: "Por favor, completa todos los campos antes de registrar el curso.",
          confirmButtonText: "Aceptar",
        });
        return;
      }
      isLoading.value = true;
      Swal.fire({
        title: "Registrando el curso...",
        html: "Por favor, espera.",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
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
        const courseResponse = await courseStore.registerCourse(courseData);
        await uploadCourseImage(courseResponse.courseId);
        Swal.fire({
          icon: "success",
          title: "¡Curso registrado!",
          text: "El curso ha sido registrado con éxito.",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push({ path: "/" });
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Algo salió mal al intentar registrar el curso. Por favor, inténtalo de nuevo.",
          confirmButtonText: "Aceptar",
        });
      } finally {
        isLoading.value = false;
      }
    };
    const uploadCourseImage = async (courseId) => {
      if (!courseDetails.value.courseImageFile) {
        return;
      }
      const formData = new FormData();
      formData.append('image', courseDetails.value.courseImageFile);
      formData.append('courseCourseId', courseId);

      try {
        const response = await axios.post(
          'http://localhost:8081/api/v1/courseimage',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('Image uploaded:', response.data);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    };

    return {
      languageStore,
      categoryStore,
      registerCourse,
      isLoading,
      courseDetails,
      handleFileUpload,
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

.imgpreview {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.imgpreview img {
  margin-top: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.card-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #f5f5dc;
  margin-right: 60px;
  margin-bottom: 30px;
}

.label-container {
  background-color: #292f56;
  color: #f5f5dc;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100%;
}

.card-component label {
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 20px;
}

.card-component p {
  display: block;
  color: #333;
  margin-bottom: 10px;
}

.card-component input[type="file"] {
  border: 2px solid black;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  width: 80%;
  margin: 15px;
}

@media (max-width: 768px) {
  .card-component {
    min-width: 100%;
  }
}
</style>
