<template>
    <div class="page padding-top">
        <div class="header">
            <div class="avatar">
                <p :style="{'background-image':'url('+ avator +')'}"></p>
            </div>
            <div class="user-msg">
                <div class="username">{{username}}</div>
                <div class="grade"><img :src="item.url" v-for="(item,index) in medalIcon" :key="index" /></div>
            </div>
        </div>
        <ul class="content">
            <router-link tag="li" to="/followers">
                <div>
                    <img src="~@assets/img/ic_follower.png" class="icon64" />
                    <div class="msg">
                        <p class="title" v-text="curLang.lang002"></p>
                        <p class="desc" v-text="curLang.lang003"></p>
                    </div>
                    <div class="num">
                        <span>{{videoFans | numUnitReverse}}</span>
                        <img src="~@assets/img/ic_arrow.png" class="icon24" />
                    </div>
                </div>
            </router-link>
            <router-link tag="li" to="/likes">
                <div>
                    <img src="~@assets/img/ic_likes.png" class="icon64" />
                    <div class="msg">
                        <p class="title" v-text="curLang.lang004"></p>
                        <p class="desc" v-text="curLang.lang005"></p>
                    </div>
                    <div class="num">
                        <span>{{videoLikes | numUnitReverse}}</span>
                        <img src="~@assets/img/ic_arrow.png" class="icon24" />
                    </div>
                </div>
            </router-link>
            <router-link tag="li" to="/live">
                <div>
                    <img src="~@assets/img/ic_live.png" class="icon64" />
                    <div class="msg">
                        <p class="title" v-text="curLang.lang006"></p>
                        <p class="desc" v-text="curLang.lang007"></p>
                    </div>
                    <div class="num">
                        <span>{{liveBeans | numUnitReverse}}</span>
                        <img src="~@assets/img/ic_arrow.png" class="icon24" />
                    </div>
                </div>
            </router-link>
        </ul>
    </div>
</template>
<script>
import { paikeGrowth, useInfo } from '@/services/index'

const token = window.bigolive['token'];

console.log('index', token);
console.log(navigator.language);
console.log(navigator.languages);

export default {
    name: 'index',
    data() {
        return {
            token: token,
            curLang: window.curLang, //当前国家多语言
            avator: '',
            username: '',
            medalIcon: '',
            videoFans: '',
            videoLikes: '',
            liveBeans: ''
        };
    },
    created() {
        const that = this;

        paikeGrowth({ token: that.token }).then(function (res) {
            that.videoFans = res.data.videoFans;
            that.videoLikes = res.data.videoLikes;
            that.liveBeans = res.data.liveBeans;
        }).catch(function (err) {
            console.log(err);
        });

        useInfo({ token: that.token }).then(function (res) {
            let data = res.data;
            that.username = data.nickName;
            that.avator = data.headimg || require('@assets/img/icon-profile-default.png');
            that.medalIcon = data.medalIcon;
        })
    },
    mounted() {
    },
    methods: {

    }
};
</script>

<style lang="scss" scope>
@import "~@assets/css/main.scss";
.header {
  padding: 37px 30px 0 30px;
  margin-bottom: 60px;
  display: table;
  .avatar {
    display: table-cell;
    padding-right: 24px;
    p {
      width: 100px;
      height: 100px;
      border-radius: 50px;
      background-color: #e9e9ea;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
  }
  .user-msg {
    display: table-cell;
    vertical-align: middle;
    .username {
      @include font(28, #25252f);
    }
    .grade {
      img {
        margin-top: 12px;
        width: 36px;
        height: 36px;
        margin-right: 16px;
        border-radius: 50%;
      }
    }
  }
}

.content {
  padding: 0 30px;
  li {
    // width: 690px;
    height: 206px;

    overflow: hidden;
    margin: 0 auto 30px auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    box-sizing: border-box;
    > div {
      position: relative;
      top: 50%;
      transform: translate(0, -50%);
    }
    .icon64 {
      width: 64px;
      height: 64px;
      vertical-align: middle;
      margin: 0 24px;
    }
    .icon24 {
      width: 24px;
      height: 24px;
      vertical-align: middle;
    }
    .msg {
      width: 355px;
      display: inline-block;
      vertical-align: middle;
      .title {
        @include font(34, #ffffff, bold);
        margin-bottom: 12px;
      }
      .desc {
        @include font(26, #ffffff);
      }
    }
    .num {
      width: 200px;
      text-align: right;
      display: inline-block;
      vertical-align: middle;
      span {
        @include font(48, #ffffff, bold);
        vertical-align: middle;
      }
    }
  }
  li:nth-child(1) {
    background-image: url(~@assets/img/card1.png);
  }
  li:nth-child(2) {
    background-image: url(~@assets/img/card2.png);
  }
  li:nth-child(3) {
    background-image: url(~@assets/img/card3.png);
  }
}
</style>
