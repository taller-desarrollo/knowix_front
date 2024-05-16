<template>
    <div class="course-details">
        <div v-if="course" class="course-info">
            <img :src="courseImage" alt="Course image" class="course-image">
            <div class="coursedetail">
                <div style="display: flex; justify-content: flex-end;">
                    <button class="general" @click="paymentCourse">Pagar curso</button>
                    <FontAwesomeIcon :icon="['fas', 'arrow-left']" class="back-button" @click="goBack" />
                </div>
                <h2>{{ course.courseName }}</h2>
                <p>{{ course.courseDescription }}</p>
                <p><strong>Requisitos:</strong> {{ course.courseRequirements }}</p>
                <p><strong>Precio:</strong> Bs. {{ course.courseStandardPrice }}</p>
                <p><strong>Categoría:</strong> {{ course.category.categoryName }}</p>
                <p><strong>Idioma:</strong> {{ course.language.languageName }}</p>
            </div>
        </div>
        <div v-if="course" class="course-sections">
            <h3>Secciones</h3>
            <div v-if="course.sections && course.sections.length !== 0">
                <div v-for="section in course.sections" :key="section.sectionId" class="section">
                    <h4>{{ section.sectionName }}</h4>
                    <p>{{ section.sectionDescription }}</p>
                    <v-divider></v-divider>
                </div>
            </div>
            <div v-if="!course.sections || course.sections.length === 0">
                No se encontraron secciones
            </div>
        </div>
        <div v-if="course" class="course-comments">
            <h3>Comentarios</h3>
            <div class="comment-input">
                <input type="text" v-model="newComment" placeholder="Escribe un comentario...">
                <FontAwesomeIcon :icon="['fas', 'paper-plane']" class="send-icon" @click="postComment" />
            </div>
            <div v-for="comment in comments" :key="comment.commentId" class="comment">
                <p class="comment-content">{{ comment.content }}</p>
                <div class="comment-actions">
                    <button @click="toggleReplyInput(comment.commentId)">Responder</button>
                    <button @click="fetchChildComments(comment.commentId)">Ver Comentarios</button>
                    <button @click="reportComment(comment.commentId)" style="color: red;">&#9888;</button>
                </div>
                <div v-if="replyInputs[comment.commentId]" class="reply-input">
                    <input type="text" v-model="replyInputs[comment.commentId].content"
                        placeholder="Escribe una respuesta...">
                    <button :disabled="!replyInputs[comment.commentId].content.trim()"
                        @click="postReply(comment.commentId)">Enviar</button>
                </div>
                <div v-if="comment.childComments && comment.childComments.length">
                    <div v-for="child in comment.childComments" :key="child.commentId" class="child-comment">
                        <p>{{ child.content }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="loading">Cargando detalles del curso...</div>
    </div>
</template>

<script setup>
import useCourseDetails from '../scripts/courseDetails.js';
import { usePaymentFormStore } from '../stores/PaymentFormStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
library.add(faPaperPlane, faArrowLeft);

const paymentFormStore = usePaymentFormStore();

const { course, courseImage, goBack, paymentCourse, newComment, comments, postComment, reportComment, fetchChildComments, toggleReplyInput, postReply, replyInputs } = useCourseDetails(paymentFormStore);
</script>

<style scoped>
@import '@/styles/CourseDetailsStyle.css';

.reply-input {
    margin-top: 10px;
}

.child-comment {
    margin-left: 20px;
    padding-left: 10px;
    border-left: 2px solid #ccc;
}
</style>