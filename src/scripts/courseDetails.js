import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import defaultImage from '@/assets/default.png';
import ENDPOINTS from '@/shared/endpoints';
import { environment } from '@/config.js';
import Swal from 'sweetalert2';
import { keycloak } from "@/main";

export default function useCourseDetails() {
    const router = useRouter();
    const route = useRoute();
    const courseId = route.params.id;
    const course = ref(null);
    const courseImage = ref(defaultImage);
    const newComment = ref('');
    const comments = ref([]);
    const userUuid = ref('');
    const commentsUpdateInterval = ref(null);

    onMounted(async () => {
        setUserUuid();
        await fetchCourseDetails();
        await fetchCourseImage();
        await fetchParentComments();
        commentsUpdateInterval.value = setInterval(fetchParentComments, 5000);
    });

    onUnmounted(() => {
        clearInterval(commentsUpdateInterval.value);
    });

    function setUserUuid() {
        const instance = getCurrentInstance();
        if (instance && instance.proxy.$keycloak && instance.proxy.$keycloak.tokenParsed) {
            userUuid.value = instance.proxy.$keycloak.tokenParsed.sub;
        } else {
            console.error('Keycloak instance not available or not ready');
        }
    }

    async function fetchCourseDetails() {
        try {
            const response = await axios.get(`${ENDPOINTS.course}/${courseId}`);
            course.value = response.data;
        } catch (error) {
            console.error("Error fetching course details:", error);
        }
    }

    async function fetchCourseImage() {
        try {
            const response = await axios.get(`${ENDPOINTS.courseImage}/course/${courseId}`);
            if (response.data && response.data.length > 0) {
                courseImage.value = `${environment.backendUrl}/${response.data[0].image}`;
            }
        } catch (error) {
            console.error("Error fetching course image:", error);
        }
    }

    async function fetchParentComments() {
        if (!course.value) return;
        try {
            const response = await axios.get(`${ENDPOINTS.comment}/course/${courseId}/parents`);
            comments.value = response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    async function postComment() {
        if (!newComment.value.trim()) return;
        const commentData = {
            content: newComment.value,
            status: true,
            kcUserKcUuid: userUuid.value
        };
        try {
            const response = await axios.post(`${ENDPOINTS.comment}/parent?courseId=${courseId}`, commentData);
            comments.value.unshift(response.data);
            newComment.value = '';
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    }

    function goBack() {
        router.back();
    }

    function paymentCourse() {
        if (course.value && userUuid.value && course.value.courseId) {
            router.push({
                name: 'PaymentList',
                params: { kcUserKcUuid: userUuid.value, courseId: course.value.courseId }
            });
        }
    }

    async function reportComment(commentId) {
        if (!keycloak.authenticated) {
            keycloak.login();
            return;
        }

        const { value: formValues } = await Swal.fire({
            title: 'Reportar comentario',
            html: '<input id="swal-input1" class="swal2-input" placeholder="Razón del reporte">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value
                ];
            }
        });

        if (formValues) {
            Swal.fire({
                title: 'Enviando reporte...',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            try {
                const response = await axios.post(`${ENDPOINTS.commentReport}/comment/${commentId}`, {
                    commentReportReason: formValues[0]
                }, {
                    headers: {
                        authorization: `Bearer ${keycloak.token}`
                    }
                });
                Swal.fire({
                    title: 'Reporte enviado',
                    text: 'Tu reporte ha sido enviado con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al enviar el reporte. Inténtalo nuevamente más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    }

    return {
        course,
        courseImage,
        goBack,
        paymentCourse,
        newComment,
        comments,
        postComment,
        reportComment
    };
}
