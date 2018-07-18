<template>
    <div id="page-8282-guidePage">
        <header>
            <p>{{curLang.lang029}}</p>
            <p>{{curLang.lang030}}</p>
            <span>{{curLang.lang031}}</span>
        </header>
        <item :title="curLang.lang032" :list="list1"></item>
        <div class="middle" ref="middleEl"></div>
        <item class="item-bg" :title="curLang.lang037" :list="list2" lang="en"></item>
        <footer>
            <p>{{curLang.lang043}}</p>
        </footer>
    </div>
</template>
<script>
import Item from '@components/Item'

export default {
    name: 'guidePage',
    props: {},
    components: {
        Item
    },
    data: () => ({
        curLang: window.curLang,
        list1: [
            {
                mainText: window.curLang.lang033,
                imgName: 'icon01'
            },
            {
                mainText: window.curLang.lang034,
                imgName: 'icon02'
            },
            {
                mainText: window.curLang.lang035,
                secondText: window.curLang.lang036,
                imgName: 'icon03'
            }
        ],
        list2: [
            {
                mainText:
                    `<span class="whiteColor">${window.curLang.lang038}</span>`,
                imgName: 'icon04'
            },
            {
                mainText:
                    `<span class="whiteColor">${window.curLang.lang039}</span>`,
                imgName: 'icon05'
            },
            {
                mainText:
                    `<span class="whiteColor">${window.curLang.lang040}</span>`,
                imgName: 'icon06'
            },
            {
                mainText: `<span class="whiteColor">${window.curLang.lang041}</span>`,
                imgName: 'icon07'
            },
            {
                mainText: `<span class="whiteColor">${window.curLang.lang042}</span>`,
                imgName: 'icon08'
            }
        ]
    }),
    mounted() {
        // window.addEventListener('resize', this.handleReload, false)
        // this.setBodyWidth()
    },
    beforeDestroy() {
        // window.removeEventListener('resize', this.handleReload, false)
    },
    watch: {},
    methods: {
        setBodyWidth() {
            if (!this.$refs.middleEl) return
            const scale = 15.31
            const winWidth = window.innerWidth
            const elHeight = this.$refs.middleEl.offsetHeight
            const curWidth = ~~(scale * elHeight)
            if (curWidth < winWidth) {
                document.querySelector('body').style.width = `${curWidth}px`
            }
        },
        handleReload() {
            window.location.reload()
        }
    }
}
</script>
<style lang='scss'>
@import "~@assets/css/mixin.scss";
#page-8282-guidePage {
  background-color: #2d1776;
  header {
    height: 639px;
    @include bg-style("~@assets/img/title_bg.png");
    padding: 44px 0;
    text-align: center;
    margin-bottom: 80px;
    p {
      font-size: 50px;
      color: $mainColor;
      font-weight: bold;
      line-height: 60px;
    }
    span {
      display: inline-block;
      margin-top: 20px;
      font-size: 28px;
    }
  }
  .middle {
    // height: 49px;
    // width: 750px;
    height: 49px;
    overflow: hidden;
    position: relative;
    @include bg-style("~@assets/img/middle_bg.png");
  }
  .item-bg {
    padding-top: 63px;
    background: #3a1f91;
    padding-bottom: 10px;
    margin: -10px 0;
  }
  footer {
    height: 304px;
    @include bg-style("~@assets/img/footer_bg.png");
    position: relative;
    padding: 110px 140px 0;
    p {
      line-height: 42px;
      font-weight: bold;
      font-size: 32px;
      text-align: center;
    }
  }
}
b {
  font-weight: normal;
  color: $mainColor;
}
</style>
