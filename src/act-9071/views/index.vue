<template>
    <div id="act-9071">
        <header>
            <img src="@assets/img/head.jpg" alt="" class="src">
            <button class="icon-btn-share" @click="share" v-if="!isPc"></button>
        </header>
        <section>
            <div class="item summary" v-if="desc.lang001">{{desc.lang001}}</div>
            <div class="item video" @click="play">
                <div :style="{'background-image':'url('+ videoCover +')'}"></div>
            </div>
            <button class="icon-btn-topic join" @click="joinTopic" v-if="desc.isShowButton">Участвуй</button>
            <div class="item topic">
                <h1><p>{{desc.lang002}}</p></h1>
                <div class="notice" v-if="noticeListHtml.length > 0">
                    <!-- <div class="table-wrap">
                        <div class="table enlist">
                            <p v-for="(item,index) in noticeList" :key="index">{{noticeDesc.replace(/\$1/,item.username).replace(/\$2/,item.topic).replace(/\$3/,item.diamond)}}</p>
                        </div>
                        <div class="table enlist2">
                            <p v-for="(item,index) in noticeList" :key="index">{{noticeDesc.replace(/\$1/,item.username).replace(/\$2/,item.topic).replace(/\$3/,item.diamond)}}</p>
                        </div>
                    </div> -->
                    <base-marquee :value="noticeListHtml" :duration="duration"></base-marquee>
                </div>
                <ul class="list" v-if="startList.length > 0">
                    <li v-for="(item,index) in startList" :key="index">
                        <span class="no">{{index+1}}</span>
                        <div class="avatar">
                            <p :style="{'background-image':'url('+ item.headImg +')'}"></p>
                        </div>
                        <div class="desc">
                            <p>
                                #{{item.hashtag}}</p>
                            <p>Видео:
                                <span>{{item.totalVideoNum}}</span>
                            </p>
                        </div>
                        <button class="icon-btn-topic" @click="join(index)">Участвуй</button>
                    </li>
                </ul>
                <button :class="{'icon-btn-more':true,'more':isHideStartList,'hide':!isHideStartList}" @click="showStartList">{{ isHideStartList ? 'Развернуть' : 'Свернуть'}}</button>
            </div>
            <div class="btn-wrap">
                <button class="icon-btn-rule" @click="showRule"></button>
                <button class="icon-btn-reward" @click="showReward"></button>
            </div>
            <div class='link' @click="link" v-if="desc.isShowLink">
                <p>Список победителей #ЕгорКридЧеллендж</p><br/>
                <p>(с 30.06.18 до 09.07.18)</p>
            </div>
        </section>
        <footer>
            <p>LIKE оставляет за собой право последнего решения.</p>
            <p>Эта деятельность не имеет ничего общего с Apple Inc.</p>
        </footer>
        <transition name="fade">
            <div class="mask" v-if="isShowRule || isShowReward">
            </div>
        </transition>
        <transition name="fade">
            <div class="dialog" v-show="isShowRule">
                <div class="item rule">
                    <button class="icon-btn-close" @click="closeMask('isShowRule')"></button>
                    <h1>Правила</h1>
                    <p v-for="(item,index) in desc.lang003" :class="{'margin-bottom-55':index> 0 && index <= 5,'margin-bottom-30':index>=6 && index<7}" v-html="item" :key="item"></p>
                    <!-- <p class="margin-bottom-55">1. Каждый день первые
                        <b>2000</b> пользователей присоединившиеся к #ЕгорКридЧеллендж (
                        <b>видео от 15 Лайков</b>) получат 5 Алмазов! (Окончание 20 июля)
                    </p>
                    <p class="margin-bottom-55">2. Присоединяйся сейчас к хэштегу любимых блогеров! Под каким хэштегом наберется больше всего видео (до 20 июля), пользователи того хэштега разделят Алмазы между совой!</p>
                    <p class="margin-bottom-55">
                        <b>TOP1</b>: Разделит 400 000 Бриллиантов! </p>

                    <p class="margin-bottom-55">
                        <b>TOP2</b>: Разделит 200 000 Бриллиантов!</p>

                    <p class="margin-bottom-55">
                        <b>TOP3</b>: Разделит 100 000 Бриллиантов!</p>

                    <p class="margin-bottom-55">
                        <b>TOP4-8</b>: Разделит 100 000 Бриллиантов!</p>
                    <p class="margin-bottom-30">Все призы будут выданы в течении 30 рабочих дней</p>
                    <p class="margin-bottom-30">
                        <span>Не забудь перед публикацией видео поставить добавить хэштег #ЕгорКридЧеллендж </span>
                    </p>
                    <p>
                        <span>Каждый пользователь для поддержки хэштега блогера может снимать 8 видео в день. При обнаружении мошенничества, призы пользователя будут аннулированы! </span>
                    </p> -->
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="dialog" v-show="isShowReward">
                <div class="item">
                    <button class="icon-btn-close" @click="closeMask('isShowReward')"></button>
                    <h1>
                        {{resultDesc[resultCode].title}}
                    </h1>
                    <p class="margin-bottom-30" v-html="resultDesc[resultCode].desc" v-if="resultDesc[resultCode].desc"></p>
                    <p class="text-aligin-center">
                        <span>Мои Призы:{{myReward}}</span>
                    </p>
                </div>
            </div>
        </transition>
        <Share :value="isShareShow" :shareTitle="shareTitle" :sharePanelData="sharePanelData" :shareInfoObject="shareInfoObject" @hideshare="shareCallback"></Share>
    </div>
</template>
<script>
import bigolive from 'bigoapi'
import { _LIKE_UTIL } from 'ASSETS/like/js/_like_util-2.0'
import { getStartList, getData } from '@services';
import Share from 'COMPONENTS/like/Share/index.vue';
import BaseMarquee from 'COMPONENTS/like/baseMarquee/index.vue';
import horn from '@assets/img/icon-horn.png';
const util = new _LIKE_UTIL();

export default {
    props: {

    },
    data: () => ({
        desc: {},
        duration: 190,
        summary: 'Больше наград для #ЕгорКридЧеллендж! Каждый день первые 2000 пользователей присоединившиеся к челленджу получат Алмазы! Не упусти возможность поучаствовать с любимыми блогерами и разделить 1000000 Алмазов!',
        more: 'Еще',
        close: 'Развернуть',
        resultCode: '2',
        resultDesc: {
            '1': {
                title: 'Сожалеем, нет записей!',
                desc: 'Каждый день первые 2000 пользователей присоединившиеся к #ЕгорКридЧеллендж <span>(Надо набрать 15 Лайков)</span> получат 5 Алмазов! Призы ограничены! Сними видео сейчас!'
            },
            '2': {
                title: 'Поздравляем Вы выиграли 5 Бриллиантов'
            },
            '3': {
                title: 'Сожалеем, на сегодня Алмазов не осталось. Попробуй завтра!'
            }
        },
        myReward: 0,
        videoCover: 'http://img.like.video/asia_live/g1/M04/50/33/iwVs1FtHHxeINIjkAAFNtzzg0RIAAMXAwM70gkAAU3P269.jpg',
        isShowRule: false,
        isShowReward: false,
        isPc: util.getUrlParams('c'),
        token: '',
        isShareShow: false,
        sharePanelData: {
            cn: [1, 2, 3, 4, 5, 6, 12, 13],
            en: [1, 2, 3, 4, 5, 6, 12, 13]
        },
        shareTitle: 'Share to',
        shareInfoObject: {
            url: window.location.origin + '/live/act-2018/act-9071/index.html?c=p',
            title: '#ЕгорКридЧеллендж',
            content:
                'дж! Каждый день первые 2000 пользователей присоединившиеся к челленджу получат Алмазы! Не упусти возможность поучаствовать с любимыми блогерами и разделить 1000000 Алмазов! ',
            images: window.location.origin + '/live/act-2018/act-9071/static/img/head.jpg'
        },
        _startList: [],
        startList: [],
        isHideStartList: true, //false 展开状态，展示8条数据。true 折叠状态，展示4条数据
        noticeList: [],
        noticeDesc: '$1 Выиграл $3 Алмазов участвуя в $2!'
    }),
    created() {
        let that = this;
        util.hiveStat(false, 'act_9071_pv');
        that.getNoticeList();
        that.getDesc();
        if (that.isPc) {
            this.getStartList();
        } else {
            bigolive.start(function () {
                this.use('getToken', function () {
                    that.token = bigolive.token;
                    that.getStartList();
                });
            })
        }

    },
    watch: {
        isHideStartList(val) {
            if (val) {
                this.startList = this._startList.slice(0, 4);
            } else {
                this.startList = this._startList;
            }
        }
    },
    computed: {
        noticeListHtml() {
            let that = this;
            let arr = that.noticeList.map(item => {
                return `<img src="${horn}" />` + '<span>' + that.noticeDesc.replace(/\$1/, item.username).replace(/\$2/, item.topic).replace(/\$3/, item.diamond) + '</span>';
            })
            return arr;
        }
    },
    methods: {
        share() {
            let that = this;
            that.isShareShow = true;
        },
        shareCallback(type) {
            this.isShareShow = false;
            util.hiveStat(false, 'act_9071_share_' + type);
        },
        play() {
            console.log(this.isPc);
            if (this.isPc) {
                window.location.href = 'https://like.video/s/7Px3M2Rn7Al?c=cp&b=113530002';
            } else {
                window.location.href = 'likevideo://videodetail?postid=6572705492298173121';
            }
        },
        showRule() {
            this.isShowRule = true;
        },
        showReward() {
            let that = this;
            if (this.isPc) {
                util.openApp('likevideo://web?url=' + location.href);
            } else {
                getStartList({ token: that.token }).then(function (res) {
                    if (res.data.myAward) {
                        that.myReward = res.data.myAward;
                    }
                    switch (res.data.myAwardStatus) {
                        case 0:
                            that.resultCode = '1';
                            break;
                        case 1:
                            that.resultCode = '2';
                            break;
                        case 2:
                            that.resultCode = '3';
                            break;
                    }
                    that.isShowReward = true;
                })
            }
        },
        closeMask(key) {
            this[key] = false;
        },
        getStartList() {
            let that = this;
            getStartList({ token: that.token }).then(function (res) {
                console.log(res);
                that._startList = res.data.list;
                that.startList = res.data.list.slice(0, 4);
                if (res.data.myAward) {
                    that.myReward = res.data.myAward;
                }
                switch (res.data.myAwardStatus) {
                    case 0:
                        that.resultCode = '1';
                        break;
                    case 1:
                        that.resultCode = '2';
                        break;
                    case 2:
                        that.resultCode = '3';
                        break;
                }
            })
        },
        showStartList() {
            this.isHideStartList = !this.isHideStartList;
        },
        join(index) {
            util.hiveStat(false, 'act_9071_join_' + this._startList[index].eventID);
            if (this.isPc) {
                window.location.href = 'https://alike.yy.com/s/_event/' + this._startList[index].eventID;
            } else {
                window.location.href = 'likevideo://hashtagdetail?hashtagid=' + this._startList[index].eventID + '&hashtag=' + this._startList[index].hashtag;
            }
        },
        link() {
            const url = 'https://mobile.like.video/live/rank.html?topic=235';
            if (this.isPc) {
                util.openApp('likevideo://web?url=' + url);
            } else {
                window.location.href = url;
            }
        },
        getNoticeList() {
            let that = this;
            getData({ act_id: 'act_9071_notice' }).then(function (res) {
                console.log(res);
                that.noticeList = res.data.act_9071_notice;
            });
        },
        joinTopic() {
            util.hiveStat(false, 'act_9071_join');
            if (this.isPc) {
                window.location.href = 'https://alike.yy.com/s/_event/7OHlI2gy1aH?c=wc&b=113530002';
            } else {
                window.location.href = 'likevideo://hashtagdetail?hashtagid=6561414968125600459&hashtag=ЕгорКридЧеллендж';
            }
        },
        getDesc() {
            let that = this;
            getData({ act_id: 'act_9071_desc' }).then(function (res) {
                console.log(res);
                that.desc = res.data.act_9071_desc;
            })
        }
    },
    components: {
        Share,
        BaseMarquee
    }
}
</script>
<style lang='scss'>
@import "@assets/css/index.scss";
</style>
