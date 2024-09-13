import { createRouter, createWebHistory } from 'vue-router';
import CreatePage from '../components/CreatePage.vue';
import ListPage from '../components/ListPage.vue';
import RedirectPage from '../components/RedirectPage.vue';

const routes = [
  { path: '/', name: 'create', component: CreatePage },
  { path: '/list', name:'list', component: ListPage },
  { path: '/redirect', name:'redirect', component: RedirectPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
