<template>
  <div class="content">
    <h1>Administrar ventas</h1>
    <h4>
      Visualiza y administra los pagos recibidos por las ventas de tus cursos
    </h4>
    <div class="tabs">
      <button
        @click="currentTab = 'Pendientes'"
        :class="{ active: currentTab === 'Pendientes' }"
      >
        Pendientes
      </button>
      <button
        @click="currentTab = 'Aceptados'"
        :class="{ active: currentTab === 'Aceptados' }"
      >
        Aceptados
      </button>
      <button
        @click="currentTab = 'Rechazados'"
        :class="{ active: currentTab === 'Rechazados' }"
      >
        Rechazados
      </button>
    </div>
    <div class="tab-content">
      <div v-if="currentTab === 'Pendientes'">
        <h2>Pendientes de confirmación</h2>
        <ul class="sales-list">
          <li v-for="purchase in pendings" :key="purchase.purchaseId">
            <div class="sale-item">
              <div class="sale-info">
                <h3>{{ purchase.course.courseName }}</h3>
                <p>{{ formatDate(purchase.datePurchase) }}</p>
                <p>{{ purchase.amount }} USD</p>
              </div>
              <div class="sale-actions">
                    <button @click="confirmPurchase(purchase.purchaseId)">Confirmar</button>
                    <button @click="rejectPurchase(purchase.purchaseId)">Rechazar</button>
                </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="currentTab === 'Aceptados'">
        <h2>Ventas aceptadas</h2>
        <ul class="sales-list">
          <li v-for="purchase in accepteds" :key="purchase.purchaseId">
            <div class="sale-item">
              <div class="sale-info">
                <h3>{{ purchase.course.courseName }}</h3>
                <p>{{ formatDate(purchase.datePurchase) }}</p>
                <p>{{ purchase.amount }} USD</p>
              </div>
              <div class="sale-comfirmation">
                <p>{{ purchase.reply.coment }}</p>
                <p>{{ formatDate(purchase.reply.date) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="currentTab === 'Rechazados'">
        <h2>Ventas rechazadas</h2>
        <ul class="sales-list">
          <li v-for="purchase in rechazeds" :key="purchase.purchaseId">
            <div class="sale-item">
              <div class="sale-info">
                <h3>{{ purchase.course.courseName }}</h3>
                <p>{{ formatDate(purchase.datePurchase) }}</p>
                <p>{{ purchase.amount }} USD</p>
              </div>
              <div class="sale-rejection">
                <p>{{ purchase.reply.coment }}</p>
                <p>{{ formatDate(purchase.reply.date) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="loading" v-if="isLoading">
      <p>Cargando...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      currentTab: "Pendientes",
      purchases: [],
      isLoading: true,
    };
  },
  computed: {
    accepteds() {
      return this.purchases.filter(
        (purchase) => purchase.reply && purchase.reply.status
      );
    },
    rechazeds() {
      return this.purchases.filter(
        (purchase) => purchase.reply && !purchase.reply.status
      );
    },
    pendings() {
      return this.purchases.filter((purchase) => !purchase.reply);
    },
  },
  async created() {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/v1/purchase/seller/05f0b4fa-e28b-409f-96ec-1f3d2f505554"
      );
      this.purchases = response.data;

      // Fetch replies
      for (const purchase of this.purchases) {
        if (purchase.reply) continue;
        const replyResponse = await axios.get(
          `http://localhost:8081/api/v1/reply/purchase/${purchase.purchaseId}`
        );
        purchase.reply = replyResponse.data;
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    async confirmPurchase(purchaseId) {
      const reply = {
        status: true,
        date: new Date(),
        coment: "Aprobado con Normalidad",
        purchaseId,
      };

      const purchase = this.purchases.find((p) => p.purchaseId === purchaseId);
      purchase.reply = reply;

      // send POST request to accept the purchase
      await axios.post('http://localhost:8081/api/v1/reply', reply);
    },
    async rejectPurchase(purchaseId) {
      const reply = {
        status: false,
        date: new Date(),
        coment: "Comprobante no valido",
        purchaseId,
      };

      const purchase = this.purchases.find((p) => p.purchaseId === purchaseId);
      purchase.reply = reply;

      // send POST request to reject the purchase
      await axios.post('http://localhost:8081/api/v1/reply', reply);
    },
  },
};
</script>

<style scoped>
@import "@/styles/currentTabStyle.css";


.tab-content {
  display: flex;
  justify-content: space-around;
}

.sales-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sale-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #474747;
  padding: 1rem;
  border-radius: 5px;
  color: black;

}

.sale-info,
.sale-comfirmation,
.sale-rejection {
    flex: 1;
    margin-right: 1rem;
    color: black;

}

.sale-actions {
  display: flex;
  gap: 1rem;
}

button:hover {
  background-color: #45a049;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
</style>
