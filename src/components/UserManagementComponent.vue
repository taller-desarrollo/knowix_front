<template>
    <div>
        <h1 style="color: white">
            Gestión de usuarios
        </h1>
        <table>
            <thead>
                <tr>
                    <th>KcUuid</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.kcUuid">
                    <td>{{ user.kcUuid }}</td>
                    <td>{{ user.firstName }}</td>
                    <td>{{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                        <button @click="toggleBlock(user)">{{ getButtonText(user) }}</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import ENDPOINTS from '@/shared/endpoints';

export default {
    data() {
        return {
            users: [],
        };
    },
    async created() {
        try {
            const response = await axios.get(`${ENDPOINTS.user}/all`);
            this.users = response.data;
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        async toggleBlock(user) {
            try {
                if (user.blocked) {
                    await axios.put(`${ENDPOINTS.user}/unblock/${user.kcUuid}`);
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario desbloqueado',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    await axios.put(`${ENDPOINTS.user}/block/${user.kcUuid}`);
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario bloqueado',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
                user.blocked = !user.blocked;
            } catch (error) {
                console.error(error);
            }
        },
        getButtonText(user) {
            return user.blocked ? 'Desbloquear' : 'Bloquear';
        },
    },
};
</script>
<style >
table {
    width: 95%;
    margin: auto;
    border-collapse: collapse;

}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    color: #0f182a;
}

tr:nth-child(even) {
    background-color: #dddada;
}

tr:nth-child(odd) {
    background-color: #e7e5e5;
}

th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #16213e;
    color: white;
}

button {
    padding: 10px 20px;
    margin: 5px 0;
    background-color: #16213e;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color:  #0f182a;
}
</style>