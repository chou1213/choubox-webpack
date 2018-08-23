<template>
    <div class="item">
        <div :style="{'background-image':`url(${cover})`}" class="cover"></div>
        <p>{{desc}}</p>
    </div>
</template>


<script>
export default {
  props: {
    desc: {
      type: String,
      defalut: ''
    },
    cover: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>


<style lang="scss" scoped>
.item {
  background: #070707;
}
.cover {
  width: 690px;
  height: 526px;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center 0;
  background-size: 100% auto;
}
p {
  font-size: 48px;
  color: #fff;
  background-color: #2e323b;
  padding: 50px 40px;
}
</style>
