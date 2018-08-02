import Vue from 'vue'
import App from './App'

import './assets/css/base.css'

import layer from 'vue-layer'
import moment from 'moment'

Vue.prototype.layer = layer(Vue)
Vue.prototype.moment = moment()

new Vue({
  el: '#app',
  components: {App},
  template: '<App/>'
})
