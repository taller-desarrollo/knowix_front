<template>
    <!-- TODO: refactor into one component with course form component -->
    <div class="content">
        <h1>EDITAR CURSO</h1>
        <h4>Actualice la información del curso</h4>
        <div class="container">
            <div class="left-block">
                <div class="cards-container">
                    <CardComponent title="NOMBRE DEL CURSO" inputPlaceholder="Nombre del curso" width="45%"
                        v-model="courseDetails.courseName" />
                    <CardComponent title="PRECIO BASE (En Bs.)" inputPlaceholder="Bs. 0.00" inputType="number"
                        width="45%" v-model="courseDetails.basePrice" />
                    <CardComponent title="IDIOMA DEL CURSO"
                        description="Selecciona el idioma en el que se impartirá el curso." inputType="dropdown"
                        inputPlaceholder="Selecciona un idioma" width="45%" :dropdownOptions="languageStore.languages.map((language) => ({
                            id: language.languageId,
                            text: language.languageName,
                        }))
                            " v-model="courseDetails.courseLanguage" />

                    <CardComponent title="CATEGORÍA DEL CURSO"
                        description="Selecciona la categoría a la que pertenece el curso." inputType="dropdown"
                        inputPlaceholder="Selecciona una categoría" width="45%" :dropdownOptions="categoryStore.categories.map((category) => ({
                            id: category.categoryId,
                            text: category.categoryName,
                        }))
                            " v-model="courseDetails.courseCategory" />

                    <CardComponent title="Descripción del Curso" inputType="largeText"
                        inputPlaceholder="Escribe la descripción aquí..." maxlength="300" width="45%"
                        v-model="courseDetails.detailedDescription" />
                    <CardComponent title="Requerimientos del Curso" inputType="largeText"
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
                    <button class="accept-button" @click="updateCourse">Editar Curso</button>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="sections-container">
                <div class="section-header">
                    <h2 style="margin-bottom: 0px!important">Secciones</h2>
                    <button class="accept-button" @click="addSection()">Agregar sección +</button>
                </div>
                    <div v-for="section in courseDetails.sections" :key="section.sectionId" class="section">
                        <h1>{{ section.sectionName }}</h1>
                        <p>{{ section.sectionDescription }}</p>
                        <v-divider></v-divider>
                        <div style="padding-left: 30px;" v-for="content in section.contents" class="content">
                            <p>{{ content.contentTitle }}</p>
                            <div v-for="attachment in content.attachments" style="padding-left: 10px;">
                                <p>{{ attachment.attachmentName }}</p>
                                <img v-if="attachment.attachment" :src="`data:image/png;base64,${attachment.attachment}`" style="width: 90%;">
                            </div>
                        </div>
                        <button class="accept-button" style="margin: 10px;" @click="addContent(section.sectionId)">Agregar contenido +</button>
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
import editcourse from "@/scripts/editCourse";
export default editcourse;
</script>

<style>
@import "../styles/EditCourseStyle.css";
</style>