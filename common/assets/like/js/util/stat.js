/**
 * Created by yuanqiujuan on 2018/6/25.
 */
import LikeBase from './base';
import bigoapi from 'bigoapi/bigoapi-promise'
const util = new LikeBase();

export class Stat {
    constructor() {
    }

    injectGoogleStat(id, callback) {
        var i = id || 'UA-88841927-2';

        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments);
            }, i[r].l = Number(new Date());
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        ga('create', i, 'auto');

        if (callback) {
            callback();
        }
    }

    googleStat(cate, action, label) {
        try {
            ga('send', {
                hitType: 'event',
                eventCategory: cate,
                eventAction: action,
                eventLabel: label
            });
        } catch (e) {}
    }

    injectHdStat(){
        (function(i, s, o, g) {
            var a, m;

            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments);
            }, i[r].l = Number(new Date());
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window, document, 'script', '//hdjs.hiido.com/hiido_internal.js');
    }

    hdStat(activeName) {
        try {
            hd('event', {
                eventAction: activeName
            });
        } catch (e) {
            console.log(e);
        }
    }

    async hiveStat(isLive, param, callback){
        var params = (typeof param === 'string' || !param) ? {} : param,
            statUrl = '/live/statistics/statBanner';

        params.os = params.os || util.checkOs();
        params.btn_stat = param && typeof param === 'string' && param;

        if (isLive) {
            const tokenData = await bigoapi.use('getToken'),
                countryCode = await bigoapi.use('getCountryCode');

            params.token = tokenData[2];
            params.country_code = countryCode[1];

            util.httpReq({
                method: 'POST',
                data: params,
                url: statUrl,
                success: function() {
                    callback && callback()
                }
            });
        } else {
            let img = new Image(),
                isCallbacked = false;

            util.addEvent(img, 'load', function () {
                !isCallbacked && callback && callback();
                isCallbacked = true;
            });

            setTimeout(()=>{
                !isCallbacked && callback && callback();
                isCallbacked = true;
            });

            img.src = `${location.origin}${statUrl}?${util.setFormUrlencoded(params)}`;
        }
    }
}
