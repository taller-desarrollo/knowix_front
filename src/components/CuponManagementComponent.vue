<template>
  <div class="content">
    <div class="head-coupons">
      <h1>Listado de Cupones</h1>
      <button class="general-button" @click="createCoupon()">Crear nuevo cupón</button>
    </div>
    <div v-if="isLoading" class="loading-container">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else>
      <div class="table-header">
        <div class="header-item">ID</div>
        <div class="header-item">Código</div>
        <div class="header-item">Tipo Descuento</div>
        <div class="header-item">Monto Descuento</div>
        <div class="header-item">Fecha Inicio</div>
        <div class="header-item">Fecha Fin</div>
        <div class="header-item">Compra Mínima</div>
        <div class="header-item">Descripción</div>
      </div>
      <div class="coupons-container">
        <div v-for="coupon in coupons" :key="coupon.cuponId" class="coupon-card">
          <div class="coupon-item">{{ coupon.cuponId }}</div>
          <div class="coupon-item">{{ coupon.cuponCode }}</div>
          <div class="coupon-item">{{ coupon.discountType }}</div>
          <div class="coupon-item">{{ coupon.discountAmount }}</div>
          <div class="coupon-item">{{ new Date(coupon.startDate).toLocaleDateString() }}</div>
          <div class="coupon-item">{{ new Date(coupon.endDate).toLocaleDateString() }}</div>
          <div class="coupon-item">{{ coupon.minAmountPurchase }}</div>
          <div class="coupon-item">{{ coupon.descriptionPromotion }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const coupons = ref([]);
const isLoading = ref(true);

const fetchCoupons = async () => {
  try {
    const response = await axios.get('http://localhost:8081/api/cupones/listar');
    coupons.value = response.data;
  } catch (error) {
    console.error("Error fetching coupons: ", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCoupons();
});

const createCoupon = () => {
  // Redirige a la página de creación de cupones
  this.$router.push('/cupon-form');
};
</script>

<style scoped>


.content {
  padding: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.head-coupons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.general-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.general-button:hover {
  background-color: #45a049;
}

.table-header {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  margin-bottom: 1rem;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #202036;
}

.header-item {
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}

.coupons-container {
  border-radius: 10px;
  overflow-x: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #202036;
}

.coupon-card {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  background-color: #547993;
  transition: background-color 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.coupon-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.coupon-item {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon-item:nth-child(odd) {
  background-color: #425768;
  border-radius: 10px;
}

.coupon-item:last-child {
  border-bottom: none;
}
</style>
