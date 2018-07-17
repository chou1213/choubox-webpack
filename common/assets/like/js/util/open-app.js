/**
 * Created by yuanqiujuan on 2018/6/25.
 */
import LikeBase from './base';
const util = new LikeBase();

export class OpenApp {
    constructor() {
    }

    openApp(dpl, oneLink, appStoreUrl) {
        if (util.checkOs() === 'Android') {
            // 微信直接去应用宝
            if (util.isWx()) {
                location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=video.like&ADTAG=mobile&android_schema=' + dpl;
                return;
            }

            location.href = dpl;

            setTimeout(function() {
                location.href = oneLink;
            }, 1000);
        } else if (util.checkOs() === 'iOS') {
            // 微信，直接去应用市场
            if (util.isWx()) {
                window.location.href = appStoreUrl;
                return;
            }
            if (util.isWeibo()) {
                util.clickShareToOther();
            }

            window.location.href = appStoreUrl;
            setTimeout(function() {
                var hostJosn = {
                    'bggray-mobile.like.video': '1',
                    'golink.like.video': '1'
                };
                var hostCurrent = window.location.hostname;

                delete hostJosn[hostCurrent];
                window.location.href = 'https://' + Object.keys(hostJosn)[0] + '/live/deeplink/app?dpl=' + encodeURIComponent(dpl);
            }, 500);
        }
    }

    clickShareToOther(type) {
        function createTips(shareType) {
            var src = (shareType === 'wb') ? '/assets/like/images/share/share-tips-cn-wb.png' : '/assets/like/images/share/share-tips-cn.png';

            util.createNode('div', {
                'class': 'like-share-tips'
            }, document.body);

            var $tipsDiv = document.querySelector('.like-share-tips'),
                $img;

            var image = new Image();
            image.src = window.location.origin + src;
            image.onload = function() {
                util.createNode('img', {
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

            util.addEvent($tipsDiv, 'click', function() {
                document.body.removeChild($tipsDiv);
                $tipsDiv.removeEventListener('click', function() {});
            });

        }

        // type 0-微信，1-QQ，2-微博
        if (util.isWx() || util.isQQ()) {
            createTips();
        } else if (util.isWeibo()) {
            createTips('wb');
        }
    }
}
