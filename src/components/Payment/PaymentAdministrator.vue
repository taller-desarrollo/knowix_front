<template>
  <div class="payment-methods-container">
    <h1 class="text-center my-4">Mis Pagos</h1>
    <div v-if="isLoading" class="text-center">
      <span>Cargando métodos de pago...</span>
    </div>
    <div v-else>
      <div
        v-for="method in paymentMethods"
        :key="method.paymentMethodId"
        class="card mb-3"
      >
        <div class="row g-0">
          <div class="col-md-4">
            <img
              :src="method.qrImage"
              class="img-fluid rounded-start"
              alt="QR Code"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{ method.nameOwner }}</h5>
              <p class="card-text">
                <small class="text-muted"
                  >Número de cuenta: {{ method.accountNumber }}</small
                >
              </p>
              <p class="card-text">Teléfono: {{ method.phoneNumber }}</p>
              <button class="btn btn-prƒimary">Editar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePaymentStore } from "../../stores/paymentStore"; // Asegúrate de tener este store creado

const paymentStore = usePaymentStore();
const isLoading = ref(true);
const paymentMethods = ref([]);

onMounted(async () => {
  await paymentStore.fetchPaymentMethods(); // Asumiendo que este método hace la llamada API y almacena los resultados
  paymentMethods.value = paymentStore.paymentMethods;
  isLoading.value = false;
});
</script>

<style scoped>

.payment-methods-container {
  padding: 20px;
}

.card-img-top {
  width: 100%;
  object-fit: cover;
}

.card-title {
  color: #333;
}

.card-text {
  color: #555;
}
</style>
