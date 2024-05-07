import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../components/HomeComponent.vue';
import Error404Component from '@/components/Error404Component.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';
import CourseFormComponent from '@/components/CourseFormComponent.vue';
import StudentComponentExample from '@/components/StudentComponentExample.vue';
import EditCourseComponent from '@/components/EditCourseComponent.vue';
import CoursesEducatorComponent from '@/components/CoursesEducatorComponent.vue';
import UserRegistry from '@/components/UserRegistry.vue';
import SearchComponent from '@/components/SearchComponent.vue'
import PaymentAdministrator from '@/components/Payment/PaymentAdministrator.vue';
import PaymentForm from '@/components/Payment/PaymentForm.vue';
import UpsertCourseContentComponent from '@/components/UpsertCourseContentComponent.vue';
import CourseDetailsComponent from '@/components/CourseDetailsComponent.vue';
import PaymentList from '@/components/Payment/PaymentList.vue';
import PaymentCheck from '@/components/Payment/PaymentCheck.vue';
import PaymentStudent from '@/components/Payment/PaymentStudent.vue';
import CourseStudentComponent from '@/components/CourseStudentComponent.vue';
import BuyCourseComponent from '@/components/BuyCourseComponent.vue';
import Swal from 'sweetalert2';
import PendingVerificationListComponent from '@/components/PendingVerification/PendingVerificationListComponent.vue';
import EducatorVerificationRequestComponent from '@/components/EducatorVerificationRequestComponent.vue';
import EducatorVerificationListComponent from '@/components/EducatorVerificationListComponent.vue';
import PaymentStatusBuyer from '@/components/Payment/PaymentStatusBuyer.vue';

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
    meta: { requiresAuth: true, role: ['educator', 'student'] }
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
    path: '/add-content/:courseId/:operation/:id',
    component: UpsertCourseContentComponent,
    name: 'add-content',
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
  },
  {
    path: '/payment-administrator',
    name: 'PaymentAdministrator',
    component: PaymentAdministrator,
    meta: { requiresAuth: true, role: 'educator' }
  },
  {
    path: '/payment-form',
    name: 'PaymentForm',
    component: PaymentForm,
    meta: { requiresAuth: true, role: 'educator' }
  },
  {
    path: '/course-details/:id',
    name: 'CourseDetailsComponent',
    component: CourseDetailsComponent,
  },
  {
    path: '/payment-list/:kcUserKcUuid/:courseId',
    name: 'PaymentList',
    component: PaymentList,
    meta: { requiresAuth: true, role: ['educator', 'student'] }
  },
  {
    path: '/payment-check',
    name: 'PaymentCheck',
    component: PaymentCheck,
    meta: { requiresAuth: true, role: 'educator' }
  },
  {
    path: '/payment-student',
    name: 'PaymentStudent',
    component: PaymentStudent,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/course-student',
    name: 'CourseStudentComponent',
    component: CourseStudentComponent,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/buy-course/:courseId/:paymentMethodId',
    name: 'BuyCourseComponent',
    component: BuyCourseComponent,
    meta: { requiresAuth: true, role: ['educator', 'student'] }
  },
  {
    path: '/pending-verification',
    name: 'pending-verification',
    component: PendingVerificationListComponent,
    meta: { requiresAuth: true, role: 'administrator'}
  },
  {
    path: '/verification-list',
    name: 'verification-list',
    component: EducatorVerificationListComponent,
    meta: { requiresAuth: true, role: 'educator'}
  },
  {
    path: '/verification-request',
    name: 'verification-request',
    component: EducatorVerificationRequestComponent,
    meta: { requiresAuth: true, role: 'educator'}
  },
  {
    path: '/my-purchase',
    name: 'PaymentStatusBuyer',
    component: PaymentStatusBuyer,
    meta: { requiresAuth: true, role: ['educator', 'student']}
  }

];

const router = (keycloak) => {
  const vueRouter = createRouter({
    history: createWebHistory(),
    routes,
  });

  vueRouter.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
      if (!keycloak.authenticated) {
        return keycloak.login();
      } else {
        const roles = to.meta.roles || [];
        const hasRole = roles.length ? roles.some(role => keycloak.hasResourceRole(role)) : true;

        if (!hasRole) {
          Swal.fire({
            icon: 'error',
            title: 'Acceso negado',
            text: 'No tienes permisos para acceder a esta página',
          });
          return next('/');
        } else {
          return next();
        }
      }
    } else {
      return next();
    }
  });

  return vueRouter;
};

export default router;
