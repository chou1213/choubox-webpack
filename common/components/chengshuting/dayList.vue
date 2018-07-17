<template>
  <div class="dayList" :style="{background:bg}">
    <slot name="dayList-title">
      <div class="dayList-title">
        <div class="show-wrap">{{dateList[currentDateIndex]}}</div>
        <div class="left-arrow" :class="{'nochange-left':currentDateIndex == (dateList.length-1)}" @click="change('left')"></div>
        <div class="right-arrow" :class="{'nochange-right':currentDateIndex == 0}" @click="change('right')"></div>
      </div>
    </slot>
    <div class="dayList-content">
      <ul class="rank-detail">
        <li v-for="(item,index) in rankList" v-if="index<currentLimit">
          <div class="rank-num">
            <img :src="require('../assets/img/rank'+(index+1)+'.png')" alt="rank" v-if="index<3">
            <span v-else>{{index+1}}</span>
          </div>
          <div class="rank-avatar" @click="gopage(index)">
            <img :src="item.avatar" alt="">
          </div>
          <div class="rank-name">{{item.name}}</div>
          <div class="rank-tickets">
            <i></i>
            <span>{{item.tickets}}</span>
          </div>
        </li>
        <div class="toggleBtn" :class="{less:currentLimit!=limit}" @click="toggle"></div>
      </ul>
    </div>
  </div>
</template>

<script>
import eventCenter from './eventCenter.vue';
let eventMiddle = eventCenter.eventCenter;
export default {
  name: 'dayList',
  props: {
    bg: {
      default: '#d6382f'
    },
    dateList: {
      type: Array,
      default() {
        return ['Today', '2017-09-26', '2017-09-25']
      }
    },
    limit: {
      default: 10
    },
    rankList: {
      type: Array,
      default() {
        return [
          // { 'name': 'Lizawhite1', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80000' },
          // { 'name': 'Lizawhite2', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80001' },
          // { 'name': 'Lizawhite3', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80002' },
          // { 'name': 'Lizawhite4', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80003' },
          // { 'name': 'Lizawhite5', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80004' },
          // { 'name': 'Lizawhite6', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80005' },
          // { 'name': 'Lizawhite7', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80006' },
          // { 'name': 'Lizawhite8', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80007' },
          // { 'name': 'Lizawhite9', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80008' },
          // { 'name': 'Lizawhite10', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80009' },
          // { 'name': 'Lizawhite11', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80010' },
          // { 'name': 'Lizawhite12', 'avatar': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506405468724&di=fd976c3cb38f0ca67f433d2b5675ff63&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-20%2F030827706.jpg', 'url': 'http://baidu.com', 'tickets': '80011' },
        ]
      }
    }
  },
  data() {
    return {
      currentDateIndex: 0,
      currentLimit: 0
    }
  },
  methods: {
    change(direction) {
      if (direction == 'left') {// 左翻
        if (this.currentDateIndex < this.dateList.length - 1) {
          this.currentDateIndex++;
        } else {
          return false;
        }
      } else if (direction == 'right') { // 右翻
        if (this.currentDateIndex > 0) {
          this.currentDateIndex--;
        } else {
          return false;
        }
      }
      this.$emit('currentDateIndex', this.currentDateIndex);
    },
    toggle() {
      let len = this.rankList.length;
      if (this.currentLimit != len) {//未展开
        this.currentLimit = len;
      } else {
        this.currentLimit = this.limit;
      }
    },
    gopage(index) {
      this.$emit('gopage', index);
    }
  },
  mounted() {
    this.currentDate = this.dateList[0]; // 设置初始时间为Today
    this.currentLimit = this.limit; // 设置初始limit
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
[v-cloak] {
  display: none;
}

.clearfix:after {
  content: '';
  display: block;
  clear: both;
}

.dayList {
  height: auto;
  margin-top: 5.2rem;
  .dayList-title {
    position: relative;
    .show-wrap {
      width: 4.48rem;
      height: 0.56rem;
      margin: 0 auto;
      font-size: 0.3rem;
      line-height: 0.45rem;
      color: #fff7be;
      overflow: hidden;
    }
    .left-arrow {
      width: 0;
      height: 0;
      border-top: 0.16rem solid transparent;
      border-right: 0.16rem solid #fff7be;
      border-bottom: 0.16rem solid transparent;
      position: absolute;
      top: 0.08rem;
      left: 1rem;
      -webkit-tap-highlight-color: transparent;
    }
    .right-arrow {
      width: 0;
      height: 0;
      border-top: 0.16rem solid transparent;
      border-bottom: 0.16rem solid transparent;
      border-left: 0.16rem solid #fff7be;
      position: absolute;
      top: 0.07rem;
      right: 1rem;
      -webkit-tap-highlight-color: transparent;
    }
    .nochange-left {
      border-right: 0.16rem solid #9b0f0f;
    }
    .nochange-right {
      border-left: 0.16rem solid #9b0f0f;
    }
  }
  .dayList-content {
    width: 100%;
    ul {
      margin: 0 auto;
      li {
        width: 6.64rem;
        height: 1rem;
        margin-bottom: 2px;
        background: #e1443b;
        border-radius: 0.1rem;
        display: flex;
        .rank-num {
          width: 0.9rem;
          text-align: center;
          font-size: 0.28rem;
          color: #f5cda1;
          line-height: 1rem;
          img {
            width: 0.59rem;
            height: 0.70rem;
            vertical-align: middle;
          }
        }
        .rank-avatar {
          width: 0.7rem;
          height: 0.7rem;
          margin-top: 0.12rem; // margin: auto 0;
          padding: 0.1rem;
          background: #fff;
          border: 0.04rem solid #c3c1c8;
          border-radius: 50%;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
          -webkit-tap-highlight-color: transparent;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
        .rank-name {
          width: 3.06rem;
          padding-left: 0.2rem;
          font-size: 0.26rem;
          color: #fff;
          line-height: 1rem;
          text-align: left;
        }
        .rank-tickets {
          flex: 1;
          font-size: 0.26rem;
          color: #fff;
          line-height: 1rem;
          i {
            width: 0.31rem;
            height: 0.31rem;
            display: inline-block;
            background: url("../assets/img/ticket.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            vertical-align: middle;
            margin-right: 0.05rem;
          }
          span {
            display: inline-block;
            vertical-align: middle;
          }
        }
        &:last-child {
          margin-bottom: 0.35rem;
        }
      }
      .toggleBtn {
        background: url("../assets/img/more.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 1.91rem;
        height: 0.45rem;
        margin: 0.3rem auto 0;
        -webkit-tap-highlight-color: transparent;
      }
      .less {
        background: url("../assets/img/less.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
