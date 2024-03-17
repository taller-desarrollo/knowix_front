import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../components/HomeComponent.vue';
import Error404Component from '@/components/Error404Component.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';
import CourseFormComponent from '@/components/CourseFormComponent.vue';
import EducatorComponentExample from '@/components/EducatorComponentExample.vue';
import StudentComponentExample from '@/components/StudentComponentExample.vue';

const routes = [
    {
        path: '/',
        component: HomeComponent,
        name: 'home',
    },
    {
        path: '/new-course',
        component: CourseFormComponent,
        name: 'new-course',
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
    {
        path: '/profile',
        component: ProfileComponent,
        name: 'profile',
    },
];

const router = (keycloak) => {
  const vueRouter = createRouter({
    history: createWebHistory(),
    routes,
  });

  vueRouter.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
      const hasRole = keycloak.hasResourceRole(to.meta.role);
      if (hasRole) {
        next();
      } else {
        alert('No tiene permisos para acceder a esta página.');
        next('/');
      }
    } else {
      next();
    }
  });

  return vueRouter;
};

export default router;
