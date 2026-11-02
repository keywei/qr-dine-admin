import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login/index.vue';
import Layout from '../views/Layout/index.vue';
import Orders from '../views/Orders/index.vue';
import Menu from '../views/Menu/index.vue';
import Tables from '../views/Tables/index.vue';
import Dashboard from '../views/Dashboard/index.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/orders',
    children: [
      {
        path: 'orders',
        name: 'Orders',
        component: Orders,
      },
      {
        path: 'menu',
        name: 'Menu',
        component: Menu,
      },
      {
        path: 'tables',
        name: 'Tables',
        component: Tables,
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem('admin_token');
  if (to.path !== '/login' && !token) {
    return '/login';
  }
  if (to.path === '/login' && token) {
    return '/orders';
  }
  return true;
});

export default router;
