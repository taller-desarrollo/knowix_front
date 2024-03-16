<template>
  <div class="container">
    <div class="left-block">
      <div class="cards-container">
        <CardComponent
          title="NOMBRE DEL CURSO"
          description="El nombre del curso con el que se registrará en la plataforma y será visible para los estudiantes."
          inputPlaceholder="Nombre del curso"
          width="45%"
        />

        <CardComponent
          title="PRECIO BASE (En Bs.)"
          description="Es el precio inicial del curso, el cual se puede modificar en cualquier momento."
          inputPlaceholder="Bs. 0.00"
          inputType="number"
          width="45%"
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
        />

        <CardComponent
          title="Descripción del Curso"
          description="Agrega una descripción detallada para el curso."
          inputType="largeText"
          inputPlaceholder="Escribe la descripción aquí..."
          maxlength="300"
          width="45%"
        />

        <CardComponent
          title="Requerimientos del Curso"
          description="Agrega los requerimientos necesarios para el curso."
          inputType="largeText"
          inputPlaceholder="Escribe los requerimientos aquí..."
          maxlength="500"
          width="45%"
        />
      </div>
    </div>
    <div class="right-block">
      <h2>RESUMEN</h2>
      <p>Verifica que la información es correcta</p>
    </div>
  </div>
</template>

<script>
import CardComponent from "./widgets/card.vue";
import VueMarkdown from "vue-markdown";

export default {
  name: "AppView",
  components: {
    CardComponent,
    VueMarkdown,
  },
  data() {
    return {
      // Proporciona un valor inicial para courseDescription
      courseDescription:
        "# Bienvenido al Curso\nEste es un ejemplo de **Markdown**.",
      courseRequirements: "",
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
  margin: 10vh 10%;
  gap: 2%;
}

.left-block,
.right-block {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; /* Cambio para alinear verticalmente */
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: #000000;
}

.left-block {
  width: 75%;
  background-color: #f0f0f0;
}

.right-block {
  width: 25%;
  background-color: #ffffff;
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
</style>
