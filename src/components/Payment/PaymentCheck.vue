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
                <p>{{ purchase.imageComprobante }}</p>
<a :href="'http://localhost:8081/' + purchase.imageComprobante" target="_blank">Ver Comprobante Recibido</a>
         

            </div>
            <div class="sale-actions">
                    <button @click="confirmPurchaseWithCheckbox(purchase.purchaseId)">Confirmar</button>
                    <button @click="rejectPurchaseWithComment(purchase.purchaseId)">Rechazar</button>

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
import Swal from 'sweetalert2'
import { useRoute } from 'vue-router';
import { getCurrentInstance } from "vue";



export default {
data() {
  return {
    currentTab: "Pendientes",
    purchases: [],
    isLoading: false,
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
    const response = await axios.get(`http://localhost:8081/api/v1/purchase/seller/${this.userUuid}`);
    this.purchases = response.data;

    // Initialize purchase.reply as null
    this.purchases = this.purchases.map(purchase => ({
      ...purchase,
      reply: null
    }));

    // Fetch replies for each purchase
    for (const purchase of this.purchases) {
      if (purchase.reply) continue;
      const replyResponse = await axios.get(`http://localhost:8081/api/v1/reply/purchase/${purchase.purchaseId}`);
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

    async confirmPurchaseWithCheckbox(purchaseId) {
      this.isLoading = true;

      const result = await Swal.fire({
        title: 'Confirmar compra',
        text: '¿Estás seguro de confirmar la compra y de haber recibido el monto solicitado en tu número de cuenta?',
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

        await axios.post('http://localhost:8081/api/v1/reply', reply);

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

    await axios.post('http://localhost:8081/api/v1/reply', reply).then(response => {
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
    await axios.post('http://localhost:8081/api/v1/reply', reply);
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

.confirm-button {
  background-color: #4CAF50;
  color: white;
}

.cancel-button {
  background-color: #FF5722;
  color: white;
}

.reject-button {
  background-color: #FF5722;
  color: white;
}

.cancel-button {
  background-color: #4CAF50;
  color: white;
}
</style>