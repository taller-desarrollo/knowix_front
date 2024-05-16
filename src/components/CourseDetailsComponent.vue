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
                <div class="comment-header">
                    <div class="author-avatar" :style="{ backgroundColor: comment.avatarColor }">{{ comment.firstName?.charAt(0) || '' }}{{ comment.lastName?.charAt(0) || '' }}</div>
                    <div class="author-details">
                        <p class="author-name">{{ comment.firstName }} {{ comment.lastName }}</p>
                        <p class="comment-date"><i>Publicado el {{ formatDate(comment.creationDate) }}</i></p>
                    </div>
                    <button @click="reportComment(comment.commentId)" class="report-button">&#9888;</button>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
                <div class="comment-actions">
                    <button class="action-button" @click="toggleReplyInput(comment.commentId)">Responder</button>
                    <button class="action-button" @click="toggleChildComments(comment.commentId)">Ver Respuestas</button>
                </div>
                <div v-if="replyInputs[comment.commentId]" class="reply-input">
                    <input type="text" v-model="replyInputs[comment.commentId].content" placeholder="Escribe una respuesta...">
                    <button :disabled="!replyInputs[comment.commentId].content.trim()" @click="postReply(comment.commentId)">Enviar</button>
                </div>
                <div v-if="comment.showChildComments" class="child-comments">
                    <div v-if="comment.childComments && comment.childComments.length" v-for="child in comment.childComments" :key="child.commentId" class="child-comment">
                        <div class="comment-header">
                            <div class="author-avatar" :style="{ backgroundColor: child.avatarColor }">{{ child.firstName?.charAt(0) || '' }}{{ child.lastName?.charAt(0) || '' }}</div>
                            <div class="author-details">
                                <p class="author-name">{{ child.firstName }} {{ child.lastName }}</p>
                                <p class="comment-date"><i>Publicado el {{ formatDate(child.creationDate) }}</i></p>
                            </div>
                        </div>
                        <p>{{ child.content }}</p>
                    </div>
                    <div v-if="!comment.childComments || !comment.childComments.length">
                        Este comentario no tiene respuestas.
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="loading">Cargando detalles del curso...</div>
    </div>
</template>


<script setup>
import { onMounted, watch } from 'vue';
import useCourseDetails from '../scripts/courseDetails.js';
import { usePaymentFormStore } from '../stores/PaymentFormStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
library.add(faPaperPlane, faArrowLeft);

const paymentFormStore = usePaymentFormStore();

const { course, courseImage, goBack, paymentCourse, newComment, comments, postComment, reportComment, fetchChildComments, toggleReplyInput, postReply, replyInputs } = useCourseDetails(paymentFormStore);

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
};

const toggleChildComments = async (commentId) => {
    const comment = comments.value.find(comment => comment.commentId === commentId);
    if (comment) {
        if (comment.showChildComments) {
            comment.showChildComments = false;
        } else {
            await fetchChildComments(commentId);
            comment.showChildComments = true;
        }
    }
};

// Helper function to get avatar color
const getAvatarColor = (initial) => {
    const char = initial.toLowerCase();
    if (char >= 'a' && char <= 'e') return '#ffadad';
    if (char >= 'f' && char <= 'i') return '#9bf6ff';
    if (char >= 'j' && char <= 'o') return '#fdffb6';
    if (char >= 'p' && char <= 't') return '#caffbf';
    if (char >= 'u' && char <= 'z') return '#ffd6a5';
    return '#a0c4ff';
};

// Function to apply avatar color
const applyAvatarColors = () => {
    comments.value.forEach(comment => {
        const initial = comment.firstName ? comment.firstName.charAt(0) : 'a';
        comment.avatarColor = getAvatarColor(initial);
        comment.childComments.forEach(child => {
            const childInitial = child.firstName ? child.firstName.charAt(0) : 'a';
            child.avatarColor = getAvatarColor(childInitial);
        });
    });
};

onMounted(() => {
    applyAvatarColors();
});

watch(comments, () => {
    applyAvatarColors();
});
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