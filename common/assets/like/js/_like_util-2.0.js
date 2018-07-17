/**
 * Created by Yuanqiujuan on 2017/10/19.
 */
export class _LIKE_UTIL {
    constructor(isUseSdk) {
        this.SDK = {};
        window._HIIDO_OVERSEA_ = true; // 海度海外统计标记
        window.windowResume = function() {}; // 定义一个空的windowResume函数，防止ios调用报错
        if (isUseSdk) {
            this.fetchSDK();
        }
    }

    fetchSDK() {
        var SDK = { // android测试都通过
                getToken: ['getTokenCallback'],
                getVersion: ['getVersionCallback'],
                getVersionCode: ['getVersionCodeCallback'],
                getChannel: ['getChannelCallback'], // 测试ios没有
                getNetworkType: ['getNetworkTypeCallback'], // 测试ios没有
                clientShareContent: ['getShareContentCallback'],
                getLanguageCode: ['getLanguageCodeCallback'],
                getCountryCode: ['getCountryCodeCallback', 'getCountryCodeCallBack'], // ios回调后面那个
                configBack: ['configBackCallback'],
                closeWindow: [],
                commonFunction: [], // ios，android
                onCommonFunction: [], // 暂无测试
                goBindPhoneNo: [],
                updateUserRelation: [],
                copyToClipboard: ['copyToClipboardCallback'],
                uploadMusic: [],
                showLocalShareDialog: []
            },
            resolvedPromise = {},
            that = this;

        // 先注册SDK callback
        for (var i in SDK) {
            (function(i) {
                for (var j = 0; j < SDK[i].length; j++) {
                    if (!window[SDK[i][j]]) {
                        var args,
                            fnName = SDK[i][j];

                        window[SDK[i][j]] = function() {
                            args = Array.prototype.slice.apply(arguments);

                            setTimeout(function() {
                                if (fnName === 'configBackCallback') {
                                    if (args[0] === 0) {
                                        window.backWindow = function() {
                                            return resolvedPromise[i].apply(this, args);
                                        };
                                    }
                                } else {
                                    resolvedPromise[i].apply(this, args);
                                }
                            });
                        };
                    }
                }

                that.SDK[i] = function(params) {
                    var args = Array.prototype.slice.apply(arguments);

                    return getNativeSDK(i, args);
                };
            })(i);
        }

        function getNativeSDK(fnName, args) {
            var isFind = false,
                last,
                count = 0,
                paramsArr = [],
                tempArgs = null,
                params;

            if (typeof args[args.length - 1] === 'function') {
                last = args.pop();
            }

            if (args.length > 0) {
                if (args.length > 1) {
                    tempArgs = args;
                } else {
                    tempArgs = args[0];
                }

                for (var k = 0; k < args.length; k++) {
                    paramsArr.push('args[' + k + ']');
                }
                params = paramsArr.join(',');
            }

            if (window.webkit && window.webkit.messageHandlers && that.checkOs() === 'iOS') {
                window.webkit.messageHandlers[fnName] && window.webkit.messageHandlers[fnName].postMessage(tempArgs);
                // eval("window.webkit.messageHandlers[fnName].postMessage(" + (params || null) + ")");
                isFind = true;
            } else {
                if (window.live) {
                    runLive();
                } else {
                    var inter = setInterval(function() {
                        if (isFind || count > 20) {
                            clearInterval(inter);
                            return;
                        }

                        runLive(inter);
                        count++;
                    }, 100);
                }

                function runLive(inter) {
                    try {
                        if (args.length > 0) {
                            eval('live[fnName](' + params + ')');
                        } else {
                            eval('live[fnName]()');
                        }
                        isFind = true;

                        if (inter) {
                            clearInterval(inter);
                        }
                    } catch (e) {}
                }
            }

            resolvedPromise[fnName] = last;
        }
    }

    setAdaptive(a, callback) {
        var c,
            f = document.documentElement,
            d = a.navigator.appVersion.match(/iphone/gi) ? a.devicePixelRatio : 1,
            w;

        function b() {
            if (f.getBoundingClientRect().width) {
                w = f.getBoundingClientRect().width;
            } else {
                w = f.getBoundingClientRect().right - f.getBoundingClientRect().left;
            }

            if (a.orientation === 90 ||
                a.orientation === -90) {
                var t_w = window.screen.width,
                    t_h = window.screen.height;

                w = t_w > t_h ? t_h : t_w;
            }

            if (w === 412) {
                w = 373
            }

            a.rem = w / 10;
            f.style.fontSize = a.rem + 'px';


            if (callback) {
                callback(a.rem);
            }
        }

        this.addEvent(a, 'resize', function() {
            clearTimeout(c);
            c = setTimeout(b, 500);
        }, !1);

        this.addEvent(a, 'pageshow', function(a) {
            a.persisted && (clearTimeout(c), c = setTimeout(b, 300));
        }, !1);

        f.setAttribute('data-dpr', d);

        b();
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

    isEmojiCharacter(substring) {
        for (var i = 0; i < substring.length; i++) {
            var hs = substring.charCodeAt(i);
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        return true;
                    }
                }
            } else if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                if (ls == 0x20e3) {
                    return true;
                }
            } else {
                if (0x2100 <= hs && hs <= 0x27ff) {
                    return true;
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    return true;
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true;
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
                    hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
                    hs == 0x2b50) {
                    return true;
                }
            }
        }
    }

    getScrollProp(prop) {
        var a = 0,
            bodyScrollProp = 0,
            documentScrollProp = 0;

        if (document.body) {
            bodyScrollProp = document.body[prop];
        }

        if (document.documentElement) {
            documentScrollProp = document.documentElement[prop];
        }

        a = bodyScrollProp > documentScrollProp ? bodyScrollProp : documentScrollProp;

        return a;

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

    isInBottom(gap) {
        if (this.getScrollProp('scrollTop') + this.getWindowHeight() + (gap || 0) >= this.getScrollProp('scrollHeight')) {
            return true;
        }

        return false;
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

    hdStat(activeName) {
        try {
            hd('event', {
                eventAction: activeName
            });
        } catch (e) {
            console.log(e);
        }
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

    checkDeviceModel() {
        var ua = navigator.userAgent,
            os,
            isWinPhone = /(?:Windows Phone)/.test(ua),
            isFireFox = /(?:Firefox)/.test(ua),
            isTabvar = /(?:iPad|PlayBook)/.test(ua) || (isFireFox && /(?:Tabvar)/.test(ua)),
            isSymbian = /(?:SymbianOS)/.test(ua),
            isiPhone = /(?:iPhone)/.test(ua) && !isTabvar,
            isAndroid = /(?:Android)/.test(ua),
            isNotAndroidiOSPC = /(?:MeeGo)/.test(ua);

        os = {
            isWindowsPhone: isWinPhone,
            isSymbian: isSymbian || isWinPhone,
            isAndroid: isAndroid,
            isFireFox: isFireFox,
            isQQBrowser: /(?:MQQBrowser | QQ)/.test(ua),
            isChrome: /(?:Chrome|CriOS)/.test(ua),
            isIpad: /(?:iPad|PlayBook)/.test(ua),
            isTabvar: isTabvar,
            isSafari: /(?:Safari)/.test(ua),
            isiPhone: isiPhone,
            isOpera: /(?:Opera Mini)/.test(ua),
            isUC: /(?:UCWEB|UCBrowser)/.test(ua),
            isNotAndroidAndiOS: isNotAndroidiOSPC,
            isPc: (!isiPhone && !isAndroid && !isSymbian && !isNotAndroidiOSPC) || /(?:Windows NT)/.test(ua)
        };

        return os;
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

    is_lt_ios9() {
        var u = navigator.userAgent;

        return !u.match(/OS [5-8]_\d[_\d]* like Mac OS X/i);
    }

    createNode(tagName, attr, parent) {
        var node = document.createElement(tagName);

        for (var i in attr) {
            node.setAttribute(i, attr[i]);
        }

        parent.appendChild(node);
    }

    getLang(applang, callback) {
        var langZip = [
            ['cn', 'cn,zh,zh-hans,zh-cn,zh-hans-cn,zh-sg,zh-hans-sg'],
            ['tw', 'tw,zh-hant,zh-hk,zh-mo,zh-tw,zh-hant-hk,zh-hant-mo,zh-hant-tw'],
            ['en', 'en,en-au,en-bz,en-ca,en-cb,en-ie,en-jm,en-nz,en-ph,en-za,en-tt,en-gb,en-us,en-zw,en-sg,en-us'],
            ['th', 'th,th-th'], // 泰语
            ['vn', 'vn,vi-vn,vi,vn-vn'], // 越南
            ['ru', 'ru,ru-ru,ru-mo'], // 俄语
            ['id', 'id,id-id,in-id'], // 印尼
            ['ko', 'ko,ko-kr'], // 韩语
            ['in', 'in,hi,hi-in'], // 印度，印地语
            ['kh', 'kh'], //
            ['sg', 'sg'], // 新加坡
            ['ar', 'ar,ar-sa,ar-eg,ar-dz,ar-tn,ar-ye,ar-jo,ar-kw,ar-bh,ar-iq,ar-ly,ar-ma,ar-om,ar-sy,ar-lb,ar-ae,ar-qa,ar-il'], // 阿拉伯
            ['tr', 'tr,tr-tr'], // 土耳其
            ['es', 'es,es-ar,es-bo,es-cl,es-co,es-cr,es-do,es-ec,es-es,es-gt,es-hn,es-mx,es-ni,es-pa,es-pe,es-pr,es-py,es-sv,es-uy,es-ve,es-xl'], // 西班牙
            ['my', 'ms,ms-bn,ms-my,my'], // 马来西亚
            ['pt', 'pt,pt-pt,pt-br'], // 葡萄牙
            ['ja', 'ja,ja-jp,ja-ja,jp,jp-jp'], // 日语
            ['de', 'de,de-at,de-ch,de-de,de-li,de-lu'], // 德语
            ['fr', 'fr,fr-be,fr-ca,fr-ch,fr-fr,fr-lu,fr-mc'], // 法语
        ];

        var lang = applang ? applang.toLowerCase() : (this.getUrlParams('lang') || navigator.language || navigator.userLanguage).toLowerCase(),
            uLang = 'en',
            flag = false;

        langZip.map(function(val, index, arr) {
            if (!flag) {
                val.map(function(o, i, a) {
                    var object = o.split(',');

                    if (!flag) {
                        object.map(function(q, j, o) {
                            if (q === lang) {
                                flag = true;
                                uLang = val[0];
                            }
                        });
                    }
                });
            }
        });

        if (callback) {
            callback(uLang);
        }

        return uLang;
    }

    scrollingVertical(params) {
        var data = params.data,
            el = params.el,
            elChildren = el.children,
            html = '',
            curChild = 0,
            options = {
                transTime: 1000,
                scrollInter: 2000
            };

        if (!params.transTime) {
            params.transTime = options.transTime;
        }

        function setData() {
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    html += '<p class="menus">' + data[i] + '</p>';
                }

                el.innerHTML = html;
            }
        }

        function scroll() {
            var firstChild = elChildren[curChild],
                scrollHeight = firstChild.scrollHeight;

            if (curChild + 1 === elChildren.length) {
                curChild = -1;
            }

            setTransition(params.transTime);
            el.style['transform'] = 'translateY(' + -scrollHeight + 'px)';
            curChild++;

            setTimeout(function() {
                var first = elChildren[0];

                setTransition(0);
                el.style['transform'] = 'translateY(' + 0 + 'px)';
                el.removeChild(first);
                el.appendChild(first);
            }, 1000);
        }

        function setTransition(times) {
            el.style['-webkit-transition'] = 'transform ' + times + 'ms';
            el.style['-moz-transition'] = 'transform ' + times + 'ms';
            el.style['-o-transition'] = 'transform ' + times + 'ms';
            el.style['-ms-transition'] = 'transform ' + times + 'ms';
            el.style['transition'] = 'transform ' + times + 'ms';
        }

        setData();
        setInterval(function() {
            scroll();
        }, params.scrollInter);
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
            },
            beforeClose() {
                bodyEl.style.position = '';
                bodyEl.style.top = '';

                window.scrollTo(0, that._innerScrollPreventScrollTop);
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

    setFormUrlencoded(data) {
        var arr = [],
            strings = '';

        for (var i in data) {
            arr.push(i + '=' + data[i]);
        }

        strings = arr.join('&');

        return strings;
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

    setInfiniteScroll(el_id1, el_id2, gap) {
        var dom = document.getElementById(el_id1),
            dom2 = document.getElementById(el_id2),
            firstHeight = dom.children[0].offsetHeight,
            height = dom.offsetHeight,
            listLength = dom.children.length;

        if (listLength < gap) {
            return false;
        }

        dom.parentElement.style.height = firstHeight * gap + 'px';
        dom.parentElement.style.overflow = 'hidden';
        dom.parentElement.style.position = 'relative';
        dom.style.position = 'absolute';
        dom2.style.position = 'absolute';

        addKeyFrames(height); // 设置keyframes

        setTimeout(function() {
            dom.style['-webkit-animation'] = listLength + 's rowup-1 linear infinite normal';
            dom.style['animation'] = listLength + 's rowup-1 linear infinite normal';
            dom2.style['-webkit-animation'] = listLength + 's rowup-2 linear infinite normal';
            dom2.style['animation'] = listLength + 's rowup-2 linear infinite normal';
        }, 1000);

        function addKeyFrames(height) {
            var style = document.createElement('style'),
                keyFrames = '';

            style.type = 'text/css';
            keyFrames = '\
                @-webkit-keyframes rowup-1 {\
                    0% {\
                        -webkit-transform: translate3d(0, 0, 0); opacity: 1;\
                        transform: translate3d(0, 0, 0); opacity: 1;\
                    }\
                    50% {\
                        -webkit-transform: translate3d(0, A_DYNAMIC_VALUE, 0); opacity: 1;\
                        transform: translate3d(0, A_DYNAMIC_VALUE, 0); opacity: 1;\
                    }\
                    50.1% {\
                        -webkit-transform: translate3d(0, A_DYNAMIC_VALUE, 0); opacity: 0;\
                        transform: translate3d(0, A_DYNAMIC_VALUE, 0); opacity: 0;\
                    }\
                    50.2% {\
                        -webkit-transform: translate3d(0, ' + height + 'px, 0); opacity: 0;\
                        transform: translate3d(0, ' + height + 'px, 0); opacity: 0;\
                    }\
                    50.3% {\
                        -webkit-transform: translate3d(0, ' + height + 'px, 0); opacity: 1;\
                        transform: translate3d(0, ' + height + 'px, 0); opacity: 1;\
                    }\
                    100% {\
                        -webkit-transform: translate3d(0, 0, 0); opacity: 1;\
                        transform: translate3d(0, 0, 0); opacity: 1;\
                    }\
                }\
                @keyframes rowup-1 {\
                    0% {\
                        -webkit-transform: translate3d(0, 0, 0); opacity: 1;\
                        transform: translate3d(0, 0, 0); opacity: 1;\
                    }\
                    50% {\
                        -webkit-transform: translate3d(0, A_DYNAMIC_VALUE, 0); opacity: 1;\
                        transform: translate3d(0, A_DYNAMIC_VALUE, 0); opacity: 1;\
                    }\
                    50.1% {\
                        -webkit-transform: translate3d(0, A_DYNAMIC_VALUE, 0); opacity: 0;\
                        transform: translate3d(0, A_DYNAMIC_VALUE, 0); opacity: 0;\
                    }\
                    50.2% {\
                        -webkit-transform: translate3d(0, ' + height + 'px, 0); opacity: 0;\
                        transform: translate3d(0, ' + height + 'px, 0); opacity: 0;\
                    }\
                    50.3% {\
                        -webkit-transform: translate3d(0, ' + height + 'px, 0); opacity: 1;\
                        transform: translate3d(0, ' + height + 'px, 0); opacity: 1;\
                    }\
                    100% {\
                        -webkit-transform: translate3d(0, 0, 0); opacity: 1;\
                        transform: translate3d(0, 0, 0); opacity: 1;\
                    }\
                }\
                @-webkit-keyframes rowup-2 {\
                    0% {\
                        -webkit-transform: translate3d(0, ' + height + 'px, 0); opacity: 1;\
                        transform: translate3d(0, ' + height + 'px, 0); opacity: 1;\
                    }\
                    50% {\
                        -webkit-transform: translate3d(0, 0, 0);opacity: 1;\
                        transform: translate3d(0, 0, 0);opacity: 1;\
                    }\
                    100% {\
                        -webkit-transform: translate3d(0, ' + -height + 'px, 0); opacity: 1;\
                        transform: translate3d(0, ' + -height + 'px, 0); opacity: 1;\
                    }\
                }\
                @keyframes rowup-2 {\
                    0% {\
                        -webkit-transform: translate3d(0, ' + height + 'px, 0); opacity: 1;\
                        transform: translate3d(0, ' + height + 'px, 0); opacity: 1;\
                    }\
                    50% {\
                        -webkit-transform: translate3d(0, 0, 0);opacity: 1;\
                        transform: translate3d(0, 0, 0);opacity: 1;\
                    }\
                    100% {\
                        -webkit-transform: translate3d(0, ' + -height + 'px, 0); opacity: 1;\
                        transform: translate3d(0, ' + -height + 'px, 0); opacity: 1;\
                    }\
                }';
            style.innerHTML = keyFrames.replace(/A_DYNAMIC_VALUE/g, -height + 'px');
            document.getElementsByTagName('head')[0].appendChild(style);
        }
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

    loadJs(url, callback) {
        var script = document.createElement('script');

        script.type = 'text/javascript';
        if (typeof(callback) !== 'undefined') {
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

    shareInWXQQ(params) {
        var that = this,
            _isWx = false,
            _isQQ = false,
            data = params || {
                title: 'LIKE短视频',
                desc: '魔法视频自拍神器，5分钟让你在朋友圈当明星',
                image: '//alike.yy.com/assets/like/images/share/icon-logo.png',
                url: window.location.href
            },
            object = {
                title: data.title,
                summary: data.desc,
                pic: data.image,
                url: data.url,
                WXconfig: {}
            };

        _isWx = this.isWx();
        _isQQ = this.isQQ();

        if (!_isWx && !_isQQ) {
            return false;
        }

        this.loadJs('/assets/like/lib/shareWXQQ.js', function() {
            if (_isWx) {
                that.httpReq({
                    url: '/live/wxchat/wxjsJson?_url=' + encodeURIComponent(window.location.href),
                    success: function(res) {
                        if (res.result == 0) {
                            object.WXconfig = {
                                swapTitleInWX: true,
                                appId: res.appId,
                                timestamp: res.timestamp, // 生成签名的时间戳
                                nonceStr: res.nonceStr, // 生成签名的随机串
                                signature: res.signature,
                                debug: data.debug || false
                            };
                            setShareInfo(object);
                        }
                    }
                });
            } else {
                setShareInfo(object);
            }
        });
    }

    clickShareToOther(type) {
        var that = this;

        function createTips(shareType) {
            var src = (shareType === 'wb') ? '/assets/like/images/share/share-tips-cn-wb.png' : '/assets/like/images/share/share-tips-cn.png';

            that.createNode('div', {
                'class': 'like-share-tips'
            }, document.body);

            var $tipsDiv = document.querySelector('.like-share-tips'),
                $img;

            var image = new Image();
            image.src = window.location.origin + src;
            image.onload = function() {
                that.createNode('img', {
                    'class': 'like-share-tips-img',
                    'src': src
                }, $tipsDiv);

                $img = document.querySelector('.like-share-tips-img');
                $tipsDiv.style.position = 'fixed';
                $tipsDiv.style.background = 'rgba(0, 0, 0, .7)';
                $tipsDiv.style.top = '0';
                $tipsDiv.style.left = '0';
                $tipsDiv.style.right = '0';
                $tipsDiv.style.bottom = '0';
                $tipsDiv.style.zIndex = '99999';
                $img.style.width = '80%';
                $img.style.float = 'right';
                $img.style.marginRight = '0.416rem';
                $img.style.marginTop = '0.277rem';
            };

            that.addEvent($tipsDiv, 'click', function() {
                document.body.removeChild($tipsDiv);
                $tipsDiv.removeEventListener('click', function() {});
            });

        }

        // type 0-微信，1-QQ，2-微博
        if (this.isWx() || this.isQQ()) {
            createTips();
        } else if (this.isWeibo()) {
            createTips('wb');
        }
    }

    openApp(dpl, oneLink, appStoreUrl) {
        var that = this;
        if (that.checkOs() == 'Android') {
            // var iframeBox = document.createElement("iframe");iframe

            // 微信直接去应用宝
            if (that.isWx()) {
                location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=video.like&ADTAG=mobile&android_schema=' + dpl;
                return;
            }

            location.href = dpl || 'likevideo: //main?tab=hot';
            // try {
            //     iframeBox.setAttribute('src', dpl);
            //     iframeBox.setAttribute('style', 'display:none');
            //     document.body.appendChild(iframeBox);
            // } catch (e) {
            // }

            setTimeout(function() {
                location.href = oneLink || 'https://like.onelink.me/FvnB?pid=Share';
                // try {
                //     iframeBox && document.body.removeChild(iframeBox);
                // } catch (e) {
                // }
            }, 1000);
        } else if (that.checkOs() == 'iOS') {
            // 微信，直接去应用市场
            if (that.isWx()) {
                window.location.href = appStoreUrl || 'https://itunes.apple.com/app/id1251790681';
                return;
            }
            if (that.isWeibo()) {
                that.clickShareToOther();
            }

            window.location.href = appStoreUrl || 'https://itunes.apple.com/app/id1251790681';
            setTimeout(function() {
                // todo，客户端优化universallink只有一个golink.like.video域名
                var hostJosn = {
                    // "like.video":"1",
                    // "mobile.like.video":"1",
                    'bggray-mobile.like.video': '1',
                    // "alike.yy.com":"1",
                    // "www.like.video":"1",
                    'golink.like.video': '1'
                };
                var hostCurrent = window.location.hostname;
                delete hostJosn[hostCurrent];
                window.location.href = 'https://' + Object.keys(hostJosn)[0] + '/live/deeplink/app?dpl=' + encodeURIComponent(dpl);
            }, 500);
        }
    }

    hiveStat(isLive, param, callback) {
        var that = this,
            params = (typeof param === 'string' || !param) ? {} : param,
            statUrl = '/live/statistics/statBanner';

        if (!window.getTokenCallback && isLive) {
            this.SDK = {};
            this.fetchSDK();
            this._hiveGettingSDK = false;
            this._hiveToken = '';
            this._hiveCountryCode = '';
        }

        function getSDK(callback) {
            if (that._hiveCountryCode) {
                callback(that._hiveToken, that._hiveCountryCode);
            } else {
                that._hiveGettingSDK = true;

                that.SDK.getToken(function(code, msg, token) {
                    that.SDK.getCountryCode(function(res, country) {
                        that._hiveToken = token;
                        that._hiveCountryCode = country;
                        that._hiveGettingSDK = false;
                        callback(token, country);
                    });
                });
            }

            that.intervalGetToken(that._hiveToken);
        }

        if (!params.os) {
            params.os = that.checkOs() + '——' + navigator.userAgent;
        }
        if (param && typeof param === 'string') {
            params.btn_stat = param;
        }

        if (isLive) {
            if (that._hiveGettingSDK) {
                return false;
            }

            getSDK(function(token, country) {
                params.token = token;
                params.country_code = country;

                that.httpReq({
                    method: 'POST',
                    data: params,
                    url: statUrl,
                    success: function() {
                        if (callback) {
                            callback();
                        }
                    }
                });
            });
        } else {
            that.httpReq({
                method: 'POST',
                data: params,
                url: statUrl,
                success: function() {
                    if (callback) {
                        callback();
                    }
                }
            });
        }
    }

    intervalGetToken(_token) {
        var that = this;

        setInterval(function() {
            that.SDK.getToken(function(code, msg, token) {
                console.log(token);
                _token = token;
            });
        }, 15 * 60 * 1000);
    }

    formatDate(date) {
        let d = new Date(date);

        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    isLike() {
        return (window.live && window.live.getVersion && this.checkOs() === 'Android') ||
            (this.checkOs() === 'iOS' && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['getVersion'])
    }
}

window._like_util = _LIKE_UTIL;

/**
 *  EXAMPLE
 *
 *  scrollingVertical：
 *  @params: *el(作用对象)
 *  @params: data(数据)
 *  @params: scrollInter(滚动间隔时间)
 *  @params: transTime(滚动动画时间)
 *  滚动元素外层需要固定高度并且overflow：hidden
 *
 *  scrollingVertical({
 *       el: document.getElementById("scroll-wrapper"), //滚动容器
 *       data: ["滚动1", "滚动2", "滚动3", "滚动4"], //滚动数据内容
 *       scrollInter: 2500, //单位：ms
 *       transTime: 1000 //单位：ms
 *   })
 *
 *
 *  -- innerScrollPrevent --
 *  modal的mask position:fixed, modal-content position:absolute
 *
 */
