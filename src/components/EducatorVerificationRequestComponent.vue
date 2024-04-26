<template>
    <div class="container mt-4 ">
        <h1>Solicitar verificación</h1>

        <form @submit.prevent="submitVerification" enctype="multipart/form-data">

            <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="formData.title"
                  placeholder="Título"
                />
                <label for="title"><i class="bi bi-person-fill"></i> Título </label>
            </div>

            <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="description"
                  v-model="formData.description"
                  placeholder="Descripción"
                />
                <label for="description"><i class="bi bi-person-fill"></i> Descripción </label>
            </div>
              
            <div class="form-floating">
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
                <div class="form-floating">
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
            let token = keycloak.token;

            if (!this.formData.title || 
                !this.formData.description ||
                !this.formData.schoolOrInstitution ||
                !this.pdfFile) {
                    alert("Por favor, debe llenar los campos");
                    return;
            }

            try {
                await axios.post("http://localhost:8081/api/v1/verification-request",{}, { 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "X-UUID":  keycloak.tokenParsed.sub,
                    }, })
                    .then(
                    async (response) => {
                        console.log(response);
                        await axios.post("http://localhost:8081/api/v1/verification-request/" + response.data.id + "/attachment", {
                            title: this.formData.title,
                            file: this.pdfFile,
                            description: this.formData.description,
                            schoolOrInstitution: this.formData.schoolOrInstitution
                        },
                        {
                            headers: {
                                "X-UUID":  keycloak.tokenParsed.sub,
                            }
                        });
                    }
                );
            } catch (e) {
                console.log("dbg: ",e);
                // TODO: show error 
            }

        }
    }
}
</script>