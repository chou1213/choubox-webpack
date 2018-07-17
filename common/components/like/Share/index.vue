<template>
    <div class="share-component">
        <div class="share-panel">
            <transition name="common-bottom2Top">
                <div class="share-panel-content" v-show="value">
                    <p class="share-panel-title">{{shareTitle || shareLang['shareTitle']}}</p>
                    <ul class="share-type-list clearfix">
                        <li v-for="(item, index) in sharePanels[panelType]" :key="index">
                            <button type="button" :class="{'copy-btn': item == 13}" :data-clipboard-text="shareInfoObject.url" @click.stop="shareTo(item)">
                                <img :src="require('ASSETS/like/img/share-icon/share_icon_'+ item +'.png')">
                            </button>
                        </li>
                    </ul>
                </div>
            </transition>
        </div>
        <p class="display-side-away" id="url-input" v-text="shareInfoObject.url"></p>
    </div>
</template>

<script>
import bigolive from 'bigoapi'
import { _LIKE_UTIL } from 'ASSETS/like/js/_like_util-2.0'

const _util = new _LIKE_UTIL();

var shareLangMap = {
    en: {
        shareTitle: 'Share to',
        copyTips: 'Link has been copied！',
        updateTips: 'Please update to new version to share'
    },
    cn: {
        shareTitle: '分享至',
        copyTips: '链接已复制，请粘贴到社交平台上分享',
        updateTips: '更新到最新版本再分享吧~'
    }
};

export default {
    props: {
        value: {
            type: Boolean,
            require: true
        },
        shareTitle: String,
        shareInfoObject: Object,
        sharePanelData: Object
    },
    data: function () {
        return {
            isDialogShow: false,
            panelType: 'en',
            dialogContent: '',
            shareLang: shareLangMap['cn'],
            sharePanels: {
                //1:Facebook 2:Twitter 3:VK 4：Instagram 5：Messenger 6: WhatsApp 7：Wechat 8：Wechat_Moment 9：QQ 10：Qzone 11：Weibo 12：Others 13：CopyLink
                cn: [7, 8, 9, 10, 11, 12, 13],
                en: [1, 2, 3, 4, 5, 6, 12, 13]
            },
            outSharePanels: {
                cn: [9, 10, 11],
                en: [1, 2, 3]
            }
        }
    },
    created: function () {
        let that = this;

        if (this.sharePanelData) {
            this.sharePanels['en'] =
                this.sharePanelData['en'] || this.sharePanels['en'];
            this.sharePanels['cn'] =
                this.sharePanelData['cn'] || this.sharePanels['cn'];
        }

        _util.getLang('', function (ulang) {
            if (ulang !== 'cn') {
                that.shareLang = shareLangMap['en'];
                that.panelType = 'en'
            } else {
                that.panelType = 'cn'
            }
        });

        bigolive.use('getCountryCode', function (code, country) {
            if (country === 'CN') {
                that.panelType = 'cn'
            }
        });
    },
    watch: {
        sharePanelData: {
            handler(val) {
                val['en'] ? this.sharePanels['en'] = val['en'] : '';
                val['cn'] ? this.sharePanels['cn'] = val['cn'] : '';

                this.setOuterShareData();
            },
            deep: true
        }
    },
    computed: {
        isLike: function () {
            return _util.isLike()
        }
    },
    mounted: function () {
        let that = this;
        let $el = document.querySelector('body>*');

        _util.addEvent($el, 'click', function (e) {
            e.stopPropagation();

            that.value && that.$emit('update:value', false);
            that.$emit('onClose')
        });

        this.$nextTick(() => {
            this.setOuterShareData();
        });
    },
    methods: {
        shareTo: function (type) {
            if (!this.isLike) {
                this.outerShareApi(type);
                this.$emit('hideshare', type);
                return false;
            }

            bigolive.use('clientShareContent', [
                this.shareInfoObject.url,
                this.shareInfoObject.title,
                this.shareInfoObject.content,
                this.shareInfoObject.images,
                type
            ], function (code, platform) {
                if (code === 0) {
                }
            }
            );

            this.$emit('hideshare', type)
        },
        outerShareApi(type) {
            const { url, title, content, images } = this.shareInfoObject;

            switch (type) {
                case 1:
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
                    break;
                case 2:
                    window.open(`https://twitter.com/intent/tweet?text=${title} - ${content}&url=${encodeURIComponent(url)}`);
                    break;
                case 3:
                    window.open(`http://vk.com/share.php?url=${encodeURIComponent(url)}`);
                    break;
                case 9:
                    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${title}&desc=${content}`);
                    break;
                case 10:
                    window.open(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${title}&desc=${content}&summary=${content}&site=${title}`);
                    break;
                case 11:
                    window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${title} - ${content}&pic=${images}`);
                    break;
                default:
                    this.tryCopy();
            }
        },
        tryCopy() {
            let $el = document.getElementById('url-input');
            let range;

            try {
                range = document.createRange();
                range.selectNode($el);
                window.getSelection().addRange(range);
                document.execCommand('copy', true);
            } catch (e) {
                console.log('不支持copy');
            }

            return document.execCommand('copy', true)
        },
        setOuterShareData() {
            if (!this.isLike) {
                this.sharePanels['en'] = this.outSharePanels['en'];
                this.sharePanels['cn'] = this.outSharePanels['cn'];
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "./index.scss";

.display-particle {
  width: 1px;
  height: 1px;
}
</style>
