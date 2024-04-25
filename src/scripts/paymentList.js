import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
    data() {
        return {
            paymentMethods: []
        };
    },
    methods: {
        fetchPaymentMethods(kcUserKcUuid) {
            axios.get(`http://localhost:8081/api/v1/paymentmethod/user/${kcUserKcUuid}`)
                .then(response => {
                    this.paymentMethods = response.data;
                })
                .catch(error => {
                    console.error('Error fetching payment methods:', error);
                });
        }
    },
    setup() {
        const route = useRoute();
        const kcUserKcUuid = route.params.kcUserKcUuid;
        return {
            kcUserKcUuid
        };
    },
    mounted() {
        const kcUserKcUuid = this.$route.params.kcUserKcUuid;
        if (kcUserKcUuid) {
            this.fetchPaymentMethods(kcUserKcUuid);
        }
    },
};