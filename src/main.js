import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import vuetify from './plugins/vuetify'

let api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {'Access-Control-Allow-Origin': '*'}
})
Vue.config.productionTip = false
Vue.prototype.$http = api
new Vue({
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
