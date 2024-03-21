<template>
    <div class="content">
        <h1>EDITAR CURSO</h1>
        <h4>Actualice la información del curso</h4>
        <div class="container">
            <div class="left-block">
                <div class="cards-container">
                    <CardComponent title="NOMBRE DEL CURSO"
                        inputPlaceholder="Nombre del curso" width="45%" v-model="courseDetails.courseName" />

                    <CardComponent title="PRECIO BASE (En Bs.)"
                        inputPlaceholder="Bs. 0.00" inputType="number" width="45%" v-model="courseDetails.basePrice" />

                    <CardComponent title="IDIOMA DEL CURSO"
                        inputType="dropdown"
                        inputPlaceholder="Selecciona un idioma" width="45%" :dropdownOptions="languageStore.languages.map((language) => ({
                            id: language.languageId,
                            text: language.languageName,
                        }))
                            " v-model="courseDetails.courseLanguage" />

                    <CardComponent title="CATEGORÍA DEL CURSO"
                        inputType="dropdown"
                        inputPlaceholder="Selecciona una categoría" width="45%" :dropdownOptions="categoryStore.categories.map((category) => ({
                            id: category.categoryId,
                            text: category.categoryName,
                        }))
                            " v-model="courseDetails.courseCategory" />

                    <CardComponent title="Descripción del Curso"
                        inputType="largeText"
                        inputPlaceholder="Escribe la descripción aquí..." maxlength="300" width="45%"
                        v-model="courseDetails.detailedDescription" />

                    <CardComponent title="Requerimientos del Curso"
                        inputType="largeText"
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

                    <button class="accept_button">Editar Curso</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@import "../styles/EditCourseStyle.css"
</style>

<script>
import { onMounted } from "vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useCategoryStore } from "@/stores/categoryStore";
import CardComponent from "./widgets/card.vue";

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
        const languageStore = useLanguageStore();
        const categoryStore = useCategoryStore();

        onMounted(async () => {
            await languageStore.fetchLanguages();
            await categoryStore.fetchCategories();
        });

        return { languageStore, categoryStore };
    },
};
</script>