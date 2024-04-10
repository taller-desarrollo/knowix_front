<template>
    <div class="container mt-3">
      <h1>Crear Nueva Forma de Pago</h1>
      <form @submit.prevent="submitForm" enctype="multipart/form-data">
        <div class="mb-3">
          <label for="ciPerson" class="form-label">CI Person</label>
          <input type="text" class="form-control" id="ciPerson" v-model="formData.ciPerson">
        </div>
        <div class="mb-3">
          <label for="nameOwner" class="form-label">Nombre del Propietario</label>
          <input type="text" class="form-control" id="nameOwner" v-model="formData.nameOwner">
        </div>
        <div class="mb-3">
          <label for="phoneNumber" class="form-label">Número de Teléfono</label>
          <input type="text" class="form-control" id="phoneNumber" v-model="formData.phoneNumber">
        </div>
        <div class="mb-3">
          <label for="accountNumber" class="form-label">Número de Cuenta</label>
          <input type="text" class="form-control" id="accountNumber" v-model="formData.accountNumber">
        </div>
        <div class="mb-3">
          <label for="bankBankId" class="form-label">ID del Banco</label>
          <input type="number" class="form-control" id="bankBankId" v-model="formData.bankBankId">
        </div>
        <div class="mb-3">
          <label for="kcUserKcUuid" class="form-label">UUID del Usuario</label>
          <input type="text" class="form-control" id="kcUserKcUuid" v-model="formData.kcUserKcUuid">
        </div>
        <div class="mb-3">
          <label for="accountTypeAccountTypeId" class="form-label">ID del Tipo de Cuenta</label>
          <input type="number" class="form-control" id="accountTypeAccountTypeId" v-model="formData.accountTypeAccountTypeId">
        </div>
        <div class="mb-3">
          <label for="qrImage" class="form-label">Imagen QR</label>
          <input type="file" class="form-control" id="qrImage" @change="handleFileUpload">
        </div>
        <button type="submit" class="btn btn-primary">Crear</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        formData: {
          ciPerson: '',
          nameOwner: '',
          phoneNumber: '',
          accountNumber: '',
          bankBankId: null,
          kcUserKcUuid: '',
          accountTypeAccountTypeId: null,
        },
        qrImage: null,
      };
    },
    methods: {
      handleFileUpload(event) {
        this.qrImage = event.target.files[0];
      },
      submitForm() {
        const data = new FormData();
        data.append('paymentMethod', JSON.stringify(this.formData));
        data.append('qrImage', this.qrImage);
  
        axios.post('http://localhost:8081/api/v1/paymentmethod', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          console.log(response.data);
          alert('Forma de pago creada con éxito');
        })
        .catch(error => {
          console.error(error);
          alert('Hubo un error al crear la forma de pago');
        });
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  