<template>
    <ul class="clearfix">
        <li class="tab-bar" :style="{width: li_width + '%', left: offset_left}"></li>
        <li 
            v-for="(txt, index) in tabText" 
            :key="index" 
            :style="{width: li_width + '%'}" 
            @click="changeTab(index+1)"
            v-html="txt"
        ></li>
    </ul>
</template>

<script>
export default {
    name: 'tab',
    props: {
        tabId: Number,
        tabIndex: {
            type: Number,
            default: 1
        },
        tabText: Array
    },
    methods: {
        changeTab(n) {
            // 触发父组件的tab change事件，由其决定是否可改变
            this.$emit('tabChange', this.tabId, n)
        }
    },
    computed: {
        li_width() {
            return (100 / this.tabText.length);
        },
        offset_left() {
            return (this.tabIndex - 1) * this.li_width + '%';
        }
    }
}
</script>
<style lang="scss" scoped>
ul {
  position: relative;
  color: #333;
  border-radius: 50px;
  border: 1px solid #333;
  overflow: hidden;
  text-align: center;
  li {
    position: relative;
    z-index: 10;
    display: inline-block;
    vertical-align: middle;
    &.tab-bar {
      position: absolute;
      height: 100%;
      z-index: 5;
      background-color: #2d94fd;
      transition: all 0.5s;
    }
  }
}
</style>
