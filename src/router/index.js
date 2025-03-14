import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login/Login.vue';
import Home from '../components/Home/HomeView.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/*',
    redirect: '/login' 
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardias de rutas
router.beforeEach((to, from, next) => {
  const loggedIn = !!localStorage.getItem('access_token');

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next({ name: 'Login' }); // Si no está autenticado, lo envía al login
  } else {
    next(); // Permite el acceso
  }
});

export default router;