<template>
  <div class="content">
    <h1>Comprobante de compra de curso</h1>
    <h4>Por favor, verifique que los datos sean correctos y envie el comprobante de compra.</h4>
    <form @submit.prevent="submitForm" class="buycourse">
      <div class="form-group">
        <label for="amount">Costo del curso (Bs):</label>
        <input type="number" step="0.01" class="form-control" id="amount" v-model.number="purchase.amount" required
          readonly>
      </div>
      <div class="form-group">
        <label for="image">Comprobante:</label>
        <input type="file" class="form-control" id="image" @change="onFileChange" required>
      </div>
      <input type="hidden" class="form-control" id="courseId" v-model="purchase.courseId" required readonly>
      <div class="form-group">
        <label for="courseId">Nombre del curso:</label>
        <input type="text" class="form-control" id="courseId" v-model="purchase.courseName" required readonly>
      </div>
      <input type="hidden" class="form-control" id="paymentMethodId" v-model="purchase.paymentMethodId" required readonly>
      <div class="form-group">
        <label for="paymentMethodId">Número de cuenta del depositado:</label>
        <input type="text" class="form-control" id="paymentMethodId" v-model="purchase.accountNumber" required readonly>
      </div>
      <input type="hidden" class="form-control" id="kcUserKcUuid" v-model="purchase.kcUserKcUuid" required readonly>
      <button type="submit">ENVIAR</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      purchase: {
        amount: null,
        imageFile: null,
        courseId: null,
        paymentMethodId: null,
        kcUserKcUuid: null,
        datePurchase: null
      },
      course: null,
      paymentMethod: null
    };
  },
  mounted() {
    const courseId = this.$route.params.courseId;
    const paymentMethodId = this.$route.params.paymentMethodId;

    axios.get(`http://localhost:8081/api/v1/course/${courseId}`)
      .then(response => {
        this.course = response.data;
        this.purchase.amount = this.course.courseStandardPrice;
        this.purchase.courseId = this.course.courseId;
        this.purchase.courseName = this.course.courseName;
      })
      .catch(error => {
        console.error(error);
      });

    axios.get(`http://localhost:8081/api/v1/paymentmethod/${paymentMethodId}`)
      .then(response => {
        this.paymentMethod = response.data;
        this.purchase.paymentMethodId = this.paymentMethod.paymentMethodId;
        this.purchase.kcUserKcUuid = this.paymentMethod.kcUserKcUuid;
        this.purchase.accountNumber = this.paymentMethod.accountNumber;
      })
      .catch(error => {
        console.error(error);
      });
  },
  methods: {
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
            title: '¡Comprobante enviado!',
            text: 'Su comprobante de compra ha sido enviado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.$router.push({ path: '/' });
          });
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error during purchase:', error);
          Swal.fire({
            title: '¡Error!',
            text: 'Ha ocurrido un error al enviar su comprobante de compra.',
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
