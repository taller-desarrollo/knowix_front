<template>
    <h1>{{ getTitle() }}</h1>
    <div>
        <div v-if="operation === 'section'" class="container-form">
            <label for="name" class="form-label">Nombre de la sección: </label>
            <input type="text" id="name" v-model="formDetails.section.sectionName" class="form-field"/>

            <label for="description" class="form-label">Descripción: </label>
            <input type="text" id="description" v-model="formDetails.section.sectionDescription" class="form-field"/>
            <button class="accept-button" @click="createSection">Agregar sección</button>
        </div>
        <div v-if="operation === 'content'" class="container-form">
            <div style="display: flex; flex-direction: column;">
                <div style="display: flex; width: 100%; flex-direction: row;">
                    <label for="title" class="form-label">Título: </label>
                    <button class="accept-button" @click="addAttachment()">Agregar adjunto +</button>
                </div>
                <input type="text" id="title" v-model="formDetails.content.contentTitle" class="form-field"/>
                
            </div>

            <div v-for="(attachment, index) in formDetails.content.attachments">
                <v-divider></v-divider>
                <h2>Agregado {{ index + 1 }}</h2>
                <label :for="'attachmentName' + index" class="form-label">Nombre: </label>
                <input :id="'attachmentName' + index" type="text" v-model="attachment.attachmentName" placeholder="Ingrese el nombre" class="form-field">
                <label :for="'attachment' + index" class="form-label">Archivo: </label>
                <v-file-input v-model="attachment.attachment" @change="getByteArray(attachment.attachment, index)" label="Archivo" class="form-field"></v-file-input>
            </div>
            <button class="accept-button" show-size @click="createContent">Agregar contenido</button>
        </div>
    </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from "sweetalert2";
import { ENDPOINTS } from '@/shared/endpoints';

export default {
    setup() {
        const router = useRouter();
        const courseId = router.currentRoute.value.params.courseId;
        const operation = router.currentRoute.value.params.operation;
        const id = router.currentRoute.value.params.id;
        const formDetails = ref({
            section: {
                sectionName: '',
                sectionDescription: '',
                sectionDate: '2024-04-01',
                status: true
            },
            content: {
                contentTitle: '',
                status: true,
                attachments: []
            }
        });

        function getTitle() {
            if(this.operation === 'section') return "AGREGAR NUEVA SECCIÓN";
            else if(this.operation === 'content') return "AGREGAR NUEVO CONTENIDO";
            else return "AÑADIR AGREGADO";
        };

        async function createSection() {
            try {
                await axios.post(`${ENDPOINTS.course}/${courseId}/section`, this.formDetails.section).
                then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Sección agregada!',
                            text: 'El curso ha sido actualizado con éxito.',
                            confirmButtonText: 'Aceptar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.go(-1);
                            }
                        });
                    } else {
                        throw new Error('Failed to create Section');
                    }
                });
            } catch(error) {
                console.error('Error updating course:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Algo salió mal al intentar crear la sección. Por favor, inténtalo de nuevo.',
                    confirmButtonText: 'Aceptar'
                });
            }
        };
        async function createContent() {
            try {
                axios.post(`${ENDPOINTS.course}/section/${id}/content`, this.formDetails.content).
                then((response) => {
                    if(response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Contenido agregado!',
                            text: 'El curso ha sido actualizado con éxito.',
                            confirmButtonText: 'Aceptar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.go(-1);
                            }
                        });
                    }
                })
            } catch(error) {
                console.error('Error updating course:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Algo salió mal al intentar crear el contenido. Por favor, inténtalo de nuevo.',
                    confirmButtonText: 'Aceptar'
                });
            }
            
        };
        function addAttachment() {
            this.formDetails.content.attachments.push({
                attachmentName: '',
                attachment: '',
                status: true,
            });
        };
        function getByteArray(file, index) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    let utf8Encode = new TextEncoder();
                    this.formDetails.content.attachments[index].attachment = stringToBytes(reader.result);
                    resolve(reader.result);
                }
                reader.onerror = (error) => reject(error);
            });
        };
        function stringToBytes(val) { 
            const result = []; 
            for (let i = 0; i < val.length; i++) { 
                result.push(val.charCodeAt(i)); 
            } 
            return result; 
        } 
        
        return {
            courseId,
            operation,
            id,
            formDetails,
            getTitle,
            createSection,
            createContent,
            addAttachment,
            getByteArray,
            stringToBytes
        }
    },
}
</script>
<style scoped>
@import "../styles/AddContent.css";

h2 {
    color: #414141;
}
</style>