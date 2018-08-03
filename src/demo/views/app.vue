<template>
    <div id="demo">
        <h1>demo</h1>
        <img src="@assets/img/logo.jpg" class="logo" />
        <button @click="request">request</button>
        <p>{{data}}</p>
    </div>
</template>

<script>
import { weather } from "@services";
export default {
  data() {
    return {
      data: ""
    };
  },
  methods: {
    request() {
      console.log(this);

      weather({
        key: "7fe23d90453caee664bdd8483ea4443e",
        city: "440100"
      }).then(res => {
        let data = res.lives[0];
        console.log(data);
        this.data = `${data.province}${data.city}-${data.reporttime}-${
          data.temperature
        }度-${data.weather}-${data.winddirection}风`;
      });
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
#demo {
  width: 100%;
  height: 100%;
  background: transparent url(~@assets/img/bg.jpg) no-repeat center center;
  background-size: cover;
}
h1 {
  text-align: center;
  margin: 0 auto 50px auto;
  color: #fff;
}
.logo {
  display: block;
  margin: 0 auto;
}
button {
  display: block;
  margin: 50px auto 0;
  width: 200px;
  height: 80px;
  border: 0;
  outline: none;
  border-radius: 50px;
}
p {
  font-size: 30px;
  color: #fff;
}
</style>
