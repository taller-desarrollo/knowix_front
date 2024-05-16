import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import defaultImage from '@/assets/default.png';
import ENDPOINTS from '@/shared/endpoints';
import environment from '@/config.js';
import Swal from 'sweetalert2';
import { keycloak } from "@/main";

export default function useCourseDetails(paymentFormStore) {
    const router = useRouter();
    const route = useRoute();
    const courseId = route.params.id;
    const course = ref(null);
    const courseImage = ref(defaultImage);
    const newComment = ref('');
    const comments = ref([]);
    const replyInputs = reactive({});

    onMounted(async () => {
        await paymentFormStore.setUserUuid();
        await fetchCourseDetails();
        await fetchCourseImage();
        await fetchParentComments();
    });

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
            comments.value = Array.isArray(response.data) ? response.data.map(comment => ({
                ...comment,
                childComments: []
            })) : [];
            Object.keys(replyInputs).forEach(key => {
                if (!comments.value.some(comment => comment.commentId == key)) {
                    delete replyInputs[key];
                }
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    async function postComment() {
        if (!newComment.value.trim()) return;
        if (!paymentFormStore.isUuidReady) {
            keycloak.login();
            return;
        }
        const commentData = {
            content: newComment.value,
            status: true,
            kcUserKcUuid: paymentFormStore.userUuid
        };
        try {
            const response = await axios.post(`${ENDPOINTS.comment}/parent?courseId=${courseId}`, commentData);
            comments.value.unshift({
                ...response.data,
                childComments: []
            });
            newComment.value = '';
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    }

    async function fetchChildComments(parentCommentId) {
        try {
            const response = await axios.get(`${ENDPOINTS.comment}/parent/${parentCommentId}/children`);
            const parentComment = comments.value.find(comment => comment.commentId === parentCommentId);
            if (parentComment) {
                parentComment.childComments = Array.isArray(response.data) ? response.data : [];
            }
        } catch (error) {
            console.error('Error fetching child comments:', error);
        }
    }

    function toggleReplyInput(commentId) {
        if (!keycloak.authenticated) {
            keycloak.login();
            return;
        }
        if (replyInputs[commentId]) {
            delete replyInputs[commentId];
        } else {
            replyInputs[commentId] = { content: '' };
        }
    }

    async function postReply(parentCommentId) {
        if (!paymentFormStore.isUuidReady) {
            keycloak.login();
            return;
        }
        const reply = replyInputs[parentCommentId];
        if (!reply || !reply.content.trim()) return;

        const commentData = {
            content: reply.content,
            status: true,
            kcUserKcUuid: paymentFormStore.userUuid
        };
        try {
            const response = await axios.post(`${ENDPOINTS.comment}/child?parentCommentId=${parentCommentId}`, commentData);
            const parentComment = comments.value.find(comment => comment.commentId === parentCommentId);
            if (parentComment) {
                if (!parentComment.childComments) {
                    parentComment.childComments = [];
                }
                parentComment.childComments.push(response.data);
                delete replyInputs[parentCommentId];
            }
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    }

    function goBack() {
        router.back();
    }

    function paymentCourse() {
        if (!keycloak.authenticated) {
            keycloak.login();
            return;
        }

        if (course.value && paymentFormStore.userUuid && course.value.courseId) {
            router.push({
                name: 'PaymentList',
                params: { kcUserKcUuid: paymentFormStore.userUuid, courseId: course.value.courseId }
            });
        }
    }

    async function reportComment(commentId) {
        if (!paymentFormStore.isUuidReady) {
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
                await axios.post(`${ENDPOINTS.commentReport}/comment/${commentId}`, {
                    commentReportReason: formValues[0]
                }, {
                    headers: {
                        authorization: `Bearer ${paymentFormStore.userUuid}`
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
        reportComment,
        fetchChildComments,
        toggleReplyInput,
        postReply,
        replyInputs
    };
}
