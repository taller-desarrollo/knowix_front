<template>
    <div class="content">
        <h1>Mis cursos</h1>
        <h4>Visualiza los cursos en los que estás inscrito o que has finalizado</h4>
        <div class="tabs">
            <button @click="currentTab = 'Inscritos'"
                :class="{ 'active': currentTab === 'Inscritos' }">Inscritos</button>
            <button @click="currentTab = 'Finalizados'"
                :class="{ 'active': currentTab === 'Finalizados' }">Finalizados</button>
        </div>
        <div class="tab-content">
            <div v-if="currentTab === 'Inscritos'">
                <!-- Add button to report course content 
                <button @click="reportContent(content)" style="color: red;">&#9888;</button>
                -->
                <p>Aquí va el contenido de los cursos Inscritos.</p>
            </div>
            <div v-if="currentTab === 'Finalizados'">
                <p>Aquí va el contenido de los cursos Finalizados.</p>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import ENDPOINTS from '@/shared/endpoints';
import keycloak from '@/main';

export default {
    data() {
        return {
            currentTab: 'Inscritos'
        }
    },
    methods: {
        // Use this function to report course content
        async reportContent(contentId) {
            const { value: formValues } = await Swal.fire({
            title: 'Reportar contenido',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Razón del reporte">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value
                ]
            }
        });
    
        if (formValues) {
            try {
                const response = await axios.post(`${ENDPOINTS.contentReport}/comment/${contentId}`, {
                    contentReportReason: formValues[0]
                },
                {
                    headers: {
                        authorization: `Bearer ${keycloak.token}`
                    }
                }
            );
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }            
        }
    }
}
</script>

<style scoped>
@import '@/styles/currentTabStyle.css';
</style>