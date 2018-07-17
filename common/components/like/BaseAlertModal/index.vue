<template>
    <transition name="fade">
        <div class="modal modal-mask" v-show="value" @click.self="closeModal">
            <transition :name="transition || 'scale-to-big'">
                <div class="modal-dialog" v-show="value">
                    <div class="modal-content">
                        <div class="modal-title">
                            <slot name="modal-title"></slot>
                            <div class="modal-close" @click.stop="closeModal">
                                <slot name="modal-close">
                                    <button type="button" class="btn btn-close">
                                        <i class="iconfont icon-close"></i>
                                    </button>
                                </slot>
                            </div>
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
    </transition>
</template>

<script>
    import { likeBase } from 'ASSETS/like/js/util/index'

    export default {
        name: "alertModal",
        props: {
            value: Boolean,
            transition: String
        },
        watch: {
            value(val, old) {
                if (val) {
                    likeBase.innerScrollPrevent().afterOpen()
                } else {
                    likeBase.innerScrollPrevent().beforeClose()
                }
            }
        },
        methods: {
            closeModal (){
                likeBase.innerScrollPrevent().beforeClose();
                this.$emit("update:value", false);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~ASSETS/like/css/_vtransition.scss";
    @import "./index.scss";
</style>
