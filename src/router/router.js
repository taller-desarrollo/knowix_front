import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../components/HomeComponent.vue';
import Error404Component from '@/components/Error404Component.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';
import CourseFormComponent from '@/components/CourseFormComponent.vue';
import StudentComponentExample from '@/components/StudentComponentExample.vue';
import EditCourseComponent from '@/components/EditCourseComponent.vue';
import CoursesEducatorComponent from '@/components/CoursesEducatorComponent.vue';
import UserRegistry  from '@/components/UserRegistry.vue';
import SearchComponent from '@/components/SearchComponent.vue'

const routes = [
    {
        path: '/',
        component: HomeComponent,
        name: 'home',
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
    {
        path: '/new-course',
        component: CourseFormComponent,
        name: 'new-course',
        meta: { requiresAuth: true, role: 'educator' } 
    },
    {
        path: '/edit-course/:id',
        component: EditCourseComponent,
        name: 'edit-course',
        meta: { requiresAuth: true, role: 'educator' }
    },
    {
        path: '/courses-educator',
        component: CoursesEducatorComponent,
        name: 'courses-educator',
        meta: { requiresAuth: true, role: 'educator' } 
    },
    {
        path: '/register',
        component: UserRegistry,
        name: 'user-registration',
    },
    {
      path: '/search',
      name: 'SearchComponent',
      component: SearchComponent
    }
];

const router = (keycloak) => {
  const vueRouter = createRouter({
    history: createWebHistory(),
    routes,
  });

  vueRouter.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
      if (keycloak.authenticated) { 
        console.log(keycloak.tokenParsed.sub)
        const hasRole = keycloak.hasResourceRole(to.meta.role);
        if (hasRole) {
          next();
        } else {
          alert('No tiene permisos para acceder a esta página.');
          next('/');
        }
      } else {
        keycloak.login();
      }
    } else {
      next();
    }
  });

  return vueRouter;
};

export default router;
