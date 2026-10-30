import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Layout from '../views/Layout.vue';
import Orders from '../views/Orders.vue';
import Menu from '../views/Menu.vue';
import Tables from '../views/Tables.vue';
import Dashboard from '../views/Dashboard.vue';

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
