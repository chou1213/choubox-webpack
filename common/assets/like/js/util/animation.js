/**
 * Created by yuanqiujuan on 2018/7/4.
 */
export class Animation {
    constructor() {
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
}

/**
 *  EXAMPLE
 *
 *  scrollingVertical：
 *  @params: *el(作用对象)
 *  @params: data(数据)
 *  @params: scrollInter(滚动间隔时间) 需大于动画时间
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
 *  -- setInfiniteScroll --
 *  @params: el_id1(元素id)
 *  @params: el_id2(元素id)
 *  @params: gap 数据条数
 *  setInfiniteScroll(el_id1, el_id2, gap);
 *
 *  setInfiniteScroll('winner-list-other', 'winner-list-other-2', 1);
 *  <div class="winner-list-other-wrapper">
        <ul class="winner-list-other" id="winner-list-other">
            <li v-for="item in winnerList">
            </li>
        </ul>
        <ul class="winner-list-other" id="winner-list-other-2">
             <li v-for="item in winnerList">
             </li>
        </ul>
    </div>
 *
 */
