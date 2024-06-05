import axios from 'axios';
import Swal from 'sweetalert2';
import { usePaymentFormStore } from '@/stores/PaymentFormStore';
import ENDPOINTS from '@/shared/endpoints';
import environment from "@/config";

export default {
    data() {
        return {
            purchase: {
                amount: null,
                imageFile: null,
                courseId: null,
                courseName: null,
                paymentMethodId: null,
                kcUserKcUuid: null,
                accountNumber: null,
                datePurchase: null,
            },
            course: null,
            paymentMethod: null,
            backUrl: environment.backendUrl,
            cuponCode: '',
            originalAmount: null,
            cuponApplied: false,
            discountTypeMessage: ''
        };
    },
    mounted() {
        const courseId = this.$route.params.courseId;
        const paymentMethodId = this.$route.params.paymentMethodId;

        axios.get(`${ENDPOINTS.course}/${courseId}`)
            .then(response => {
                this.course = response.data;
                this.purchase.amount = this.course.courseStandardPrice;
                this.originalAmount = this.purchase.amount;
                this.purchase.courseId = this.course.courseId;
                this.purchase.courseName = this.course.courseName;
            })
            .catch(error => {
                console.error('Error al obtener el curso:', error);
            });
        axios.get(`${ENDPOINTS.paymentMethod}/${paymentMethodId}`)
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
        async applyCupon() {
            try {
                const response = await axios.post('http://localhost:8081/api/cupones/buscar-por-codigo', {
                    cuponCode: this.cuponCode
                });
                if (response.status === 200 && response.data) {
                    const cupon = response.data;
                    const now = new Date();
                    const startDate = new Date(cupon.startDate);
                    const endDate = new Date(cupon.endDate);

                    if (now < startDate || now > endDate) {
                        Swal.fire({
                            title: '¡Error!',
                            text: `El cupón ha expirado o no es válido en este momento.`,
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                        });
                        return;
                    }

                    if (this.purchase.amount >= cupon.minAmountPurchase) {
                        this.originalAmount = this.purchase.amount; // Asegurar que el originalAmount esté actualizado
                        let newAmount = this.purchase.amount;
                        let discount = 0;
                        if (cupon.discountType === 'Percentage') {
                            discount = (this.purchase.amount * cupon.discountAmount) / 100;
                            newAmount = this.purchase.amount - discount;
                            this.discountTypeMessage = `${cupon.discountAmount}%`;
                        } else if (cupon.discountType === 'Fixed Amount') {
                            discount = cupon.discountAmount;
                            newAmount = this.purchase.amount - discount;
                            this.discountTypeMessage = `${discount} Bs`;
                        }
                        this.purchase.amount = newAmount;
                        this.cuponApplied = true; // Mostrar mensaje de éxito
                        Swal.fire({
                            title: '¡Cupón aplicado!',
                            text: `Monto original: ${this.originalAmount} Bs, Descuento: ${discount} Bs, Monto con descuento: ${newAmount} Bs`,
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                        });
                    } else {
                        Swal.fire({
                            title: '¡Error!',
                            text: `El monto mínimo para aplicar este cupón es de ${cupon.minAmountPurchase} Bs`,
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                        });
                    }
                }
            } catch (error) {
                Swal.fire({
                    title: '¡Error!',
                    text: `Error al buscar el cupón por código: ${error.response ? error.response.data : error.message}`,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        },
        submitForm() {
            const formData = new FormData();
            const store = usePaymentFormStore();
            if (!store.isUuidReady) {
                console.error('UUID no disponible, no se puede proceder.');
                return;
            }
            formData.append('kcUserKcUuid', store.userUuid);
            formData.append('amount', this.purchase.amount);
            formData.append('courseId', this.purchase.courseId);
            formData.append('paymentMethodId', this.purchase.paymentMethodId);
            formData.append('datePurchase', new Date().toISOString());
            formData.append('Image', this.purchase.imageFile);
            Swal.fire({
                title: 'Procesando...',
                text: 'Su pago está siendo procesado, por favor espere.',
                icon: 'info',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            axios.post(ENDPOINTS.purchase, formData, {
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
