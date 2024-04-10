import { defineStore } from 'pinia';
import { getCurrentInstance } from "vue";
import axios from 'axios';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    paymentMethods: [],
    isLoading: false,
  }),
  actions: {
    async fetchPaymentMethods() {
      const { proxy } = getCurrentInstance();
      const userUuid = proxy.$keycloak.tokenParsed.sub;
      console.log('userUuid:', userUuid);
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/paymentmethod/user/${userUuid}`);
        this.paymentMethods = response.data;
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        this.paymentMethods = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
});
