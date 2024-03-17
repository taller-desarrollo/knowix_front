import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../components/HomeComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import Error404Component from '@/components/Error404Component.vue';
import EducatorComponentExample from '@/components/EducatorComponentExample.vue';
import StudentComponentExample from '@/components/StudentComponentExample.vue';
import { keycloak } from '../main'; 

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
        path: '/educator',
        component: EducatorComponentExample,
        name: 'educator',
        meta: { requiresAuth: true, role: 'educator' } 
    },
    {
        path: '/student',
        component: StudentComponentExample,
        name: 'student',
        meta: { requiresAuth: true, role: 'student' } 
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

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
   const hasRole = keycloak.hasResourceRole(to.meta.role);
   console.log(hasRole);
   if (hasRole){
    next();
   }else{
    alert('No tiene permisos para acceder a esta página.')
    next('/');
   }
  } else {
    next();
  }
});

export default router;
