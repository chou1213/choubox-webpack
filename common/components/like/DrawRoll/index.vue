<template>
    <div class="draw-wrap">
        <div class="draw-view" ref="container">
            <ul>
                <li v-for="(value, index) in gifts" 
                    :key="index" 
                    :ref="'item'+index" 
                    :class="transition?'transition':''"
                    :style="{width:li_width+'%', height: li_height+'%', transform: `translateY(${-offset[index] * item_height}%)`}" 
                >
                    <div
                        class="draw-item" 
                        v-for="(item, index2) in value" 
                        :key="index2" 
                        :style="{height: item_height+'%', backgroundImage: 'url(' + item.src + ')'}"
                    >{{item.desc}}</div>
                </li>
            </ul>
        </div>
        <div class="draw-play" :class="disable?'disable':''" @click="handleDraw">{{btnText}}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            offset: [],
            transition: false,
            lock: false,
            preResult: [],
            successCallback: null
        }
    },
    props: {
        datasource: {
            type: Array
        },
        canDraw: {
            type: Boolean,
            default: false
        },
        btnText: {
            type: String
        },
        asyncGetDrawResult: {
            type: Function
        },
        repeat: {
            type: Number,
            default: 3
        }
        
    },
    mounted() {
        this.initPosition();
        let transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };
        let animateOverCount = 0;
        let that = this;
        // 监听li动画结束事件
        Object.keys(this.$refs)
            .map(key => {
                if (/^item\d$/.test(key)) {
                    let node = this.$refs[key][0];
                    let transitionEvent;

                    for (let t in transitions) {
                        if (node.style[t] !== undefined) {
                            transitionEvent = transitions[t];
                        }
                    }
                    transitionEvent && node.addEventListener(transitionEvent, function () {
                        animateOverCount++;
                        if (animateOverCount === that.datasource.length) {
                            animateOverCount = 0;
                            that.lock = false;
                            that.transition = false;
                            that.initPosition();
                            that.successCallback();
                        }
                    });
                }
            })
    },
    computed: {
        gifts() {
            return this.datasource.map(item => {
                let items = []
                for (let i = 0; i < this.repeat; i++) {
                    items = items.concat(item);
                }
                return items;
            })
        },
        round_length() {
            return (this.datasource[0] && this.datasource[0].length) || 0;
        },
        li_width() {
            return 100 / this.datasource.length;
        },
        li_height() {
            return this.round_length * this.repeat * 100;
        },
        item_height() {
            return 100 / this.round_length / this.repeat;
        },
        disable() {
            return !this.canDraw || this.lock;
        }
    },
    methods: {
        initPosition() {
            // 非首次初始化
            if (this.offset.length) {
                this.offset = this.preResult;
            } else {
                this.offset = [];
                this.datasource.map(item => {
                    let roundIndex = parseInt(Math.random() * this.round_length, 10);
                    this.offset.push(roundIndex);
                })
            }
        },
        handleDraw() {
            let that = this;
            if (that.disable) return;
            that.lock = true;
            that.asyncGetDrawResult()
                .then(function (res) {
                    // 存储抽奖成功回调
                    that.successCallback = res.callback;
                    let data = Object.assign([], that.offset);
                    that.preResult = res.data.map(v => v - 1); // 存储本次抽奖结果，用于下次抽奖初始化
                    data.map((item, index) => {
                        setTimeout(() => {
                            that.transition = true;
                            let data = Object.assign([], that.offset);
                            data[index] = (that.repeat - 1) * that.round_length + that.preResult[index];
                            that.offset = data;
                        }, index * 500);
                    })
                }).catch(err => {
                    that.lock = false;
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.draw-view {
  height: 200px;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  ul {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      float: left;
      &.transition {
        transition-duration: 5000ms;
      }
    }
  }
  .draw-item {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
}
.draw-play {
  color: #000;
  font-size: 28px;
  text-align: center;
  width: 100px;
  margin: 20px auto;
  padding: 5px 0;
  border: 1PX solid #000;
  border-radius: 5px;
  &.disable {
    color: #aaa;
    border-color: #aaa;
  }
}
</style>

