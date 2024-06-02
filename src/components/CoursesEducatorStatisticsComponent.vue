<template>
    <div class="container">
        <div class="header">
            <h1>Estadísticas de cursos</h1>
        </div>
        <!--Date selectors-->
        <div class="date-selectors">
            <div class="date-selector">
                <label for="start-date">Fecha de inicio</label>
                <input type="date" id="start-date" v-model="startDate" @change="changeStartDate" />
            </div>
            <div class="date-selector">
                <label for="end-date">Fecha de fin</label>
                <input type="date" id="end-date" v-model="endDate" @change="changeEndDate" />
            </div>
        </div>
        <div v-if="statistics" class="charts">
            <div class="chart">
                <Bar id="top-selling-courses-earnings" :options="chartOptions" :data="chartDataEarnings" />
            </div>
            <div class="chart">
                <Bar id="top-selling-courses-quantity" :options="chartOptions" :data="chartDataQuantity" />
            </div>
        </div>
    </div>
</template>
<script setup>
import ENDPOINTS from '@/shared/endpoints';
import { keycloak } from '@/main';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};


const statistics = ref(null);
const chartDataEarnings = ref(null);
const chartDataQuantity = ref(null);


const startDate = ref(new Date().toISOString().split('T')[0]);
// Set end date to today plus 30 days
const endDate = ref(new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

onMounted(() => {
    fetchStatistics();
});

function fetchStatistics() {
    axios.get(ENDPOINTS.statistics + '/top-selling-courses', {
        headers: {
            "X-UUID": `${keycloak.tokenParsed.sub}`
        },
        params: {
            startDate: startDate.value,
            endDate: endDate.value
        }
    }).then(response => {
        statistics.value = response.data;
        chartDataEarnings.value = {
            labels: statistics.value.map(stat => stat.label),
            datasets: [
                {
                    label: 'Ganancias',
                    backgroundColor: '#f87979',
                    data: statistics.value.map(stat => stat.earnings)
                },
            ]
        };
        chartDataQuantity.value = {
            labels: statistics.value.map(stat => stat.label),
            datasets: [
                {
                    label: 'Ventas',
                    backgroundColor: '#79f8f8',
                    data: statistics.value.map(stat => stat.y)
                }
            ]
        };
    }).catch(error => {
        console.error(error);
    });
}

function changeStartDate(newStartDate) {
    startDate.value = newStartDate.target.value;
    fetchStatistics();
}

function changeEndDate(newEndDate) {
    endDate.value = newEndDate.target.value;
    fetchStatistics();
}

</script>

<style scoped>
.container {
    padding: 20px;
    background-color: #1a1a2e;
    color: #ffffff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header {
    text-align: center;
    margin-bottom: 20px;
    width: 100%;
}

.date-selectors {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 100%;
    max-width: 600px;
}

.date-selector {
    display: flex;
    flex-direction: column;
    width: 48%;
}

.date-selector label {
    margin-bottom: 5px;
}

.date-selector input {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #162447;
    color: #ffffff;
}

.date-selector input::-webkit-calendar-picker-indicator {
    filter: invert(1);
}

.charts {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 1200px; /* Increased max-width for better horizontal scaling */
    flex-grow: 1;
}

.chart {
    background-color: #0f3460;
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    height: 400px; /* Increased height for better vertical size */
    min-height: 300px;
    flex-grow: 1;
}
</style>