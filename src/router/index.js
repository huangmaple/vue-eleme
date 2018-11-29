import Vue from 'vue';
import Router from 'vue-router';
import seller from '../components/seller/seller.vue';
import ratings from '../components/ratings/ratings.vue';
import goods from '../components/goods/goods.vue';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: goods
  },
  {
    path: '/goods',
    name: 'goods',
    component: goods
  },
  {
    path: '/ratings',
    name: 'ratings',
    component: ratings
  },
  {
    path: '/seller',
    name: 'seller',
    component: seller
  }
];

export default new Router({
  routes,
  mode: 'history'
});
