/**
 * Created by Administrator on 2017/10/19.
 */
export class Live {
    getToken() {
        let testToken = "test";

        setTimeout(function() {
            getTokenCallback(0, "获取token成功", "test", "12")
        }, 1000)
    }

    getVersion() {
        getVersionCallback(0, "获取版本成功", "web", "c23flffl8e1vb5a85gvfda94tdxjfhby", "1.0.0", "web")
    }

    getVersionCode() {
        getVersionCodeCallback(0, 101)
    }

    getNetworkType() {
        getNetworkTypeCallback(0, 1)
    }

    clientShareContent(shareLink, title, userContent, imageURL, sharePlatform) {
        getShareContentCallback(0, 'web')
    }

    configBack() {
        configBackCallback(0, "");
    }

    closeWindow() {
        window.close();
    }

    getLanguageCode() {
        getLanguageCodeCallback(0, navigator.language);
    }

    getCountryCode() {
        getCountryCodeCallback(0, 'CN')
    }

    updateUserRelation(state, uid) {
        console.log(state, uid)
    }
    getChannel() {
        getChannelCallback(0, 'offical')
    }
    checkApiResult() {

    }
}

function checkOs() {
    var u = navigator.userAgent,
        os;

    var isPC = function() {
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
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
        os = "Android"
    }

    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        os = "iOS"
    }

    if (isPC()) {
        os = "PC"
    }

    return os;
}

if (!navigator.userAgent.match(/bigo-baiguoyuan/i)) {
    window.live = new Live();
}
