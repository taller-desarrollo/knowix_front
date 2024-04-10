<template>
  <div class="container py-5">
    <h1 class="text-center mb-5">Mis Pagos</h1>
    <div v-if="isLoading" class="text-center">
      <span>Cargando...</span>
    </div>
    <div v-else class="row g-4">
      <div v-for="method in paymentMethods" :key="method.paymentMethodId" class="col-12">
        <div class="card mb-3 card-custom">
          <div class="row g-0">
            <div class="col-md-4 qr-column" @click="openQrInNewTab(method.qrImage)">
              <img :src="getImageUrl(method.qrImage)" class="img-fluid rounded-start" alt="Código QR" />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">{{ method.nameOwner }}</h5>
                <div class="text-muted mb-2">Tipo de Cuenta: {{ method.accountTypeName }}</div>
                <div class="card-text mb-2">
                  <strong>Banco:</strong> {{ method.bankName }}
                  <a :href="method.bankWebpage" target="_blank" class="btn btn-link btn-sm p-0 ml-2">Visitar sitio</a>
                </div>
                <p class="card-text">
                  <small class="text-muted">Número de cuenta: {{ method.accountNumber }}</small>
                </p>
                <div class="card-text">Teléfono: {{ method.phoneNumber }}</div>
                <button class="btn btn-primary mt-3">Editar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePaymentStore } from "../../stores/paymentStore";

const paymentStore = usePaymentStore();
const isLoading = ref(true);
const paymentMethods = ref([]);

onMounted(async () => {
  await paymentStore.initializeData();
  paymentMethods.value = paymentStore.paymentMethods;
  isLoading.value = false;
});

function getImageUrl(relativePath) {
  const baseUrl = "http://localhost:8081/";
  return baseUrl + relativePath;
}

function openQrInNewTab(imagePath) {
  window.open(getImageUrl(imagePath), '_blank');
}
</script>

<style scoped>
.qr-column img {
  cursor: pointer;
  object-fit: cover; /* Ajusta esto según necesites para el aspecto del QR */
  height: 100%; /* Esto asegura que la imagen cubra bien el espacio asignado */
}

.card-custom .card-body {
  /* Ajustes para la tipografía y el espaciado pueden ir aquí para personalizar */
}

/* Aquí puedes añadir estilos personalizados para adaptar aún más a Sandstone */
</style>
