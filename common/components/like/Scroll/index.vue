<template>
    <div class="scroll-wrapper" ref="wrapper" :style="{height:height}">
        <div class="scroll-container" ref="container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        distanceBottom: {
            type: Number,
            default: 50
        },
        height: {
            type: String,
            default: '100%'
        },
        contentLength: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            wrapper: null,
            container: null
        }
    },
    created() {

    },
    mounted() {
        let that = this;
        that.wrapper = that.$refs.wrapper;
        that.container = that.$refs.container;
        that.wrapper.addEventListener('scroll', that.scroll);
    },
    watch: {
        contentLength() {
            this.wrapper.addEventListener('scroll', this.scroll);
        }
    },
    methods: {
        scroll() {
            let that = this;
            let scrollTop = that.wrapper.scrollTop;
            console.log(that.container.clientHeight, that.wrapper.clientHeight, scrollTop);
            if (that.container.clientHeight - that.wrapper.clientHeight - scrollTop < that.distanceBottom) {
                // 触发加载数据
                that.wrapper.removeEventListener('scroll', that.scroll);
                that.$emit('on-reach-bottom');
            }
        }
    },
    components: {

    }
}
</script>

<style lang='scss' scope>
.scroll-wrapper {
  height: 375px;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
</style>
