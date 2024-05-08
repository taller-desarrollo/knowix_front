import { ref, onMounted } from 'vue';
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

    onMounted(async () => {
        await fetchCourseDetails();
        await fetchCourseImage();
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

    function goBack() {
        router.back();
    }

    function paymentCourse() {
        if (course.value && course.value.kcUserKcUuid && course.value.courseId) {
            router.push({
                name: 'PaymentList',
                params: { kcUserKcUuid: course.value.kcUserKcUuid, courseId: course.value.courseId}
            });
        }
    }

    return {
        course,
        courseImage,
        goBack,
        paymentCourse,
    };
}
