<template>
  <div class="content">
    <h1 class="mb-4">Administrar ventas</h1>
    <div class="tabs">
      <div class="tab" @click="currentTab = 'Pendientes'">
        <p :class="{ active: currentTab === 'Pendientes' }">Pendientes</p>
      </div>
      <div class="tab" @click="currentTab = 'Aceptados'">
        <p :class="{ active: currentTab === 'Aceptados' }">Aceptados</p>
      </div>
      <div class="tab" @click="currentTab = 'Rechazados'">
        <p :class="{ active: currentTab === 'Rechazados' }">Rechazados</p>
      </div>
    </div>
    <div class="tab-content">
      <div v-if="currentTab === 'Pendientes'">
        <h2 class="mb-4">Pendientes de confirmación</h2>
        <ul class="list-group sales-list">
        <li v-for="purchase in pendings" :key="purchase.purchaseId" class="list-group-item">
          <div class="sale-item">
            <div class="sale-info">
              <h3 class="text-dark">Nombre del curso: {{ purchase.course.courseName }}</h3>
              <p class="text-dark">Fecha de compra: {{ formatDate(purchase.datePurchase) }}</p>
              <p class="text-dark">Monto: {{ purchase.amount }} Bs</p>
              <hr> <!-- Divider line -->
              <h5 class="text-dark">Detalles del método de pago</h5>
              <p class="text-dark">Nombre del titular: {{ purchase.paymentMethod.nameOwner }}</p>
              <p class="text-dark">CI: {{ purchase.paymentMethod.ciPerson }}</p>
              <p class="text-dark">Teléfono: {{ purchase.paymentMethod.phoneNumber }}</p>
              <p class="text-dark">Número de cuenta: {{ purchase.paymentMethod.accountNumber }}</p>

            </div>
            <div class="sale-actions">
              <button @click="confirmPurchaseWithCheckbox(purchase.purchaseId)" class="btn btn-sm btn-success text-dark">Confirmar</button>
              <button @click="rejectPurchaseWithComment(purchase.purchaseId)" class="btn btn-sm btn-danger text-dark">Rechazar</button>
              <a :href="`${backUrl}/` + purchase.imageComprobante" target="_blank" class="btn btn-sm btn-secondary text-dark">Ver Comprobante</a>
            </div>
          </div>
        </li>
      </ul>
      </div>
      <div v-if="currentTab === 'Aceptados'">
        <h2 class="mb-4">Ventas aceptadas</h2>
        <ul class="list-group sales-list">
  <li v-for="purchase in accepteds" :key="purchase.purchaseId" class="list-group-item">
    <div class="sale-item">
      <div class="sale-info">
        <h3 class="text-dark">Nombre del curso: {{ purchase.course.courseName }}</h3>
        <p class="text-dark">Fecha de compra: {{ formatDate(purchase.datePurchase) }}</p>
        <p class="text-dark">Monto: {{ purchase.amount }} Bs</p>
        <hr> <!-- Divider line -->
        <h5 class="text-dark">Detalles del método de pago</h5>
        <p class="text-dark">Nombre del titular: {{ purchase.paymentMethod.nameOwner }}</p>
        <p class="text-dark">CI: {{ purchase.paymentMethod.ciPerson }}</p>
        <p class="text-dark">Número de cuenta: {{ purchase.paymentMethod.accountNumber }}</p>
        <hr> <!-- Divider line -->
        <h5 class="text-dark">Detalles de la compra</h5>
        <p class="text-dark">Aceptado el: {{ formatDate(purchase.reply.date) }}</p>
        <p class="text-dark">{{ purchase.reply.coment }}</p>

        <a :href="`${backUrl}/` + purchase.imageComprobante" target="_blank" class="btn btn-sm btn-secondary text-dark">Ver Comprobante</a>
      </div>
    </div>
  </li>
</ul>



      </div>
      <div v-if="currentTab === 'Rechazados'">
        <h2 class="mb-4">Ventas rechazadas</h2>
        <ul class="list-group sales-list">
  <li v-for="purchase in rechazeds" :key="purchase.purchaseId" class="list-group-item">
    <div class="sale-item">
      <div class="sale-info">
        <h3 class="text-dark">Nombre del curso: {{ purchase.course.courseName }}</h3>
        <p class="text-dark">Fecha de compra: {{ formatDate(purchase.datePurchase) }}</p>
        <p class="text-dark">Monto: {{ purchase.amount }} Bs</p>

        <h5 class="text-dark">Método de pago:</h5>
        <p class="text-dark">Nombre del titular: {{ purchase.paymentMethod.nameOwner }}</p>
        <p class="text-dark">CI: {{ purchase.paymentMethod.ciPerson }}</p>
        <p class="text-dark">Número de cuenta: {{ purchase.paymentMethod.accountNumber }}</p>


        <h5 class="text-dark">Detalles del rechazo</h5>
        <p class="text-dark">Rechazado el: {{ formatDate(purchase.reply.date) }}</p>
        <p class="text-dark" style="color: red;">{{ purchase.reply.coment }}</p>
        <a :href="`${backUrl}/` + purchase.imageComprobante" target="_blank" class="btn btn-sm btn-secondary text-dark">Ver Comprobante</a>
      </div>
    </div>
  </li>
</ul>

      </div>
    </div>
    <div class="loading" v-if="isLoading">
      <p class="text-center text-dark">Cargando...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Swal from 'sweetalert2'
import { useRoute } from 'vue-router';
import { getCurrentInstance } from "vue";
import ENDPOINTS from '@/shared/endpoints';
import environment from '@/config.js';

export default {
data() {
  return {
    currentTab: "Pendientes",
    purchases: [],
    isLoading: false,
    backUrl: environment.backendUrl
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
  this.isLoading = true;
  try {
    const { proxy } = getCurrentInstance();
    this.userUuid = proxy.$keycloak.tokenParsed.sub;
    const response = await axios.get(`${ENDPOINTS.purchaseSeller}/${this.userUuid}`);
    const responseData = response.data;
    if (typeof responseData === 'string' && (responseData === "" || responseData.trim() === "No hay registros para esta solicitud")) {
      this.purchases = [];
      this.isLoading = false;
      return;
    }
    this.purchases = response.data;

    // Initialize purchase.reply as null
    this.purchases = this.purchases.map(purchase => ({
      ...purchase,
      reply: null
    }));

    // Fetch replies for each purchase
    for (const purchase of this.purchases) {
      if (purchase.reply) continue;
      const replyResponse = await axios.get(`${ENDPOINTS.replyPurchase}/${purchase.purchaseId}`);
      purchase.reply = replyResponse.data;
    }
  } catch (error) {
    console.error(error);
    this.isLoading = false;
  } finally {
    this.isLoading = false;
  }
},

methods: {
    formatDate(date) {
    return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },

    async confirmPurchaseWithCheckbox(purchaseId) {
      this.isLoading = true;

      const result = await Swal.fire({
        title: 'Confirmar compra',
        text: '¿Estás seguro de confirmar la compra y de haber recibido el monto solicitado en tu número de cuenta?. Después de confirmar, no podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
        customClass: {
          confirmButton: 'confirm-button',
          cancelButton: 'cancel-button'
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (result.isConfirmed) {
        const reply = {
          status: true,
          date: new Date(),
          coment: "Aprobado con Normalidad",
          purchaseId,
        };

        const purchase = this.purchases.find((p) => p.purchaseId === purchaseId);
        purchase.reply = reply;

        await axios.post(ENDPOINTS.reply, reply);

        Swal.fire({
          icon: 'success',
          title: 'Compra confirmada',
          text: 'La compra ha sido confirmada con éxito.',
        });
      }

      this.isLoading = false;
    },


    async rejectPurchaseWithComment(purchaseId) {
  this.isLoading = true;

  // Mostrar alerta con selección y un input condicional
  const { value: formValues } = await Swal.fire({
    title: 'Rechazar compra',
    html: `
      <select id="swal-input1" class="swal2-input">
        <option value="">Seleccione una razón</option>
        <option value="Pago incompleto">Pago incompleto</option>
        <option value="Cuenta bancaria erronea">Cuenta bancaria erronea</option>
        <option value="Imagen no correspondiente a un comprobante">Imagen no correspondiente a un comprobante</option>
        <option value="Otro">Otro</option>
      </select>
      <input id="swal-input2" class="swal2-input" style="display:none;" placeholder="Escribe aquí tu razón...">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Rechazar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    preConfirm: () => {
      const reason = document.getElementById('swal-input1').value;
      const customReason = document.getElementById('swal-input2').value;
      if (!reason) {
        Swal.showValidationMessage("Por favor, seleccione una razón");
      } else if (reason === "Otro" && !customReason) {
        Swal.showValidationMessage("Por favor, escriba una razón");
      }
      return { reason, customReason };
    },
    willOpen: () => {
      const select = document.getElementById('swal-input1');
      const input = document.getElementById('swal-input2');
      select.addEventListener('change', () => {
        if (select.value === "Otro") {
          input.style.display = 'block';
        } else {
          input.style.display = 'none';
        }
      });
    }
  });

  if (formValues) {
    const { reason, customReason } = formValues;
    const reply = {
      status: false,
      date: new Date(),
      coment: reason === "Otro" ? customReason : reason,
      purchaseId,
    };

    const purchase = this.purchases.find(p => p.purchaseId === purchaseId);
    purchase.reply = reply;

    await axios.post(ENDPOINTS.reply, reply).then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Respuesta enviada',
        text: 'La respuesta a la compra ha sido actualizada con éxito.',
      });
    }).catch(error => {
      console.error('Error al enviar la respuesta: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Ocurrió un error al actualizar la respuesta de la compra.',
      });
    });
  }
  this.isLoading = false;
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
    await axios.post(ENDPOINTS.reply, reply);
    },

    setup() {
        const route = useRoute();
        const kcUserKcUuid = route.params.kcUserKcUuid;
        return {
            kcUserKcUuid
        };
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
  background-color: #f7f7f7;
  padding: 1rem;
  border-radius: 0.5rem;
}

.sale-info,
.sale-actions,
.sale-comfirmation,
.sale-rejection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-secondary {
  margin-left: 1rem;
}

.tabs {
  display: flex;
  flex-direction: column;
}

.tab {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.tab p {
  margin: 0;
  padding: 0.5rem;
  cursor: pointer;
}

.active {
  background-color: #3b9542;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.sale-info h5 {
  margin-top: 1rem;
}

  </style>


