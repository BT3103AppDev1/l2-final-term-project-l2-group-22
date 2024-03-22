import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Marketplace from '@/views/Marketplace.vue'; // Placeholder for your marketplace component
import Offers from '@/views/Offers.vue'; // Placeholder for your offers component
import Login from '@/views/Login.vue'; // Placeholder for your login component
import Profile from '@/views/Profile.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/marketplace',
    name: 'Marketplace',
    component: Marketplace,
  },
  {
    path: '/offers',
    name: 'Offers',
    component: Offers,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
  // ...other routes as needed
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
