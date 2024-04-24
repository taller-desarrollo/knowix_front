<template>
  <div class="container py-5">
    <h1 class="text-center mb-5">Mis Pagos</h1>
    <div v-if="isLoading" class="text-center">
      <span>Cargando...</span>
    </div>
    <div v-else class="row g-4">
      <a class="btn btn-primary" href="/payment-form">Agregar nuevo método de pago</a>
      <div v-for="method in paymentMethods" :key="method.paymentMethodId" class="col-12">
        <div class="card mb-3 card-custom">
          <div class="row g-0">
            <div class="col-md-4 qr-column" @click="openQrInNewTab(method.qrImage)">
              <img :src="getImageUrl(method.qrImage)" class="img-fluid rounded-start" alt="Código QR" />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <div class="bank-logo">
                  <img :src="getBankLogoUrl(method.bankBankId)" class="img-fluid rounded" alt="Logo del Banco" />
                </div>
                <h5 class="card-title">TITULAR: {{ method.nameOwner }}</h5>
                <div class="card-text mb-2">
                  <strong>Tipo de Cuenta:</strong> {{ method.accountTypeName }}
                </div>
                <div class="card-text mb-2">
                  <strong>Banco:</strong> 
                  <a :href="method.bankWebpage" target="_blank" class="btn btn-link btn-sm p-0 ml-2">{{ method.bankName }}</a>
                </div>
                <div class="card-text mb-2">
                  <strong>Número de cuenta: </strong> {{ method.accountNumber }}
                </div>
                <div class="card-text mb-2">
                  <strong>Teléfono: </strong> {{ method.phoneNumber }}
                </div>
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
import { usePaymentStore } from "@/stores/paymentStore";

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

function getBankLogoUrl(bankId) {
  try {
    return require(`@/assets/bank/${bankId}.png`);
  } catch (e) {
    console.error('Error loading bank image:', e);
    return ''; 
  }
}


function openQrInNewTab(imagePath) {
  window.open(getImageUrl(imagePath), '_blank');
}
</script>


<style scoped>
.bank-logo {
  position: absolute;
  right: 1rem; 
  top: 1rem;
  width: 120px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary, .btn-link {
  transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-link {
  text-decoration: underline; 
}
.btn-primary:hover, .btn-link:hover {
  filter: brightness(90%); 
}
.icon-link {
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
}
.icon-link i { 
  margin-right: 0.25rem;
}
.qr-column img:hover {
  opacity: 0.9; 
}
.card-custom {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  border-radius: 0.5rem; 
}
.card-custom .card-body {
  padding: 1.5rem;
  position: relative; 
}
.card-title {
  color: #0056b3;
  margin-bottom: 0.75rem; 
}
</style>
