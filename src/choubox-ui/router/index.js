import Router from 'vue-router';
import Vue from 'vue';
Vue.use(Router);
export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: () =>
            import('@views/index')
    }, {
        path: '/flex',
        name: 'flex',
        component: () =>
            import('@views/flex')
    }, {
        path: '/layout',
        name: 'layout',
        component: () =>
            import('@views/layout')
    }]
})
