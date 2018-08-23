<template>
    <div id="app">
        <p class="title">多德网络科技</p>
        <ul>
            <li v-for="(item,index) in dataList" :key="index">
                <item :cover="item.Pic" :desc="item.Tname" @click.native='jump(index)'></item>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
@import "@assets/css/main.scss";
</style>

<script>
import { getData } from '@services';
import Item from '@components/Item';
export default {
  data() {
    return {
      pages: 1,
      pagesize: 10,
      dataList: [],
      wrap: {},
      container: {},
      viewportHeight: document.body.clientHeight,
      scrollTop: document.documentElement.scrollTop,
      pageHeight: document.documentElement.clientHeight
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    let that = this;
    this.wrap = document.documentElement.clientHeight;
    this.container = document.body.clientHeight;
    document.addEventListener('scroll', that.scroll, false);
  },
  methods: {
    getData() {
      let that = this;
      document.removeEventListener('scroll', that.scroll, false);
      getData({
        action: 'get_list',
        pages: that.pages,
        pagesize: that.pagesize
      }).then(res => {
        if (res.length !== 0) {
          document.addEventListener('scroll', that.scroll, false);
          this.pages = this.pages + 1;
          this.dataList = this.dataList.concat(res);
        }
      });
    },
    scroll() {
      console.log(document.documentElement.clientHeight);
      console.log(document.body.clientHeight);
      if (this.viewportHeight - this.pageHeight - this.scrollTop < 50) {
        this.getData();
      }
    },
    jump(index) {
      window.location.href = this.dataList[index].LinkUrl;
    }
  },
  components: {
    Item
  }
};
</script>
