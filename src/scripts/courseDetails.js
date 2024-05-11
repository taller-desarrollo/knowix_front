import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import defaultImage from '@/assets/default.png';
import ENDPOINTS from '@/shared/endpoints';
import { environment } from '@/config.js';

export default function useCourseDetails() {
    const router = useRouter();
    const route = useRoute();
    const courseId = route.params.id;
    const course = ref(null);
    const courseImage = ref(defaultImage);
    const newComment = ref('');
    const comments = ref([]);
    const userUuid = ref('');

    onMounted(async () => {
        setUserUuid();
        await fetchCourseDetails();
        await fetchCourseImage();
        await fetchParentComments();
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
            const response = await axios.get(`http://localhost:8081/api/v1/comment/course/${courseId}/parents`);
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
            kcUserKcUuid: userUuid.value // Use the dynamically set user UUID
        };
        try {
            await axios.post(`http://localhost:8081/api/v1/comment/parent?courseId=${courseId}`, commentData);
            newComment.value = ''; // Clear the input after sending
            await fetchParentComments(); // Refresh comments list
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

    return {
        course,
        courseImage,
        goBack,
        paymentCourse,
        newComment,
        comments,
        postComment
    };
}