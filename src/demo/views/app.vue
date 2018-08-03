<template>
    <div id="demo">
        <h1>demo</h1>
        <img src="@assets/img/logo.jpg" class="logo" />
        <button @click.once="request">request只触发一次</button>
        <div @click="wrap" class="wrap">
            <button @click.stop="request">request阻止冒泡</button>
        </div>
        <div @click="wrap" class="wrap">
            <button @click="request">request 冒泡了</button>
        </div>
        <div @click.capture="wrap" class="wrap">
            <button @click.stop="request">request 捕获执行</button>
        </div>
        <p>{{data}}</p>
        <div class="wrap">
            <a href="https://google.com" target="_blank">跳转链接</a>
        </div>
        <div class="wrap">
            <a href="https://google.com" @click.self.prevent target="_blank">阻止自身默认click行为</a>
        </div>
        <div class="wrap">
            <a href="https://google.com" @click.prevent="a" target="_blank">阻止自身默认click行为,触发click事件</a>
        </div>
        <div class="wrap" @click="wrap">
            <a href="https://google.com" @click.prevent="a" target="_blank">阻止自身默认click行为,,触发click事件，冒泡行为</a>
        </div>
        <div class="wrap" @click="wrap">
            <a href="https://google.com" @click.prevent.stop="a" target="_blank">阻止自身默认click行为,触发click事件，阻止冒泡行为</a>
        </div>
        <div class="wrap" @click.self="wrap">
            <a href="https://google.com" @click.prevent="a" target="_blank">阻止自身默认click行为,冒泡行为,父元素添加self修饰符不会执行click</a>
        </div>

    </div>
</template>

<script>
import { weather } from '@services'
export default {
    data() {
        return {
            data: ''
        }
    },
    methods: {
        wrap() {
            alert('wrap');
        },
        request() {
            console.log(this);

            weather({
                key: '7fe23d90453caee664bdd8483ea4443e',
                city: '440100'
            }).then((res) => {
                let data = res.lives[0];
                console.log(data)
                this.data = `${data.province}${data.city}-${data.reporttime}-${data.temperature}度-${data.weather}-${data.winddirection}风`;
            });
        },
        a() {
            alert('a标签');
        }
    },
    components: {

    }
}
</script>

<style lang='scss' scoped>
#demo {
  text-align: center;
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
  width: 250px;
}
.wrap {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  margin-bottom: 10px;
}
button {
  display: block;
  margin: 50px auto 0;
  width: 300px;
  height: 80px;
  border: 0;
  outline: none;
  background-color: beige;
}
p {
  font-size: 30px;
  color: #fff;
}
a {
  font-size: 30px;
  color: #fff;
}
</style>
