<template>
    <footer class="footer-bar">
        <img src="~ASSETS/like/img/logo/logo.png" />
        <p>{{slogan}}</p>
        <button @click="openApp">{{openAppText}}</button>
    </footer>
</template>

<script>
export default {
    props: {
        slogan: {
            type: String,
            default: 'LIKE短视频-魔法视频自拍神器，5分钟让你在朋友圈当明星'
        },
        openAppText: {
            type: String,
            default: '打开应用'
        }
    },
    data() {
        return {

        }
    },
    methods: {
        openApp() {
            this.$emit('on-open-app');
        }
    },
    components: {

    }
}
</script>

<style lang='scss' scoped>
.footer-bar {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  font-size: 24px;
  padding: 20px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  min-height: 117px;
  img {
    width: 72px;
    height: 72px;
    margin-right: 10px;
  }
  p {
    flex: 1;
    align-items: flex-start;
    max-width: 100%;
    color: #999;
    margin-right: 30px;
  }
  button {
    border-radius: 10px;
    padding: 0 50px;
    border: 0;
    outline: none;
    display: table-cell;
    color: #fff;
    height: 70px;
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#ff63ef),
      to(#ce46ec)
    );
  }
}
</style>
