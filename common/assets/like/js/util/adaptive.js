/**
 * Created by yuanqiujuan on 2018/6/25.
 */
class Adaptive {
    constructor() {}

    addEvent(dom, eventType, callback) {
        if (dom.addEventListener) {
            dom.addEventListener(eventType, callback);
        } else if (dom.attachEvent) {
            dom.attachEvent('on' + eventType, callback);
        } else {
            dom['on' + eventType] = callback;
        }
    }

    setAdaptive(a, callback) {
        var a = a || window,
            c,
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

            if(w === 412){
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
}

export default Adaptive;
