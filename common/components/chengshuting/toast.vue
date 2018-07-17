<template>
  <div class="modal">
    <transition name="fade">
      <div class="modal modal-wrap" v-show="show" v-cloak>
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
import eventCenter from './eventCenter.vue';

export default {
  name: 'toast',
  props: ['activeWidth', 'bgColor', 'border', 'border-radius', 'padding', 'show'],
  data() {
    return {
    }
  },
  methods: {
    closeModal() {
      var timer = null
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.$emit('closeToast');
      }, 2000);
    }
  },
  mounted() {
    eventCenter.$on('closeToast', (data) => {
      this.closeModal();
    });
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
  // background-color: rgba(0, 0, 0, 0.6);
  -webkit-tap-highlight-color: transparent;
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
  width: 6.9rem;
  background: #351b26;
  box-sizing: border-box;
  padding: 1.22rem .43rem .67rem;
  overflow: hidden;
  position: relative;
}
</style>
