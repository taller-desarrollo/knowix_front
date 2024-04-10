import { defineStore } from 'pinia';
import axios from 'axios';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    paymentMethods: [],
    isLoading: false,
    accountTypes: [],
    banks: []
  }),
  actions: {
    async initializeData() {
      await this.fetchStaticData();
      await this.fetchPaymentMethods();
    },
    async fetchStaticData() {
      try {
        const accountTypesResponse = await axios.get('http://localhost:8081/api/v1/accounttype');
        const banksResponse = await axios.get('http://localhost:8081/api/v1/bank');
        this.accountTypes = accountTypesResponse.data;
        this.banks = banksResponse.data;
      } catch (error) {
        console.error('Error fetching static data:', error);
      }
    },
    async fetchPaymentMethods() {
      try {
        const userUuid = this.$state.userUuid; // Asegúrate de que userUuid se esté obteniendo correctamente
        const response = await axios.get(`http://localhost:8081/api/v1/paymentmethod/user/05f0b4fa-e28b-409f-96ec-1f3d2f505554`);
        this.paymentMethods = response.data.map(method => {
          const accountType = this.accountTypes.find(type => type.accountTypeId === method.accountTypeAccountTypeId);
          const bank = this.banks.find(bank => bank.bankId === method.bankBankId);
          return {
            ...method,
            accountTypeName: accountType ? accountType.description : 'Desconocido',
            bankName: bank ? bank.bankName : 'Desconocido',
            bankWebpage: bank ? bank.webpage : '#',
          };
        });
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        this.paymentMethods = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
});
