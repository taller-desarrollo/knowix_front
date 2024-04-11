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
        <label for="bankBankId" class="form-label">Banco</label>
        <select class="form-control" id="bankBankId" v-model="formData.bankBankId">
          <option v-for="bank in banks" :value="bank.bankId" :key="bank.bankId">{{ bank.bankName }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="accountTypeAccountTypeId" class="form-label">Tipo de Cuenta</label>
        <select class="form-control" id="accountTypeAccountTypeId" v-model="formData.accountTypeAccountTypeId">
          <option v-for="accountType in accountTypes" :value="accountType.accountTypeId" :key="accountType.accountTypeId">{{ accountType.description }}</option>
        </select>
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
import { usePaymentFormStore } from '../../stores/PaymentFormStore'; // Asegúrate de tener la ruta correcta al archivo store

export default {
  data() {
    return {
      formData: {
        ciPerson: '',
        nameOwner: '',
        phoneNumber: '',
        accountNumber: '',
        bankBankId: null,
        accountTypeAccountTypeId: null,

      },
      qrImage: null,
    };
  },
  computed: {
    store() {
      return usePaymentFormStore();
    },
    banks() {
      return this.store.banks;
    },
    accountTypes() {
      return this.store.accountTypes;
    }
  },
  methods: {
    handleFileUpload(event) {
      this.qrImage = event.target.files[0];
    },
    submitForm() {
      //imprimiendo formulario:
      console.log(this.formData);
      this.store.submitPaymentMethod(this.formData, this.qrImage);
    }
  },
  mounted() {
    this.store.initializeStore();
  }
};
</script>

<style scoped>
</style>
