import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'

let api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {'Access-Control-Allow-Origin': '*'}
})

Vue.config.productionTip = false
Vue.prototype.$http = api



new Vue({
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')



Vue.config.productionTip = false

