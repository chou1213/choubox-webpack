import Vue from 'vue';
import App from '@/app.vue';
import VueLazyLoad from 'vue-lazyload'
Vue.config.productionTip = false;

Vue.use(VueLazyLoad, {
    error: require('@assets/img/loading.png'),
    loading: require('@assets/img/loading.png')
})

new Vue({
    el: '#app',
    render: h => h(App)
})
