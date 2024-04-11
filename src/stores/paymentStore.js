import { defineStore } from 'pinia';
import { getCurrentInstance } from "vue";
import axios from 'axios';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    paymentMethods: [],
    isLoading: false,
    accountTypes: [],
    banks: [],
    userUuid: '',  
  }),
  actions: {
    setUserUuid() {
      const { proxy } = getCurrentInstance();
      this.userUuid = proxy.$keycloak.tokenParsed.sub; 
      console.log('userUuid:', this.userUuid);
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
      try {
        this.isLoading = true;
        const response = await axios.get(`http://localhost:8081/api/v1/paymentmethod/user/${this.userUuid}`);
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
