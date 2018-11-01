import Vue from 'vue';
import App from '@/Main.vue';

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    render: h => h(App)
})
