import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            purchase: {
                amount: null,
                imageFile: null,
                courseId: null,
                paymentMethodId: null,
                kcUserKcUuid: null,
                datePurchase: null
            },
            course: null,
            paymentMethod: null
        };
    },
    mounted() {
        const courseId = this.$route.params.courseId;
        const paymentMethodId = this.$route.params.paymentMethodId;

        axios.get(`http://localhost:8081/api/v1/course/${courseId}`)
            .then(response => {
                this.course = response.data;
                this.purchase.amount = this.course.courseStandardPrice;
                this.purchase.courseId = this.course.courseId;
                this.purchase.courseName = this.course.courseName;
            })
            .catch(error => {
                console.error(error);
            });

        axios.get(`http://localhost:8081/api/v1/paymentmethod/${paymentMethodId}`)
            .then(response => {
                this.paymentMethod = response.data;
                this.purchase.paymentMethodId = this.paymentMethod.paymentMethodId;
                this.purchase.kcUserKcUuid = this.paymentMethod.kcUserKcUuid;
                this.purchase.accountNumber = this.paymentMethod.accountNumber;
            })
            .catch(error => {
                console.error(error);
            });
    },
    methods: {
        onFileChange(e) {
            this.purchase.imageFile = e.target.files[0];
        },
        submitForm() {
            const formData = new FormData();
            formData.append('amount', this.purchase.amount);
            formData.append('courseId', this.purchase.courseId);
            formData.append('paymentMethodId', this.purchase.paymentMethodId);
            formData.append('kcUserKcUuid', this.purchase.kcUserKcUuid);
            formData.append('datePurchase', new Date().toISOString());
            formData.append('Image', this.purchase.imageFile);

            axios.post('http://localhost:8081/api/v1/purchase', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    Swal.fire({
                        title: '¡Comprobante enviado!',
                        text: 'Su comprobante de compra ha sido enviado exitosamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        this.$router.push({ path: '/' });
                    });
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error during purchase:', error);
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Ha ocurrido un error al enviar su comprobante de compra.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                });
        }
    }
}