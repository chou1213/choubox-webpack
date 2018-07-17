<template>
    <transition name="scale-to-small">
        <div class="tips-dialog" v-if="show">
            <P class="tips-content" v-text="value"></P>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'index',
        props: {
            show: Boolean,
            value: String
        },
        watch: {
            show(val) {
                if (val) {
                    setTimeout(() => {
                        this.$emit('update:show', false)
                    }, 2000);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~ASSETS/like/css/_vtransition.scss";
    @import "./index.scss";
</style>
