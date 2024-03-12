import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../components/HomeComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import Error404Component from '@/components/Error404Component.vue';
import CourseFormComponent from '@/components/CourseFormComponent.vue'; // Importa el componente del formulario

const routes = [
    {
        path: '/home',
        component: HomeComponent,
        name: 'home',
    },
    {
        path: '/login',
        component: LoginComponent,
        name: 'login',
    },
    {
        path: '/new-course', // Ruta para el formulario del nuevo curso
        component: CourseFormComponent,
        name: 'new-course',
    },
    {
        path: '/:pathMatch(.*)*',
        component: Error404Component,
        name: 'error404',
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
