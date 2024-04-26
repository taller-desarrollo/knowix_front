<template>
  <div class="container mt-5">
    <h1>Buy Course</h1>
    <form @submit.prevent="submitForm">
      <!-- Removed the input field for purchaseId -->
      <div class="form-group">
        <label for="amount">Amount:</label>
        <input type="number" step="0.01" class="form-control" id="amount" v-model.number="purchase.amount" required>
      </div>
      <div class="form-group">
        <label for="image">Comprobante Image:</label>
        <input type="file" class="form-control" id="image" @change="onFileChange" required>
      </div>
      <div class="form-group">
        <label for="courseId">Course ID:</label>
        <input type="number" class="form-control" id="courseId" v-model="purchase.courseId" required>
      </div>
      <div class="form-group">
        <label for="paymentMethodId">Payment Method ID:</label>
        <input type="number" class="form-control" id="paymentMethodId" v-model="purchase.paymentMethodId" required>
      </div>
      <div class="form-group">
        <label for="kcUserKcUuid">User KC UUID:</label>
        <input type="text" class="form-control" id="kcUserKcUuid" v-model="purchase.kcUserKcUuid" required>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      purchase: {
        amount: null,
        imageFile: null,
        courseId: null,
        paymentMethodId: null,
        kcUserKcUuid: null,
        datePurchase: null // Continue to manage the date here
      }
    };
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
      formData.append('datePurchase', new Date().toISOString()); // Sending the formatted purchase date
      formData.append('Image', this.purchase.imageFile);

      axios.post('http://localhost:8081/api/v1/purchase', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        alert('Purchase Successful!');
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error during purchase:', error);
        alert('Failed to make purchase!');
      });
    }
  }
}
</script>

  
  
  <style scoped>
  </style>
  