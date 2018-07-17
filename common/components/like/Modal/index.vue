<template>
    <div class="modal">
        <div class="modal-mask"
             v-show="value"></div>
        <transition name="common-scale">
            <div class="modal-dialog"
                 v-show="value"
                 @click="$emit('onClose')">
                <div class="modal-content"
                     :class="[modalClass]"
                     :style="{'width': width}"
                     @click.stop>
                    <div class="modal-close"
                         @click="$emit('onClose')">
                        <slot name="modal-close"></slot>
                    </div>
                    <div class="modal-title">
                        <slot name="modal-title"></slot>
                    </div>
                    <div class="modal-body">
                        <slot name="modal-body"></slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="modal-footer"></slot>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
function fixedBody() {
  const scrollTop =
    document.body.scrollTop || document.documentElement.scrollTop
  const { left } = document.body.getBoundingClientRect()
  document.body.style.cssText += `position:fixed;top:-${scrollTop}px;left:${left}px`
}

function looseBody() {
  const body = document.body
  const top = body.style.top
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  document.body.scrollTop = document.documentElement.scrollTop = -parseInt(
    top,
    10
  )
}

export default {
  mixins: [],
  props: {
    value: {
      type: Boolean,
      require: true
    },
    width: {
      type: String,
      default: '50%'
    },
    modalClass: String
  },
  data: () => ({}),
  watch: {
    value(val) {
      document.body.style.overflow = val ? 'hidden' : 'auto'
      val ? fixedBody() : looseBody()
    }
  },
  methods: {}
}
</script>
<style lang='scss' scoped>
.modal-mask,
.modal-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  transition: all 0.3s;
}

.modal-mask {
  background-color: rgba(55, 55, 55, 0.6);
}
.modal-content {
  position: absolute;
  min-height: 20%;
  background: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.modal-close {
  cursor: pointer;
}
</style>
