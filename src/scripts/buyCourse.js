import axios from 'axios';
import Swal from 'sweetalert2';
import { usePaymentFormStore } from '@/stores/PaymentFormStore';

export default {
    data() {
        return {
            purchase: {
                amount: null,
                imageFile: null,
                courseId: null,
                paymentMethodId: null,
                kcUserKcUuid: null,
                datePurchase: null,
            },
            course: null,
            paymentMethod: null,
        };
    },
    mounted() {
        const courseId = this.$route.params.courseId;
        const paymentMethodId = this.$route.params.paymentMethodId;
        const store = usePaymentFormStore();

        // Inicializa el almacén para obtener el UUID y otros datos necesarios
        store.initializeStore();

        // Cargar los datos del curso
        axios.get(`http://localhost:8081/api/v1/course/${courseId}`)
            .then(response => {
                this.course = response.data;
                this.purchase.amount = this.course.courseStandardPrice;
                this.purchase.courseId = this.course.courseId;
                this.purchase.courseName = this.course.courseName;
            })
            .catch(error => {
                console.error('Error al obtener el curso:', error);
            });

        // Cargar los datos del método de pago
        axios.get(`http://localhost:8081/api/v1/paymentmethod/${paymentMethodId}`)
            .then(response => {
                this.paymentMethod = response.data;
                this.purchase.paymentMethodId = this.paymentMethod.paymentMethodId;
                this.purchase.kcUserKcUuid = this.paymentMethod.kcUserKcUuid;
                this.purchase.accountNumber = this.paymentMethod.accountNumber;
                this.paymentMethod.qrImage = response.data.qrImage;
            })
            .catch(error => {
                console.error('Error al obtener el método de pago:', error);
            });
    },
    methods: {
        onFileChange(e) {
            const file = e.target.files[0];
            if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
                this.purchase.imageFile = file;
            } else {
                Swal.fire({
                    title: '¡Error!',
                    text: 'Debe seleccionar un archivo de imagen en formato JPG o PNG.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    e.target.value = '';
                });
            }
        },
        submitForm() {
            const formData = new FormData();
            const store = usePaymentFormStore();

            // Verificar si el UUID está disponible
            if (!store.isUuidReady) {
                console.error('UUID no disponible, no se puede proceder.');
                return;
            }

            // Completa los datos para enviar el formulario
            formData.append('kcUserKcUuid', store.userUuid);
            formData.append('amount', this.purchase.amount);
            formData.append('courseId', this.purchase.courseId);
            formData.append('paymentMethodId', this.purchase.paymentMethodId);
            formData.append('datePurchase', new Date().toISOString());
            formData.append('Image', this.purchase.imageFile);

            // Envía la solicitud POST al backend
            axios.post('http://localhost:8081/api/v1/purchase', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    Swal.fire({
                        title: '¡Comprobante enviado!',
                        text: 'Su comprobante de compra ha sido enviado exitosamente. Debe esperar a que el educador valide su comprobante.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                    }).then(() => {
                        this.$router.push({ path: '/' });
                    });
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error durante la compra:', error);
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Ha ocurrido un error al enviar su comprobante de compra.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                    });
                });
        },
    },
};
