/**
 * Created by yuanqiujuan on 2018/6/25.
 */
import LikeBase from './base';
const util = new LikeBase();

export class SocialShare {
    constructor() {
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

        _isWx = util.isWx();
        _isQQ = util.isQQ();

        if (!_isWx && !_isQQ) {
            return false;
        }

        util.loadJs('/assets/like/lib/shareWXQQ.js', function() {
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
}
