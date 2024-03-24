import { onMounted, ref, computed, getCurrentInstance } from 'vue';
import { useCourseStore } from "@/stores/courseStore";
import { useLanguageStore } from "@/stores/languageStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useRouter } from 'vue-router';
import axios from 'axios';
import CardComponent from "../components/widgets/card.vue";
import Swal from "sweetalert2";

export default {
    name: "EditCourseView",
    components: {
        CardComponent,
    },
    setup() {
        const { proxy } = getCurrentInstance();
        const languageStore = useLanguageStore();
        const categoryStore = useCategoryStore();
        const courseStore = useCourseStore();
        const router = useRouter();
        const courseId = router.currentRoute.value.params.id;
        const courseDetails = ref({
            courseName: "",
            basePrice: "",
            courseLanguage: "",
            courseCategory: "",
            detailedDescription: "",
            courseRequirements: "",
        });

        async function fetchCourseDetails() {
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/course/${courseId}`);
                console.log(response);
                proxy.courseDetails.courseName = response.data.courseName;
                proxy.courseDetails.basePrice = response.data.courseStandardPrice.toString();
                proxy.courseDetails.courseLanguage = response.data.languageLanguageId;
                proxy.courseDetails.courseCategory = response.data.categoryCategoryId;
                proxy.courseDetails.detailedDescription = response.data.courseDescription.toString();
                proxy.courseDetails.courseRequirements = response.data.courseRequirements.toString();
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        }        

        async function updateCourse() {
            Swal.fire({
                title: 'Actualizando el curso...',
                html: 'Por favor, espera.',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });

            const payload = {
                courseName: proxy.courseDetails.courseName,
                courseStandardPrice: parseFloat(proxy.courseDetails.basePrice),
                courseDescription: proxy.courseDetails.detailedDescription,
                courseRequirements: proxy.courseDetails.courseRequirements,
                status: "true",
                categoryCategoryId: parseInt(proxy.courseDetails.courseCategory, 10),
                languageLanguageId: parseInt(proxy.courseDetails.courseLanguage, 10),
                kcUserKcUuid: proxy.$keycloak.tokenParsed.sub,
            };

            try {
                const response = await axios.put(`http://localhost:8081/api/v1/course/${courseId}`, payload);

                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Curso actualizado!',
                        text: 'El curso ha sido actualizado con éxito.',
                        confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            router.go(-1);
                        }
                    });
                } else {
                    throw new Error('Failed to update course');
                }
            } catch (error) {
                console.error('Error updating course:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Algo salió mal al intentar actualizar el curso. Por favor, inténtalo de nuevo.',
                    confirmButtonText: 'Aceptar'
                });
            }
        }

        onMounted(async () => {
            await Promise.all([
                languageStore.fetchLanguages(),
                categoryStore.fetchCategories(),
            ]);
            await fetchCourseDetails();
        });

        return {
            courseDetails,
            languageStore,
            categoryStore,
            updateCourse,
        };
    },
};