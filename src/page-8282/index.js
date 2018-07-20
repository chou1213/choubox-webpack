import 'babel-polyfill'
import Vue from 'COMMON'
import App from '@/app'
import router from './router';
import { _LIKE_UTIL } from 'ASSETS/like/js/_like_util-2.0'
import { format } from '@assets/js/date'
import '@assets/css/index.scss'
import bigolive from 'bigoapi/bigoapi-promise'
import Chart from '@components/chart';
import TableList from '@components/tableList';
import multiLang from 'multi-lang-js';
import bgyJson from '@lang/bgyJson.js';
import 'ASSETS/like/js/like-sdk-mock'

let util = new _LIKE_UTIL();
window.bigolive = bigolive;
multiLang.init({
    dataType: 'js',
    jsLang: bgyJson,
    callback: function(data) {
        window.curLang = data;
    }
})

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = window.curLang[to.meta.title];
    }

    // console.time('console');
    // console.log(to);
    // console.timeEnd('console');

    if (to.name === 'guidePage') {
        document.body.style.backgroundColor = '#2d1776';

    } else {
        document.body.style.backgroundColor = '#fff';
    }
    next()
})

Vue.filter('numUnitReverse', function(value) { //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
    let _result = '';
    _result = value < 0 ? '-' : '+';
    value = Math.abs(value);
    return _result + util.numUnitReverse(value);
});
Vue.filter('getPrev7Day', function(timestamp) {
    const prev7DayTimestamp = timestamp - 14 * 86400000;
    const next7DayTimestamp = timestamp - 8 * 86400000;
    const beginDate = format('yyyy.MM.dd', new Date(prev7DayTimestamp));
    const endDate = format('yyyy.MM.dd', new Date(next7DayTimestamp));
    return beginDate + ' - ' + endDate;
})


Vue.prototype.get7Day = function(timestamp) {
    let _dateArr = [];
    let currentTimestamp = timestamp;
    let dailyTimestamp = 86400000;


    for (let i = 1; i <= 7; i++) {
        let _timestamp = currentTimestamp - i * dailyTimestamp
        let _date = new Date(_timestamp);
        _dateArr.unshift({ day: format('yyyy-MM-dd', _date), formatDay: format('MM.dd', _date), formatFullDay: format('yyyy.MM.dd', _date), timestamp: _timestamp });
    }

    return _dateArr;
}

Vue.component('Chart', Chart)
Vue.component('TableList', TableList)

bigolive.start(async function() {
    await this.use('getToken');
    console.log(bigolive.token);
    new Vue({
        el: '#app',
        router,
        render: h => h(App)
    })
});
