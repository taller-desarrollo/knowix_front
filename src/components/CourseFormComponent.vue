<template>
  <CardComponent
    title="NOMBRE DEL CURSO"
    description="El nombre del curso con el que se registrará en la plataforma y será visible para los estudiantes."
    width="500px"
  />
</template>

<script>
import CardComponent from "./widgets/card.vue"; // Asegúrate de que la ruta es correcta

export default {
  name: "AppView",
  components: {
    CardComponent, // Registra el componente CardComponent
  },
};
</script>

<style>

</style>
