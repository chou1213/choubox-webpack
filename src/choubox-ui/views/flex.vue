<template>
    <div class="flex">
        <div class="flex__container"
            :style="style">
            <div class="flex__items"
                v-for="(item,index) in itemList"
                :key="index"
                :style="itemStyle[index]">{{index+1}}</div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        itemList: [1, 2, 3],
        style: {
            'flex-direction': 'row', //属性决定主轴(main-axis)的方向： row | row-reverse | column | column-reverse;
            'flex-wrap': 'nowrap', //如果一条轴线排不下，如何换行:nowrap | wrap | wrap-reverse;
            'justify-content': 'space-around', //定义了项目在主轴上的对齐方式。: flex-start | flex-end | center | space-between | space-around;
            'align-items': 'center'//定义项目在交叉轴上如何对齐。:stretch | flex-start | flex-end | center | baseline;
        },
        itemStyle: [{
            'background-color': '#' + Math.random().toString(16).substr(-6),
            'order': 1, //定义项目的排列顺序。数值越小，排列越靠前，默认为0。
            'align-self': 'flex-start' //允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。：//auto | flex-start | flex-end | center | baseline | stretch

        }]
    }),
    components: {

    }
}
</script>

<style lang='scss' scoped>
.flex__container {
  display: flex;
  height: 250px;
  background-color: #fff;
  @for $i from 1 through 8 {
    .flex__items:nth-child(#{$i}) {
      width: random() * 200px;
      height: 100px;
      font-size: 26px;
    }
  }
}
</style>
