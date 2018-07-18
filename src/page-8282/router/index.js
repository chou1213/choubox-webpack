import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [{
            path: '/',
            name: 'index',
            component: () =>
                import('@views/index'),
            meta: {
                title: 'lang001'
            }
        }, {
            path: '/followers',
            name: 'followers',
            component: () =>
                import('@views/followers'),
            meta: {
                title: 'lang008'
            }
        },
        {
            path: '/likes',
            name: 'Likes',
            component: () =>
                import('@views/likes'),
            meta: {
                title: 'lang016'
            }
        },
        {
            path: '/live',
            name: 'live',
            component: () =>
                import('@views/live'),
            meta: {
                title: 'lang023'
            }
        },
        {
            path: '/guidepage',
            name: 'guidePage',
            component: () =>
                import('@views/guidePage'),
            meta: {
                title: 'lang029'
            }
        }
    ]
});
