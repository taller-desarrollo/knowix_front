import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../components/HomeComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import Error404Component from '@/components/Error404Component.vue';

const routes = [
    
    {
        path: '/home',
        component: HomeComponent,
        name: 'home',
    },
    {
        path: '/',
        component: LoginComponent,
        name: 'login',
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