import { defineStore } from 'pinia';
import axios from 'axios';
import { keycloak } from "@/main";

export const useVerificationStore = defineStore('verification', {
    state: () => ({
        verifications: [],
        isLoading: false,
    }),
    actions: {
        async fetchVerifications(page = 0, size = 12, sub) {
            let token = keycloak.token;

            this.isLoading = true;
            try {
                let url = 'http://localhost:8081/api/v1/verification-request/educator';
                
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "X-UUID": sub,
                    }
                },);
                this.verifications = response.data;
                console.log(response.data);
            } catch (error) {
                console.error('There was an error fetching verifications');
                this.verifications = [];
            } finally {
                this.isLoading = false;
            }
        },

    }
})