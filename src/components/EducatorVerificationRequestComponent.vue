<template>
    <div >
        <h1>Solicitar verificación</h1>

        <form @submit.prevent="submitVerification" enctype="multipart/form-data">

            <div class="form-floating form-input">
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="formData.title"
                  placeholder="Título"
                />
                <label for="title"><i class="bi bi-person-fill"></i> Título </label>
            </div>

            <div class="form-floating form-input">
                <input
                  type="text"
                  class="form-control"
                  id="description"
                  v-model="formData.description"
                  placeholder="Descripción"
                />
                <label for="description"><i class="bi bi-person-fill"></i> Descripción </label>
            </div>
              
            <div class="form-floating form-input">
                <input
                  type="text"
                  class="form-control"
                  id="schoolOrInstitution"
                  v-model="formData.schoolOrInstitution"
                  placeholder="Institución"
                />
                <label for="schoolOrInstitution"><i class="bi bi-person-fill"></i>Institución</label>
            </div>

            <div class="col-md-12">
                <div class="form-floating form-input">
                    <input
                        type="file"
                        class="form-control"
                        id="title"
                        @change="handleFileUpload"
                        placeholder="Título en pdf"
                        accept=".pdf"
                        :max="5242880"
                    />
                    <label for="title"><i class="bi bi-qr-code"></i>Título</label>
                </div>
            </div>

            <div class="mt-4">
                <button type="submit" class="btn btn-primary btn-lg w-100">
                    <i class="bi bi-box-arrow-in-down"></i> Verificar
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { keycloak } from "@/main";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            formData: {
                title: "",
                description: "",
                schoolOrInstitution: "",
            },
            pdfFile: null,
            previewUrl: null,
        };
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    methods: {
        handleFileUpload(event) {
            this.pdfFile = event.target.files[0];
            if (this.pdfFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previewUrl = e.target.result;
                }
                reader.readAsDataURL(this.pdfFile);
            }
        },

        async submitVerification() {
            if (!this.formData.title || 
                !this.formData.description ||
                !this.formData.schoolOrInstitution ||
                !this.pdfFile) {
                Swal.fire({
                    icon: 'info',
                    title: 'Error',
                    text: 'Por favor, complete todos los campos.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            Swal.fire({
                title: 'Subiendo datos...',
                text: 'Por favor, espere.',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });

            let token = keycloak.token;
            try {
                const response = await axios.post("http://localhost:8081/api/v1/verification-request", {}, { 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "X-UUID": keycloak.tokenParsed.sub,
                    }
                });

                let formData = new FormData();
                formData.append('title', this.formData.title);
                formData.append('file', this.pdfFile);
                formData.append('description', this.formData.description);
                formData.append('schoolOrInstitution', this.formData.schoolOrInstitution);

                const attachmentResponse = await axios.post(`http://localhost:8081/api/v1/verification-request/${response.data.id}/attachment`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                        "X-UUID": keycloak.tokenParsed.sub,
                    }
                });

                Swal.close();

                if (attachmentResponse.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Contenido agregado!',
                        text: 'El curso ha sido actualizado con éxito.',
                        confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.router.go(-1);
                        }
                    });
                }
            } catch (e) {
                console.error("dbg: ", e);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar',
                    text: 'Algo salió mal al intentar subir la verificación.',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    }
}
</script>

<style>
.form-input {
    margin: 15px;
}
</style>