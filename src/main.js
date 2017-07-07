// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import resource from 'vue-resource'
import './semantic/dist/semantic.min.css'
import '@/assets/styles/master.styl'
import config from '@/config'

Vue.$config = config
console.log(Vue.$config)

Vue.config.productionTip = false
Vue.use(resource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
