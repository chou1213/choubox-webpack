/**
 * Created by yuanqiujuan on 2018/6/25.
 */
class LikeBase {
    constructor() {
        this.name = 'baseLikeBase';
        this.init();
    }

    init() {
        window._HIIDO_OVERSEA_ = true; // 海度海外统计标记
        window.windowResume = function() {}; // 定义一个空的windowResume函数，防止ios调用报错
    }

    numUnitReverse(value, fixed) {
        var unit = '',
            temp = value;

        if (value < 1000) {
            return value;
        }

        if (value >= 1000 && value < 1000000) {
            unit = 'K';
            value = value / 1000;
        }

        if (value >= 1000000) {
            unit = 'M';
            value = value / 1000000;
        }

        if (value.toString().split('.')[0].length > 2) {
            temp = parseFloat(value.toFixed(0));
        } else if (value.toString().split('.')[0].length > 1) {
            temp = parseFloat(value.toFixed(1));
        } else {
            temp = parseFloat(value.toFixed(2));
        }

        return temp + unit;
    }

    getUrlParams(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
            r = window.location.search.substr(1).match(reg);

        if (r != null) {
            return decodeURIComponent(r[2]);
        } else {
            return null;
        }
    }

    checkOs() {
        var u = navigator.userAgent,
            os;

        var isPC = function() {
            var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
            var res = true;
            for (var v = 0; v < Agents.length; v++) {
                if (u.indexOf(Agents[v]) > 0) {
                    res = false;
                    break;
                }
            }
            return res;
        };

        if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
            os = 'Android';
        }

        if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            os = 'iOS';
        }

        if (isPC()) {
            os = 'PC';
        }

        return os;
    }

    innerScrollPrevent() {
        var that = this;
        let bodyEl = document.body;
        let top = 0;

        return {
            afterOpen() {
                top = window.scrollY;
                that._innerScrollPreventScrollTop = top;

                bodyEl.style.position = 'fixed';
                bodyEl.style.top = -top + 'px';
                bodyEl.style.left = document.body.getBoundingClientRect().left + 'px';
            },
            beforeClose() {
                bodyEl.style.position = '';
                bodyEl.style.top = '';
                bodyEl.style.left = '';

                document.body.scrollTop = document.documentElement.scrollTop = that._innerScrollPreventScrollTop;
                // window.scrollTo(0, that._innerScrollPreventScrollTop);
            }
        };
    }

    changeDomTitle(title) {
        // 利用iframe的onload事件刷新页面
        document.title = title;

        var iframe = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.style.width = '1px';
        iframe.style.height = '1px';

        iframe.onload = function() {
            setTimeout(function() {
                document.body.removeChild(iframe);
            }, 0);
        };
        document.body.appendChild(iframe);
    }

    isOlderVersion(version, newVer) { // version-当前版本，newVer-比较版本
        let curVersion = version.split('.'),
            isOld = false,
            newVersion = newVer.split('.');

        for (let i = 0; i < curVersion.length; i++) {
            if (parseInt(curVersion[i]) < parseInt(newVersion[i])) {
                isOld = true;
                break;
            }
        }

        return isOld;
    }

    loadJs(url, callback) {
        var script = document.createElement('script');

        script.type = 'text/javascript';
        if (typeof (callback) !== 'undefined') {
            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        script.onreadystatechange = null;
                        callback();
                    }
                };

            } else {
                script.onload = function() {
                    callback();
                };
            }
        }
        script.src = url;
        document.body.appendChild(script);
    }

    isWx() {
        var ua = navigator.userAgent.toLocaleLowerCase();

        return ua.match(/MicroMessenger/i) == 'micromessenger';
    }

    isQQ() {
        var ua = navigator.userAgent.toLocaleLowerCase();

        return ua.match(/QQ/i) == 'qq';
    }

    isWeibo() {
        var ua = navigator.userAgent.toLocaleLowerCase();

        return ua.match(/WeiBo/i) == 'weibo';
    }

    preLoadImages(data) {
        if (data instanceof Array) {
            data.map((o, i, arr) => {
                ((o) => {
                    this.preLoadImages(o);
                })(o);
            });
        } else if (data.hasOwnProperty('src')) {
            let img = new Image();
            img.src = data.src;
        } else if (typeof data === 'string') {
            let img = new Image();
            img.src = data;
        }
    }

    addEvent(dom, eventType, callback) {
        if (dom.addEventListener) {
            dom.addEventListener(eventType, callback);
        } else if (dom.attachEvent) {
            dom.attachEvent('on' + eventType, callback);
        } else {
            dom['on' + eventType] = callback;
        }
    }

    getWindowHeight() {
        var windowHeight = 0;

        if (document.compatMode === 'CSS1Compat') {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }

        return windowHeight;
    }

    formatDate(date) {
        let d = new Date(date);

        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    setFormUrlencoded(object) {
        let formData = [];

        for (const o in object) {
            formData.push(`${o}=${object[o]}`)
        }

        return formData.join('&')
    }

    httpReq(params) {
        var xmlHttp,
            data = this.setFormUrlencoded(params.data),
            method = params.method || 'GET',
            url = (method === 'GET' && data ? (params.url + '?' + data) : params.url),
            async = params.async || true;

        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        }

        if (xmlHttp) {
            xmlHttp.onreadystatechange = stateChange;
            xmlHttp.open(method, url, async);
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xmlHttp.send(data);
        } else {
            alert('Your browser does not support XMLHTTP.');
        }

        function stateChange() {
            if (xmlHttp.readyState === 4) {
                switch (xmlHttp.status) {
                    case 200:
                        var data = typeof xmlHttp.responseText === 'string' ? JSON.parse(xmlHttp.responseText) : '';

                        if (params.success) {
                            params.success(data, xmlHttp);
                        }
                        break;
                    case 404:
                    case 0:
                        if (params.error) {
                            params.error(xmlHttp.statusText, xmlHttp);
                        }
                        break;
                }
            }
        }
    }

    isLike() {
        return (window.live && window.live.getVersion && this.checkOs() === 'Android') ||
            (this.checkOs() === 'iOS' && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['getVersion'])
    }

    replaceTextFormat(text, valueObj) {
        let t = text;

        for (let key in valueObj) {
            t = t.replace('${' + key + '}', valueObj[key])
        }

        return t
    }
}

export default LikeBase;
