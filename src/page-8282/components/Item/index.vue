<template>
    <div class="item">
        <p class="title">{{title}}</p>
        <ul>
            <li v-for="(item, index) in list" :key="index">
                <div>
                    <section>
                        <p>
                            <span class="number">{{index + 1}}</span>
                            <span class="text" v-html="getHtml(item.mainText)"></span>
                        </p>
                        <p>{{item.secondText}}</p>
                    </section>
                    <div>
                        <img :src="require(`@assets/img/${item.imgName}.png`)">
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { mainTextMap } from '@constant/maps'

export default {
  props: {
    title: {
      type: String,
      require: true
    },
    list: {
      type: Array,
      require: true
    },
    lang: {
      type: String
    }
  },
  data: () => ({}),
  mounted() {

  },
  methods: {
    getHtml(value) {
      return /^<span(.|\n)*<\/span>$/g.test(value)
        ? this.changeHtml(value)
        : value
    },
    changeHtml(value) {
      const list = mainTextMap[this.lang]
      list.forEach(
        item =>
          (value = value.replace(
            item,
            `<span class="mainColor">${item}</span>`
          ))
      )
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@assets/css/mixin.scss";
.item {
  text-align: center;
  .title {
    color: $secondColor;
    font-size: 32px;
    position: relative;
    padding: 0 87px;
    margin: 0 42px 44px;
    display: inline-block;
    font-weight: bold;
    &:before {
      content: "";
      display: inline-block;
      position: absolute;
      width: 69px;
      height: 30px;
      left: 0;
      top: 50%;
      transform: translate(0, -60%);
      @include bg-style("~@assets/img/star_icon_left.png");
    }
    &:after {
      content: "";
      display: inline-block;
      position: absolute;
      width: 69px;
      height: 30px;
      right: 0;
      top: 50%;
      transform: translate(0, -60%);
      @include bg-style("~@assets/img/star_icon_right.png");
    }
  }
  ul {
    padding: 0 42px;
    li {
      display: table;
      margin-bottom: 40px;
      font-size: 28px;
      min-height: 100px;
      width: 100%;
      div {
        display: table-cell;
        vertical-align: middle;
      }
      section {
        color: $mainColor;
        text-align: left;
        padding: 0 30px 0 70px;
        letter-spacing: 1px;
        line-height: 38px;
        display: table-cell;
        vertical-align: middle;
        width: 100%;
        p {
          &:first-child {
            position: relative;
            .number {
              position: absolute;
              display: inline-block;
              width: 40px;
              height: 40px;
              background: $mainColor;
              color: $bgColor;
              border-radius: 40px;
              line-height: 40px;
              text-align: center;
              font-weight: bold;
              left: -70px;
              top: 0;
            }
          }
          &:last-child {
            color: #fff;
            font-size: 26px;
            padding-right: 50px;
            letter-spacing: 0;
            margin-top: 6px;
          }
        }
      }
      img {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
