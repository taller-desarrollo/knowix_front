<template>
  <NavBarComponent />
  <h1>REGISTRA UN CURSO NUEVO</h1>
  <div class="container">
    <div class="left-block">
      <div class="cards-container">
        <CardComponent
          title="NOMBRE DEL CURSO"
          description="El nombre del curso con el que se registrará en la plataforma y será visible para los estudiantes."
          inputPlaceholder="Nombre del curso"
          width="45%"
          v-model="courseDetails.courseName"
        />

        <CardComponent
          title="PRECIO BASE (En Bs.)"
          description="Es el precio inicial del curso, el cual se puede modificar en cualquier momento."
          inputPlaceholder="Bs. 0.00"
          inputType="number"
          width="45%"
          v-model="courseDetails.basePrice"
        />

        <CardComponent
          title="IDIOMA DEL CURSO"
          description="Selecciona el idioma en el que se impartirá el curso."
          inputType="dropdown"
          inputPlaceholder="Selecciona un idioma"
          width="45%"
          :dropdownOptions="[
            { id: 1, text: 'Español' },
            { id: 2, text: 'Inglés' },
            { id: 3, text: 'Italiano' },
          ]"
          v-model="courseDetails.courseLanguage"
        />

        <CardComponent
          title="CATEGORÍA DEL CURSO"
          description="Selecciona la categoría a la que pertenece el curso."
          inputType="dropdown"
          inputPlaceholder="Selecciona una categoría"
          width="45%"
          :dropdownOptions="[
            { id: 1, text: 'Desarrollo' },
            { id: 2, text: 'Diseño' },
            { id: 3, text: 'Marketing' },
          ]"
          v-model="courseDetails.courseCategory"
        />

        <CardComponent
          title="Descripción del Curso"
          description="Agrega una descripción detallada para el curso."
          inputType="largeText"
          inputPlaceholder="Escribe la descripción aquí..."
          maxlength="300"
          width="45%"
          v-model="courseDetails.detailedDescription"
        />

        <CardComponent
          title="Requerimientos del Curso"
          description="Agrega los requerimientos necesarios para el curso."
          inputType="largeText"
          inputPlaceholder="Escribe los requerimientos aquí..."
          maxlength="500"
          width="45%"
          v-model="courseDetails.courseRequirements"
        />
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
          <p>{{ courseDetails.courseLanguage }}</p>
        </div>
        <div class="info-block">
          <span>Categoría:</span>
          <p>{{ courseDetails.courseCategory }}</p>
        </div>
        <div class="info-block description">
          <span>Descripción:</span>
          <p>{{ courseDetails.detailedDescription }}</p>
        </div>
        <div class="info-block requirements">
          <span>Requerimientos:</span>
          <p>{{ courseDetails.courseRequirements }}</p>
        </div>

        <button class="accept_button">Registrar Curso</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBarComponent from "./NavBarComponent.vue";

import CardComponent from "./widgets/card.vue";
import VueMarkdown from "vue-markdown";

export default {
  name: "AppView",
  components: {
    CardComponent,
    VueMarkdown,
    NavBarComponent,
  },
  data() {
    return {
      courseDetails: {
        courseName: "",
        basePrice: "",
        courseLanguage: "",
        courseCategory: "",
        detailedDescription: "",
        courseRequirements: "",
      },
    };
  },

  mounted() {
    console.log(this.courseDescription);
  },
};
</script>

<style>

.container {
  display: flex;
  justify-content: space-between;
  height: 80vh;
  margin: 2vh 10%;
  gap: 2%;
}

.left-block {
  display: flex;
  justify-content: center;
  flex-direction: column; /* Cambio para alinear verticalmente */
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: #000000;
}

.right-block {
  flex-direction: column;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: #000000;
}

.left-block {
  width: 75%;
  background-color: #ffffff;
}

.right-block {
  width: 25%;
  background-color: #f5f5dc;
}

.cards-container {
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos se envuelvan */
  justify-content: space-around; /* Espaciado uniforme */
  gap: 15px; /* Espacio entre cards */
}

CardComponent {
  flex-basis: calc(
    50% - 20px
  ); /* Ancho de cada card, ajustando el espacio entre ellos */
  /* No más width en los componentes individuales */
}

.markdown-container {
  margin-top: 20px;
}

.course-price-highlight {
  width: 100%;
  background-color: #91e1a6; /* Color más llamativo para el precio */
  color: #000000;
  padding: 15px;
  border-radius: 5px;
  font-size: 1.4em; /* Texto más grande para el precio */
  text-align: center; /* Centrar el texto dentro del bloque de precio */
  margin-bottom: 20px; /* Espacio antes del resumen de información */
}

.summary-header h2 {
  width: 100%;
  text-align: center; /* Centrar título y verificación */
  color: #323333; /* Color uniforme para el encabezado */
  font-size: 1.5em; /* Tamaño más grande para el título */
  font-weight: bold;
}

.summary-header p {
  width: 100%;
  text-align: center; /* Centrar título y verificación */
  color: #d94343; /* Color uniforme para el encabezado */
  font-size: 1.2em; /* Tamaño más grande para el título */
}

.info-block span,
.info-block p {
  display: block;
}

.info-block span {
  font-size: 1.2em; /* Texto más grande para los títulos */
  color: #333; /* Color oscuro para destacar títulos */
  margin-bottom: 5px; /* Espacio entre título y contenido */
  font-weight: bold;
}

.info-block p {
  font-size: 1.3em; /* Ajuste de tamaño para contenido */
  margin: 0 0 15px 0; /* Espacio después de cada bloque de información */
  font-weight: 100;
}

.description,
.requirements {
  max-width: 100%; /* Aprovechar el ancho disponible */
}

/* Mejoras visuales adicionales */
.summary-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h1 {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
  color: #ffffff;
  font-size: 2.5em;
  font-weight: bold;
  text-shadow: 2px 2px 4px #000000;
}

.accept_button{
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
