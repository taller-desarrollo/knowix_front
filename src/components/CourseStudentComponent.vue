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
                <p>Aquí va el contenido de los cursos Inscritos.</p>
            </div>
            <div v-if="currentTab === 'Finalizados'">
                <p>Aquí va el contenido de los cursos Finalizados.</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentTab: 'Inscritos'
        }
    }
}
</script>

<style scoped>
@import '@/styles/currentTabStyle.css';
</style>