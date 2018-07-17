<template>
    <ul class="clearfix">
        <li class="left" v-html="left"></li>
        <li class="right" v-html="right"></li>
        <li class="center" v-html="center"></li>
    </ul>
</template>

<script>
export default {
    name: 'layoutcol3',
    props: {
        left: String,
        center: String,
        right: String
    },
    methods: {

    },
    computed: {

    }
}
</script>
<style lang="scss" scoped>
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
ul {
  color: #222;
  font-size: 24px;
  li {
    &.left {
      float: left;
      width: 90px;
    }
    &.right {
      float: right;
      width: 180px;
    }
    &.center {
      margin-left: 100px;
      margin-right: 190px;
    }
  }
}

</style>
