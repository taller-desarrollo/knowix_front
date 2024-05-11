import { defineStore } from 'pinia';
import { getCurrentInstance } from "vue";
import axios from 'axios';
import Swal from 'sweetalert2';
import ENDPOINTS from '@/shared/endpoints';

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
        this.isUuidReady = true; 
        console.log('UUID set:', this.userUuid);
      } else {
        console.error('Unable to set UUID: Keycloak instance not available or not ready');
        this.isUuidReady = false; // Asegura que se sabe que el UUID no está listo
      }
    },
    fetchBanks() {
      return axios.get(ENDPOINTS.bank)
        .then(response => {
          this.banks = response.data;
        })
        .catch(error => {
          console.error('Error fetching banks:', error);
        });
    },
    fetchAccountTypes() {
      return axios.get(ENDPOINTS.accountType)
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

        const response = await axios.post(ENDPOINTS.paymentMethod, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        Swal.fire({
          icon: 'success',
          title: 'Forma de pago creada',
          text: 'La forma de pago se ha creado exitosamente.',
        });
        console.log('Payment method created:', response.data);
      } catch (error) {
        console.error('Error creating payment method:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la forma de pago',
          text: 'Ha ocurrido un error al intentar crear la forma de pago. Por favor, inténtalo de nuevo.',
        });
      }
    }
  }
});
