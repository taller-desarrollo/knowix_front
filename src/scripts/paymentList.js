import axios from 'axios';
import { useRoute } from 'vue-router';
import ENDPOINTS from '@/shared/endpoints';

export default {
    data() {
        return {
            paymentMethods: [],
            courseCreatorUuid: null
        };
    },
    methods: {
        fetchPaymentMethods(kcUserKcUuid) {
            axios.get(`${ENDPOINTS.paymentMethod}/user/${kcUserKcUuid}`)
                .then(response => {
                    this.paymentMethods = response.data;
                })
                .catch(error => {
                    console.error('Error fetching payment methods:', error);
                });
        },
        getpaymentMethod(paymentMethodId) {
            return this.paymentMethods.find(paymentMethod => paymentMethod.paymentMethodId === paymentMethodId);
        },
        fetchCourseCreator(courseId) {
            axios.get(ENDPOINTS.courseCreator(courseId))
                .then(response => {
                    this.courseCreatorUuid = response.data;
                    this.fetchPaymentMethods(this.courseCreatorUuid);
                })
                .catch(error => {
                    console.error('Error fetching course creator:', error);
                });
        }
    },
    setup() {
        const route = useRoute();
        const courseId = route.params.courseId;
        const paymentMethodId = route.params.paymentMethodId;
        return {
            courseId,
            paymentMethodId
        };
    },
    mounted() {
        const courseId = this.$route.params.courseId;
        if (courseId) {
            this.fetchCourseCreator(courseId);
        }
    },
};
