<template>
  <div class="modal">
    <transition name="fade">
      <div class="modal modal-wrap" @touchstart="modalstart" @touchmove="modalmove" @touchend="modalend" v-show="show" @click="closeModal" v-cloak>
        <div class="modal-shade">
          <div class="modal-content" :style="{width:activeWidth,background:bgColor,border:border,borderRadius:borderRadius,padding:padding}">
            <slot name="content"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import $ from 'webpack-zepto';
export default {
  name: 'modal',
  props: ['activeWidth', 'bgColor', 'border', 'borderRadius', 'padding', 'show'],
  data() {
    return {
      touches: {}
    }
  },
  methods: {
    closeModal(e) {
      var modalWrap = document.querySelectorAll('.modal-wrap');
      // console.log(modalWrap);
      for (let i = 0; i < modalWrap.length; i++) {
        if (e.target === modalWrap[i]) {
          // console.log(e.target);
          this.$emit('closeModal');
        }
      }
    },
    modalstart(e) {
      var evts = e.touches[0];
      var target = $(evts.target);
      if (!target.length) return;
      var elScroll;
      if (target.is('.scroll')) {
        elScroll = target;
      } else if ((elScroll = target.parents('.scroll')).length === 0) {
        elScroll = null;
      }
      if (!elScroll) return;
      // console.log(elScroll);
      this.touches.elScroll = elScroll;
      this.touches.startY = evts.pageY;
      this.touches.currentTop = elScroll.scrollTop();
      //弹窗高度
      var popH = elScroll[0].offsetHeight;
        //内容高度
      var scrollH = elScroll[0].scrollHeight;
      // console.log(popH, scrollH);
      this.touches.maxScroll = scrollH - popH;
    },
    modalmove(e) {
      // console.log(this.touches.maxScroll);
      if (this.touches.maxScroll <= 0 || this.touches.maxScroll === undefined) {
        e.preventDefault();
        return;
      }
      var evts = e.touches[0];
      var elScroll = this.touches.elScroll;
      var scrollTop = elScroll.scrollTop();

      var distanceY = evts.pageY - this.touches.startY;
      // 上下边缘检测
      if (distanceY > 0 && scrollTop === 0) {
        // 往上滑，并且到头
        // 禁止滚动的默认行为
        e.preventDefault();
        return;
      }

      // 下边缘检测
      if (distanceY < 0 && (scrollTop + 1 >= this.touches.maxScroll)) {
        // 往下滑，并且到头
        // 禁止滚动的默认行为
        e.preventDefault();
        // return;
      }

    },
    modalend(e) {
      this.touches.maxScroll = 0;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.modal-open {
  position: fixed;
  width: 100%;
}

[v-cloak] {
  display: none;
}

.fade-enter-active {
  -webkit-transition: opacity .3s;
  -o-transition: opacity .3s;
  transition: opacity .3s;
}

.fade-enter {
  opacity: 0;
}

.modal-wrap {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.6);
  -webkit-tap-highlight-color: transparent;
  z-index:9999;
}

.modal-wrap:after {
  content: "";
  display: inline-block;
  height: 100%;
  width: 0;
  vertical-align: middle;
}

.modal-wrap .modal-shade {
  display: inline-block;
  vertical-align: middle;
  -webkit-overflow-scrolling: touch;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.modal-content {
  width: 690px;
  background: #351b26;
  box-sizing: border-box;
  padding: 122px 43px 67px;
  overflow: hidden;
  position: relative;
}
</style>
