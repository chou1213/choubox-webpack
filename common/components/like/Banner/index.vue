<template>
    <div class="banner" :class="banner.style" :style="{backgroundImage: `url(${bannerUrl})`}">
        <div v-if="share.show">
            <div class="share-btn" 
                @click.stop="showSharePanel"
                v-if="!isPc && !isHideShare"
            >
                <img :src="share.icon" alt="">
                <span>{{share.btn_text}}</span>
            </div>
        </div>
        <share v-model="isShowShare"
            :shareTitle="share.title"
            :shareInfoObject="share.info"
            :sharePanelData="share.sharePanelData"
            @onClose="isShowShare = false"
            v-on:hideshare="closeShare"></share>
    </div>
</template>

<script>
import share from 'COMMON/components/like/Share'

export default {
    name: 'banner',
    components: {
        share
    },
    data() {
        return {
            isShowShare: false
        }
    },
    props: {
        countrycode: String,
        banner: Object
    },
    computed: {
        isPc() {
            return this.getUrlParams('c');
        },
        isHideShare() {
            return this.getUrlParams('h');
        },
        bannerUrl () {
            const banner = this.banner || {};
            let code = this.countrycode || 'en';
            return banner.url[code.toLocaleLowerCase()];
        },
        share () {
            return this.banner.share || {};
        },
        shareInfoObject() {
            const shareInfo = this.share.info || {};
            return {
                url: `${location.origin}${location.pathname}?c=p`,
                title: shareInfo.title,
                content: shareInfo.content,
                images: shareInfo.images
            }
        }
    },
    methods: {
        getUrlParams(name) {
            let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            let r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURIComponent(r[2]);
            } else {
                return null;
            }
        },
        showSharePanel() {
            this.isShowShare = true;
            let statHandler = this.share.stat;
            this.share.share_btn_click_pv && 
                typeof statHandler === 'function' && 
                statHandler(this.share.share_btn_click_pv);
        },
        closeShare(type) {
            this.isShowShare = false;
            let statHandler = this.share.stat;
            if (type && typeof type === 'number' && this.share.share_btn_click_pv) {
                typeof statHandler === 'function' && statHandler(this.share.share_btn_click_pv + type);
            }
        }
    }
}
</script>

<style lang='scss' scoped>
  .banner {
    min-height: 100px;
    background-size: 100% 100%;
    .share-btn {
        float: right;
        width: 180px;
        height: 54px;
        line-height: 54px;
        margin: 20px 20px 0 0;
        display: table;
        text-align: center;
        border: 1px solid #b64b50;
        div {
            display: table-cell;
            vertical-align: middle;
        }
        img {
            width: 25px;
            margin-right: 8px;
        }
        span {
            font-size: 24px;
            color: #b64b05;
        }
    }
  }
</style>
