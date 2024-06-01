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
        <div class="header-item">Código</div>
        <div class="header-item">Fechas</div>
        <div class="header-item">Descuento</div>
        <div class="header-item">Compra Mínima</div>
        <div class="header-item">Descripción</div>
        <div class="header-item">Estado</div>
      </div>
      <div class="coupons-container">
        <div v-for="coupon in coupons" :key="coupon.cuponId" class="coupon-card">
          <div class="coupon-item">{{ coupon.cuponCode }}</div>
          <div class="coupon-item">{{ formatDates(coupon.startDate, coupon.endDate) }}</div>
          <div class="coupon-item">{{ formatDiscount(coupon.discountType, coupon.discountAmount) }}</div>
          <div class="coupon-item">{{ coupon.minAmountPurchase }} Bs</div>
          <div class="coupon-item">{{ coupon.descriptionPromotion }}</div>
          <div :class="['coupon-item', getStatusClass(coupon)]">{{ getStatus(coupon) }}</div>
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

const formatDates = (startDate, endDate) => {
  return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
};

const formatDiscount = (type, amount) => {
  return type === 'Percentage' ? `${amount}%` : `Bs ${amount}`;
};

const getStatus = (coupon) => {
  const currentDate = new Date();
  const start = new Date(coupon.startDate);
  const end = new Date(coupon.endDate);
  
  if (currentDate >= start && currentDate <= end) {
    return 'Actualmente activo';
  } else if (currentDate < start) {
    const daysUntil = Math.ceil((start - currentDate) / (1000 * 60 * 60 * 24));
    return `Estará vigente en ${daysUntil} días`;
  } else {
    const daysAgo = Math.ceil((currentDate - end) / (1000 * 60 * 60 * 24));
    return `Venció hace ${daysAgo} días`;
  }
};

const getStatusClass = (coupon) => {
  const currentDate = new Date();
  const start = new Date(coupon.startDate);
  const end = new Date(coupon.endDate);

  if (currentDate >= start && currentDate <= end) {
    return 'status-active';
  } else if (currentDate < start) {
    return 'status-upcoming';
  } else {
    return 'status-expired';
  }
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
  grid-template-columns: repeat(6, 1fr);
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
  grid-template-columns: repeat(6, 1fr);
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

.status-active {
  color: #4caf50;
  font-weight: bold;
}

.status-upcoming {
  color: #ffa726;
  font-weight: bold;
}

.status-expired {
  color: #f44336;
  font-weight: bold;
}
</style>
