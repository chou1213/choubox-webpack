import Vue from 'vue'
import 'normalize.css';
import App from '@/views/app'
Vue.config.productionTip = false
new Vue({
    el: '#app',
    render: h => h(App)
})
