// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import store from '../src/store/index'
Vue.use(infiniteScroll)
Vue.filter('currency',currency)
Vue.config.productionTip = false
Vue.use(vueLazyLoad,{
  loading:'../static/loading-svg'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
