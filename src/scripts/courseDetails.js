import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

export default function useCourseDetails() {
    const router = useRouter();
    const route = useRoute();
    const courseId = route.params.id;
    const course = ref(null);
    const courseImage = ref(null);

    onMounted(async () => {
        await fetchCourseDetails();
        await fetchCourseImage();
    });

    async function fetchCourseDetails() {
        const response = await axios.get(`http://localhost:8081/api/v1/course/${courseId}`);
        if (response && response.data) {
            course.value = response.data;
        }
    }

    async function fetchCourseImage() {
        const response = await axios.get(`http://localhost:8081/api/v1/courseimage/course/${courseId}`);
        if (response.data && response.data.length > 0) {
            courseImage.value = `http://localhost:8081/${response.data[0].image}`;
        }
    }

    function goBack() {
        router.back();
    }

    function paymentCourse() {
        if (course.value && course.value.kcUserKcUuid) {
            router.push({
                name: 'PaymentList',
                params: { kcUserKcUuid: course.value.kcUserKcUuid }
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