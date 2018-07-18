<template>
    <div>
        <div>
            <img src="~@assets/img/1.jpg" />
            <img :src='require(`@assets/img/1.jpg`)' />
            <img :src='require(`@assets/img/head-${countryCode}.png`)' />
        </div>
        <div class="bg" @click="showMsg"></div>
        <div class="bg2"></div>
        <div class="common1"></div>
        <div class="common2"></div>
        <Share></Share>
    </div>
</template>

<style lang="scss">
@import "~@assets/css/main.scss";

.bg2 {
  width: pxToRem(200);
  height: pxToRem(100);
  background: transparent url(~@assets/img/1.jpg) no-repeat center center;
  background-size: cover;
  display: flex;
}

/* 引用公共资源*/
.common2 {
  background: transparent url(~@static/img/1009.png) no-repeat center center;
  background-size: cover;
  width: pxToRem(100);
  height: pxToRem(100);
}
</style>

<script>
import img2 from "@assets/img/1.jpg";
import Share from "COMPONENTS/share.vue";
var img1 = require("@assets/img/1.jpg");
console.log(img1);
console.log(img2);
export default {
  data() {
    return {
      countryCode: "ru"
    };
  },
  components: {
    Share
  },
  create() {},
  methods: {
    showMsg() {
      alert("lalalalalala");
    }
  }
};
</script>
