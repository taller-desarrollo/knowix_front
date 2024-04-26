<template>
    <div class="content">
        <div class="head-courses">
            <h1>Solicitud de Verificación</h1>
            <button class="general" @click="requestVerification()">Solicitar Verificación</button>
        </div>
        <div v-if="isLoading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <div v-else>
            <div class="table-header" style="display:flex!important">
                <div class="header-item" style="width: 100%!important;">Fecha</div>
                <div class="header-item" style="width: 100%!important;">Estado</div>
                <div class="header-item" style="width: 100%!important;">Comentarios</div>
            </div>
            <div class="courses-container">
                <div v-for="verification in verifications" :key="verification.id" class="course-card" style="display:flex!important">
                    <div class="course-item" style="width: 100%!important;">{{ verification.requestDate }}</div>
                    <div class="course-item" style="width: 100%!important;">{{ verification.state }}</div>
                    <div class="course-item" style="width: 100%!important;">{{ verification.additionalComment ? verification.additionalComment : 'No se agregaron comentarios'}} </div>
                </div>
                <div v-if="(!verifications || verifications.length === 0)  && !isLoading">
                    <v-alert type="info" dismissible>No se encontraron verificaciones.</v-alert>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { useRouter } from 'vue-router';
    import { useVerificationStore } from "@/stores/educatorVerificationStore";
    import { onMounted, computed, ref } from "vue";
    import { keycloak } from "@/main";
    
    const router = useRouter();
    const verificationStore = useVerificationStore();
    const page = ref(0);

    onMounted(async () => {
        console.log("dbg: requesting verification list");
        await verificationStore.fetchVerifications(page.value, 10, keycloak.tokenParsed.sub);
    });

    const isLoading = computed(() => verificationStore.isLoading);
    const verifications = computed(() => verificationStore.verifications);

    const requestVerification =  () => {
        router.push({ name: 'verification-request'});
    }
</script>