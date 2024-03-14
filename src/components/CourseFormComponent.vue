<template>
    <div class="course-form">
    <h1>Crear Nuevo Curso</h1>
    <form @submit.prevent="submitForm">
        <div class="form-group">
        <label for="courseName">Nombre del Curso:</label>
        <input type="text" id="courseName" v-model="courseName" required>
        </div>
        <div class="form-group">
        <label for="language">Idioma:</label>
        <select id="language" v-model="language" required>
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="it">Italiano</option>
        </select>
        </div>
        <div class="form-group">
        <label for="category">Categoría:</label>
        <select id="category" v-model="category" required>
            <option value="programacion">Programación</option>
            <option value="redes">Redes</option>
            <option value="contabilidad">Contabilidad</option>
        </select>
        </div>
        <div class="form-group">
        <label for="description">Descripción:</label>
        <textarea id="description" v-model="description" required></textarea>
        </div>
        <div class="form-group">
        <label for="price">Precio Base (BS):</label>
        <input type="number" id="price" v-model="price" required>
        </div>
        <div class="form-group">
        <label for="requirements">Requerimientos del Curso:</label>
        <textarea id="requirements" v-model="requirements" required></textarea>
        </div>
        <button type="submit">Crear Curso</button>
    </form>
    </div>
</template>

<script>
export default {
    data() {
    return {
        courseName: '',
        language: '',
        category: '',
        description: '',
        price: '',
        requirements: ''
    };
    },
    methods: {
    submitForm() {
      // Aquí puedes manejar la lógica para enviar los datos del formulario
        console.log('Formulario enviado con éxito');
    }
    }
};
</script>

<style scoped>
.course-form {
    max-width: 400px;
    margin: auto;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
}

input[type="text"],
input[type="number"],
select,
textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    display: block;
    width: 100%;
    padding: 0.5rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
