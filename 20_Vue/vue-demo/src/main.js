import Vue from 'vue'
import App from './App'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  components: {App},
  template: '<App/>'
})
