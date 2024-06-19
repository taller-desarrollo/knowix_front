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
                <Bar id="top-selling-courses-quantity" :options="chartOptions" :data="chartDataQuantity"/>
            </div>
        </div>
        <!--Year selectors-->
        <div class="date-selectors">
            <div class="date-selector">
                <label for="year">Año</label>
                <select id="year" v-model="year" @change="changeYear">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
        </div>

        <div v-if="yearStatistics" class="charts">
            <div class="chart">
                <Bar id="sells-by-months" :options="chartOptions" :data="chartDataYear" />
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
import Swal from 'sweetalert2';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    //change color of text to white
    plugins: {
        legend: {
            labels: {
                color: 'white'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: 'white'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        y: {
            ticks: {
                color: 'white'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        }
    }
};
// Generate an array of years from 2000 to the current year plus 10 years
const years = Array.from({ length: new Date().getFullYear() - 2010 + 10 }, (_, i) => (2010 + i).toString());
const year = ref(new Date().getFullYear().toString());
const statistics = ref(null);
const chartDataEarnings = ref(null);
const chartDataQuantity = ref(null);

const yearStatistics = ref(null);
const chartDataYear = ref(null);


const startDate = ref(new Date().toISOString().split('T')[0]);
// Set end date to today plus 30 days
const endDate = ref(new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

onMounted(() => {
    fetchStatistics();
    fetchYearStatistics();
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

function fetchYearStatistics() {
    axios.get(ENDPOINTS.statistics + '/sells-by-months', {
        headers: {
            "X-UUID": `${keycloak.tokenParsed.sub}`
        },
        params: {
            year: year.value
        }
    }).then(response => {
        yearStatistics.value = response.data;
        chartDataYear.value = {
            labels: yearStatistics.value.map(stat => stat.label),
            datasets: [
                {
                    label: 'Ganancias',
                    backgroundColor: '#f87979',
                    data: yearStatistics.value.map(stat => stat.earnings)
                },
                {
                    label: 'Ventas',
                    backgroundColor: '#79f8f8',
                    data: yearStatistics.value.map(stat => stat.y)
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
    console.log(new Date(endDate.value).getTime() < new Date(startDate.value).getTime());
    if(new Date(endDate.value).getTime() < new Date(startDate.value).getTime()) {
        Swal.fire('Error', 'La fecha de fin no puede ser anterior a la de inicio.', 'error');
        endDate.value = startDate.value;
        return;
    }
    else {
        endDate.value = newEndDate.target.value;
    }
    fetchStatistics();
}

function changeYear(newYear){
    year.value = newYear.target.value;
    fetchYearStatistics();
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

.date-selector select {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #162447;
    color: #ffffff;
    font-size: 16px;
}

.date-selector input::-webkit-calendar-picker-indicator {
    filter: invert(1);
}

.charts {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 1200px;
    /* Increased max-width for better horizontal scaling */
    flex-grow: 1;
}

.chart {
    background-color: #0f3460;
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    height: 400px;
    /* Increased height for better vertical size */
    min-height: 300px;
    flex-grow: 1;
}
</style>