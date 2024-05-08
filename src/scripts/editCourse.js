import { ref, getCurrentInstance, onMounted } from 'vue';
import { useLanguageStore } from "@/stores/languageStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useCourseStore } from "@/stores/courseStore";
import { useRouter } from 'vue-router';
import axios from 'axios';
import CardComponent from "../components/widgets/card.vue";
import Swal from "sweetalert2";
import { ENDPOINTS } from '@/shared/endpoints';

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
            sections: [],
            courseImageFile: null,
            imagePreview: null,
        });

        function addSection() {
            router.push({ name: 'add-content', params: { courseId: courseId, operation: 'section', id: null } });
        }

        function addContent(sectionId) {
            router.push({ name: 'add-content', params: { courseId: courseId, operation: 'content', id: sectionId } });
        }

        async function fetchCourseDetails() {
            try {
                const response = await axios.get(`${ENDPOINTS.course}/${courseId}`);
                proxy.courseDetails.courseName = response.data.courseName;
                proxy.courseDetails.basePrice = response.data.courseStandardPrice.toString();
                proxy.courseDetails.courseLanguage = response.data.languageLanguageId;
                proxy.courseDetails.courseCategory = response.data.categoryCategoryId;
                proxy.courseDetails.detailedDescription = response.data.courseDescription;
                proxy.courseDetails.courseRequirements = response.data.courseRequirements;
                proxy.courseDetails.sections = response.data.sections;
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
                const response = await axios.put(`${ENDPOINTS.course}/${courseId}`, payload);

                if (response.status === 200 && courseDetails.value.courseImageFile) {
                    await uploadCourseImage(courseId);
                }

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

        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            courseDetails.value.courseImageFile = file;
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    courseDetails.value.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                courseDetails.value.imagePreview = null;
            }
        };

        const uploadCourseImage = async (courseId) => {
            const formData = new FormData();
            formData.append('image', courseDetails.value.courseImageFile);

            try {
                await axios.put(
                    `${ENDPOINTS.courseImage}/course/${courseId}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            } catch (error) {
                console.error('Failed to upload image:', error);
            }
        };

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
            addSection,
            addContent,
            handleFileUpload
        };
    },
};
