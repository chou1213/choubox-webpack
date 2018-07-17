<template>
    <ul>
        <li 
            v-for="(item, index) in datasource" 
            :class="roundIndex===index+1?'active':''"
            :key="index">
            <img :src="item.src" />
            <p>{{item.name}}</p>
        </li>
        <li class="draw-btn" :class="lock?'disable':''" @click="play">{{drawText}}</li>
    </ul>
</template>

<script>
export default {
    data() {
        return {
           playstatus: false,
           roundIndex: 0,
           callback: null,
           totalStep: 0
        }
    },
    props: {
        enable: Boolean,
        datasource: Array,
        handleDraw: Function,
        drawText: String,
        round: {
            type: Number,
            default: 4 // 转动圈数
        }
    },
    mounted() {
       
    },
    computed: {
        lock() {
            return !this.enable || this.playstatus;
        },
        round_length() {
            return this.datasource.length;
        }
    },
    methods: {
        rotate(step) {
            if (step > 0) {
                step--;
                this.roundIndex = this.roundIndex < this.round_length ? this.roundIndex + 1 : 1;
                let duration = (this.totalStep - step) * 15;
                setTimeout(() => {
                    this.rotate(step);
                }, duration)
            } else {
                this.playstatus = false;
                typeof this.callback === 'function' && this.callback();
            }
        },
        reset() {
            this.playstatus = true;
            this.roundIndex = 0;
        },
        play() {
            if (this.lock) return;
            this.reset();
            let that = this;
            // 处理抽奖异步请求
            this.handleDraw()
                .then(function(res) {
                    that.callback = res.callback;
                    let id = res.data; // 结果id
                    // 计算转动步数
                    let offset = that.datasource.indexOf(that.datasource.find(v => v.id === id)) + 1;
                    let step = (that.round - 1) * that.round_length + offset;
                    that.totalStep = step;
                    that.rotate(step);
                })
        }
    }
}
</script>
