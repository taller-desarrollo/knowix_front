<template>
    <div class="course-details">
        <div v-if="course" class="course-info">
            <img v-if="courseImage" :src="courseImage" alt="Imagen del curso" class="course-image">
            <div class="coursedetail">
                <div style="display: flex; justify-content: flex-end;">
                    <button class="general">Pagar curso</button>
                    <FontAwesomeIcon :icon="['fas', 'arrow-left']" class="back-button" @click="goBack" />
                </div>
                <h2>{{ course.courseName }}</h2>
                <p>{{ course.courseDescription }}</p>
                <p><strong>Requisitos:</strong> {{ course.courseRequirements }}</p>
                <p><strong>Precio:</strong> {{ course.courseStandardPrice }} bs.</p>
                <p><strong>Categoría:</strong> {{ course.category.categoryName }}</p>
                <p><strong>Idioma:</strong> {{ course.language.languageName }}</p>
            </div>
        </div>
        <div v-if="course" class="course-sections">
            <h3>Secciones</h3>
            <!-- TODO: Secciones del curso -->
        </div>
        <div v-if="course" class="course-comments">
            <h3>Comentarios</h3>
            <div class="comment-input">
                <input type="text" placeholder="Escribe un comentario...">
                <FontAwesomeIcon :icon="['fas', 'paper-plane']" class="send-icon" />
            </div>
        </div>
        <div v-else class="loading">Cargando detalles del curso...</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faPaperPlane, faArrowLeft);

const router = useRouter();
const route = useRoute();
const courseId = route.params.id;
const course = ref(null);
const courseImage = ref('');

onMounted(async () => {
    await fetchCourseDetails();
    await fetchCourseImage();
});

async function fetchCourseDetails() {
    try {
        const response = await axios.get(`http://localhost:8081/api/v1/course/${courseId}`);
        course.value = response.data;
    } catch (error) {
        console.error('Error fetching course details:', error);
    }
}

async function fetchCourseImage() {
    try {
        const response = await axios.get(`http://localhost:8081/api/v1/courseimage/course/${courseId}`);
        if (response.data && response.data.length > 0) {
            courseImage.value = `http://localhost:8081/${response.data[0].image}`;
        }
    } catch (error) {
        console.error('Error fetching course image:', error);
    }
}

function goBack() {
    router.back();
}
</script>

<style scoped>
.course-details {
    display: grid;
    grid-template-rows: auto auto auto;
    gap: 1rem;
    width: 100%;
    padding: 2rem;
}

.course-info,
.course-sections,
.course-comments {
    background-color: #f7f7f71c;
    border-radius: 0.5rem;
    padding: 1rem;
    color: white;
}

.course-info {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
}

.course-info img {
    width: 1000px;
    height: 350px;
    border-radius: 8px;
}

.coursedetail {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 15px;
}

.course-image {
    width: 100%;
    max-width: 600px;
    height: auto;
    margin-bottom: 1rem;
}

.comment-input {
    display: flex;
    align-items: center;
}

.comment-input input {
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    color: white;
}

.send-icon,
.back-button {
    color: white;
    cursor: pointer;
    margin-left: 10px;
    font-size: 1.5rem;
    background-color: #007BFF;
    border-radius: 50%;
    padding: 0.5rem;
}

.send-icon:hover,
.back-button:hover {
    background-color: white;
    color: #007BFF;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-top: 100px;
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.449);
}
</style>
