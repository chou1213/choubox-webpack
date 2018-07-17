<template>
  <div class="circleDraw">
    <img src="../assets/img/circleAward.png" class="circleDrawBg" :style="[transformStyle,transitionStyle]">
    <img src="../assets/img/arrow.png" class="circleDrawArrow" @click="goDraw">
    <slot name="decoration"></slot>
  </div>
</template>

<script>
import eventCenter from './eventCenter.vue';
let eventMiddle = eventCenter.eventCenter;
export default {
  name: 'circleDraw',
  props: {
    drawnNumber: {// 从哪个位置开始
      default: 0
    },
    deg: { // 偏移角度
      default: 45
    },
    circle: { // 转几圈
      default: 2
    },
    rank: { // 0-1 diamond 1-firecracker 2-tinyfire 3-ring 4-gold 5-300 diamond 6-30diamond 7-10diamond
      default: 1
    },
    duration: {
      default: 2
    },
    drawType: {
      default: 0
    }
  },
  data() {
    return {
      transformStyle: {
        'transform': 'rotate(0deg)',
        '-webkit-transform': 'rotate(0deg)'
      },
      transitionStyle: {
        'transition': 'transform 0s',
        '-webkit-transition': '-webkit-transform 0s'
      },
      index: '', // 中奖的礼物Index
      circleDeg: 0,
      curIndex: 0, // 现在转盘所在礼物的index
      drawLock: true
    }
  },
  methods: {
    goDraw() {
      if (this.drawLock) {
        this.$emit('goDraw');
      }
    },
    scroll() {
      let add = 0;
      if (this.index - this.curIndex >= 0) {
        add = 360 * Number(this.circle) + Number(this.deg) * (this.index - this.curIndex);
      } else {
        add = 360 * Number(this.circle) + Number(this.deg) * (8 - (this.curIndex - this.index));
      }
      this.circleDeg += parseInt(add);
      this.transformStyle = {
        'transform': `rotate(${this.circleDeg}deg)`,
        '-webkit-transform': `rotate(${this.circleDeg}deg)`
      }
      // this.rotate = `rotate(${this.circleDeg}deg)`;
      this.transitionStyle = {
        'transition': `-webkit-transform ${this.duration}s`
      };
      this.curIndex = this.index; // 转完记录位置；
      this.drawLock = false; // 锁上状态锁
    }
  },
  mounted() {
    let that = this;
    let curDeg = Number(this.deg) * Number(this.drawnNumber);
    this.transformStyle = {
      'transform': `rotate(${curDeg}deg)`,
      '-webkit-transform': `rotate(${curDeg}deg)`
    }
    // this.rotate = `rotate(${curDeg}deg)`;
    // console.log(eventMiddle);
    eventMiddle.$on('scroll', function(data) {
      // console.log('开始转动');
      that.index = data;
      that.scroll();
    });
    var bgDiv = document.querySelector(".circleDrawBg");
    bgDiv.addEventListener("webkitTransitionEnd", function() {
      that.$emit("winningsuccess", that.index);
      that.drawLock = true; // 滚动完打开状态锁；
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.circleDraw {
  position: relative;
  width: 100%;
  height: auto;
  text-align: center;
  .circleDrawBg {
    width: 7.4rem;
    height: 7.4rem;
  }
  .circleDrawArrow {
    width: 1.8rem;
    height: 2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -0.9rem;
    margin-top: -1.2rem;
  }
}
</style>