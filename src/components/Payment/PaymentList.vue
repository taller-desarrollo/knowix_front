<template>
    <div class="content">
        <h1>Formas de pago</h1>
        <h4>Elige un método de pago</h4>
        <div v-if="paymentMethods.length > 0" class="payment-list">
            <ul>
                <li v-for="method in paymentMethods" :key="method.paymentMethodId" class="payment-method">
                    <router-link :to="{
                        name: 'BuyCourseComponent',
                        params: { courseId: courseId.value, paymentMethodId: method.paymentMethodId }
                    }">
                        <h5>{{ method.nameOwner }}</h5>
                        <p>Número de cuenta: {{ method.accountNumber }}</p>
                        <p>Teléfono: {{ method.phoneNumber }}</p>
                    </router-link>
                </li>
            </ul>
        </div>
        <div v-else class="no-payment-methods">
            <p>No se encontraron métodos de pago.</p>
        </div>
    </div>
</template>

<script>
import paymentList from '@/scripts/paymentList.js';
export default paymentList;
</script>

<style scoped>
@import '@/styles/PaymentListStyle.css';
</style>