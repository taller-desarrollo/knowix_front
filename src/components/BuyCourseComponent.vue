<template>
  <div class="content">
    <h1>Comprobante de compra de curso</h1>
    <h4>Por favor, verifique que los datos sean correctos y envie el comprobante de compra.</h4>
    <form @submit.prevent="submitForm" class="buycourse">
      <div class="form-group">
        <label for="amount">Costo del curso:</label>
        <input type="number" step="0.01" class="form-control" id="amount" v-model.number="purchase.amount" required
          readonly>
      </div>
      <div class="form-group">
        <label for="image">Comprobante:</label>
        <input type="file" class="form-control" id="image" @change="onFileChange" required>
      </div>
      <div class="form-group">
        <label for="courseId">ID del curso:</label>
        <input type="text" class="form-control" id="courseId" v-model="purchase.courseId" required readonly>
      </div>
      <div class="form-group">
        <label for="paymentMethodId">ID del método de pago:</label>
        <input type="text" class="form-control" id="paymentMethodId" v-model="purchase.paymentMethodId" required
          readonly>
      </div>
      <input type="hidden" id="kcUserKcUuid" v-model="purchase.kcUserKcUuid">
      <button type="submit">ENVIAR</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  props: ['courseId', 'paymentMethodId'],
  data() {
    return {
      purchase: {
        amount: null,
        imageFile: null,
        courseId: null,
        paymentMethodId: null,
        kcUserKcUuid: null
      }
    };
  },
  mounted() {
    this.purchase.courseId = this.courseId;
    this.purchase.paymentMethodId = this.paymentMethodId;
    this.loadCourseDetails();
  },
  methods: {
    loadCourseDetails() {
      axios.get(`http://localhost:8081/api/v1/course/${this.courseId}`)
        .then(response => {
          this.purchase.amount = response.data.courseStandardPrice;
        })
        .catch(error => {
          console.error('Error fetching course details:', error);
        });
    },
    onFileChange(e) {
      this.purchase.imageFile = e.target.files[0];
    },
    submitForm() {
      const formData = new FormData();
      formData.append('amount', this.purchase.amount);
      formData.append('courseId', this.purchase.courseId);
      formData.append('paymentMethodId', this.purchase.paymentMethodId);
      formData.append('kcUserKcUuid', this.purchase.kcUserKcUuid);
      formData.append('datePurchase', new Date().toISOString());
      formData.append('Image', this.purchase.imageFile);

      axios.post('http://localhost:8081/api/v1/purchase', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          Swal.fire({
            title: 'Se subió el comprobante de compra exitosamente!',
            text: 'Gracias por su compra',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Error al subir el comprobante de compra',
            text: 'Por favor, intente de nuevo',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: white;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin: 10px 0;
  background-color: #fff;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

.buycourse {
  max-width: 800px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.119);
  padding: 30px;
  border-radius: 8px;
}

.buycourse button {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  margin-top: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
}
</style>
