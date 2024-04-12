import { defineStore } from 'pinia';
import { getCurrentInstance } from "vue";
import axios from 'axios';

export const usePaymentFormStore = defineStore('paymentForm', {
  state: () => ({
    banks: [],
    accountTypes: [],
    userUuid: '', // Este UUID se manejará internamente y no se pedirá al usuario
    isUuidReady: false, // Nuevo estado para verificar la disponibilidad del UUID
  }),
  actions: {
    async initializeStore() {
      // Usar métodos directamente con await dentro de una función compuesta por acciones
      await this.setUserUuid();
      if (this.isUuidReady) {
        await this.fetchBanks();
        await this.fetchAccountTypes();
      }
    },
    setUserUuid() {
      const instance = getCurrentInstance();
      if (instance && instance.proxy.$keycloak && instance.proxy.$keycloak.tokenParsed) {
        this.userUuid = instance.proxy.$keycloak.tokenParsed.sub;
        this.isUuidReady = true; // Se establece que el UUID está listo
        console.log('UUID set:', this.userUuid);
      } else {
        console.error('Unable to set UUID: Keycloak instance not available or not ready');
        this.isUuidReady = false; // Asegura que se sabe que el UUID no está listo
      }
    },
    fetchBanks() {
      return axios.get('http://localhost:8081/api/v1/bank')
        .then(response => {
          this.banks = response.data;
        })
        .catch(error => {
          console.error('Error fetching banks:', error);
        });
    },
    fetchAccountTypes() {
      return axios.get('http://localhost:8081/api/v1/accounttype')
        .then(response => {
          this.accountTypes = response.data;
        })
        .catch(error => {
          console.error('Error fetching account types:', error);
        });
    },
    async submitPaymentMethod(formData, qrImage) {
      if (!this.isUuidReady) {
        console.error('UUID not set. Cannot proceed with submission.');
        alert('Usuario no identificado. No se puede proceder con el envío del formulario.');
        return;
      }
      try {
        const data = new FormData();
        data.append('paymentMethod', JSON.stringify({ ...formData, kcUserKcUuid: this.userUuid }));
        data.append('qrImage', qrImage);

        const response = await axios.post('http://localhost:8081/api/v1/paymentmethod', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Forma de pago creada con éxito');
      } catch (error) {
        console.error('Error creating payment method:', error);
        alert('Hubo un error al crear la forma de pago');
      }
    }
  }
});
