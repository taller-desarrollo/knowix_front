import { defineStore } from 'pinia';
import { getCurrentInstance } from "vue";
import axios from 'axios';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    paymentMethods: [],
    isLoading: false,
    hasPaymentMethodsError: false, // Estado para manejar si hay un error en cargar métodos de pago
    accountTypes: [],
    banks: [],
    userUuid: '',  
  }),
  actions: {
    setUserUuid() {
      const { proxy } = getCurrentInstance();
      this.userUuid = proxy.$keycloak.tokenParsed.sub;
    },
    async initializeData() {
      this.setUserUuid();
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
      this.isLoading = true;
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/paymentmethod/user/${this.userUuid}`);
        if (response.data.length === 0) {
          throw new Error('No payment methods');
        }
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
        this.hasPaymentMethodsError = false;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
          this.paymentMethods = [];
          this.hasPaymentMethodsError = false; // No tratar 404 como un error de interfaz
        } else {
          console.error('Error fetching payment methods:', error);
          this.hasPaymentMethodsError = true;
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
});
