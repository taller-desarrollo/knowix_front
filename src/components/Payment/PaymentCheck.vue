<template>
    <div class="content">
        <h1>Administrar Pagos</h1>
        <h4>Visualiza y administra los pagos de tus cursos</h4>
        <div class="tabs">
            <button @click="currentTab = 'Pendientes'"
                :class="{ 'active': currentTab === 'Pendientes' }">Pendientes</button>
            <button @click="currentTab = 'Aceptados'"
                :class="{ 'active': currentTab === 'Aceptados' }">Aceptados</button>
            <button @click="currentTab = 'Rechazados'"
                :class="{ 'active': currentTab === 'Rechazados' }">Rechazados</button>
        </div>
        <div class="tab-content">
            <div v-if="currentTab === 'Pendientes'">
                <p>Aquí va el contenido de los pagos Pendientes.</p>
            </div>
            <div v-if="currentTab === 'Aceptados'">
                <p>Aquí va el contenido de los pagos Aceptados.</p>
            </div>
            <div v-if="currentTab === 'Rechazados'">
                <p>Aquí va el contenido de los pagos Rechazados.</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentTab: 'Pendientes'
        }
    }
}
</script>

<style scoped>
@import '@/styles/currentTabStyle.css';
</style>