<template>
    <div class="content">
        <div class="head-courses">
            <h1>Solicitudes de Verificación</h1>
        </div>
        <div v-if="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <div v-else>
            <div class="table-header" style="display:flex!important">
                <div class="header-item" style="width: 100%!important;">Fecha</div>
                <div class="header-item" style="width: 100%!important;">Estado</div>
                <div class="header-item" style="width: 100%!important;">Comentarios</div>
                <div class="header-item" style="width: 100%!important;">Agregado</div>
                <div class="header-item" style="width: 100%!important;"></div>
            </div>
            <div class="courses-container">
                <div v-for="verification in verifications" :key="verification.id" class="course-card" style="display:flex!important">
                    <div class="course-item" style="width: 100%!important;">{{ verification.requestDate }}</div>
                    <div class="course-item" style="width: 100%!important;">{{ verification.state }}</div>
                    <div class="course-item" style="width: 100%!important;">{{ verification.additionalComment ? verification.additionalComment : 'No se agregaron comentarios'}} </div>
                    <div class="course-item" style="width: 100%!important;">
                        <a v-if="hasDocumentAttached(verification)" :href="getDocumentLink(verification)">
                            Descargar documento
                        </a>
                        <p v-else>
                            No tiene documento agregado
                        </p>
                    </div>
                    <div class="course-item" style="width: 100%!important;">
                        <div v-if="verification.state === 'PENDING'">
                            <button class="general" style="background-color: #d90909 !important;" @click="rejectVerification(verification)">Rechazar</button>
                            <button class="general" style="background-color: #32a85a !important;" @click="acceptVerification(verification)">Aceptar</button>
                        </div>
                    </div>
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
    import { useVerificationStore } from "@/stores/verificationStore";
    import { onMounted, computed, ref } from "vue";
    import { keycloak } from "@/main";
    import Swal from "sweetalert2";
    import axios from 'axios';
    import { ENDPOINTS } from '@/shared/endpoints';
    
    const router = useRouter();
    const verificationStore = useVerificationStore();
    const page = ref(0);

    onMounted(async () => {
        console.log("dbg: requesting verification list");
        await verificationStore.fetchVerificationsAdmin(page.value, 10, keycloak.tokenParsed.sub);
    });

    const hasDocumentAttached = (verification)  => {
        return (verification.verificationRequestAttachmentDTOList.length !== 0 && verification.verificationRequestAttachmentDTOList[0].s3ObjectDTO.url);
    }

    const getDocumentLink = (verification) => {
        return verification.verificationRequestAttachmentDTOList[0].s3ObjectDTO.url;
    }

    const acceptVerification = async (verification) => {
        const result = await Swal.fire({
            title: 'Aceptar verificación',
            text: '¿Estás seguro aceptar la verificación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true,
            customClass: {
                confirmButton: 'confirm-button',
                cancelButton: 'cancel-button'
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (result.isConfirmed) {
            let token = keycloak.token; 
            await axios.put(`${ENDPOINTS.verificationRequest}/${verification.id}/approve`,{}, {
                headers: {
                            'Authorization': `Bearer ${token}`,
                            "X-UUID":  keycloak.tokenParsed.sub,
                }, 
            }).then((response) => {
                if(response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Aprovado con normalidad!',
                        text: 'La verificación ha sido aprobada.',
                        confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            router.go(-1);
                        }
                    });
                }
            });
        }
    }

    const rejectVerification = async (verification) => {
        const result = await Swal.fire({
            title: 'Rechazar verificación',
            text: '¿Estás seguro de rechazar la verificación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true,
            customClass: {
                confirmButton: 'confirm-button',
                cancelButton: 'cancel-button'
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

      if (result.isConfirmed) {
        let token = keycloak.token; 
        await axios.put(`${ENDPOINTS.verificationRequest}/${verification.id}/reject`,{}, {
            headers: {
                        'Authorization': `Bearer ${token}`,
                        "X-UUID":  keycloak.tokenParsed.sub,
            }, 
        }).then((response) => {
            if(response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Rechazado con normalidad!',
                    text: 'La verificación ha sido rechazada.',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.go(-1);
                    }
                });
            }
        });
      }
    }

    const isLoading = computed(() => verificationStore.isLoading);
    const verifications = computed(() => verificationStore.verifications);

</script>