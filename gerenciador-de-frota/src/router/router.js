// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import VueCookies from 'vue-cookies'
import LoginView from '../views/LoginView.vue';
import FrotaView from '@/views/FrotaView.vue';

const routes = [
  {
    path: '/',
    name: 'LoginView',
    component: LoginView,
  },
  {
    path: '/Frota',
    name: 'FrotaView',
    component: FrotaView,
    meta: { requiresAuth: true } //rota protegida
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {

  const isAuthenticated = VueCookies.get('adminLogado')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/'); //redireciona para login
  } else {
    next(); //libera a navegação
  }
})

export default router;
