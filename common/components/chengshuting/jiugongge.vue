<template>
    <div class="lucky-draw-wrap">
        <ul class="clearfix">
            <slot name="awards"></slot>
        </ul>
    </div>
</template>
<style lang="scss">
.luck-draw-wrap {
  ul {
    overflow: hidden;
    font-size: 0;
  }
}
</style>
<script>
  import eventCenter from './eventCenter.vue'
  export default{
    data: () => ({

        lock: false,
        k: [0, 1, 2, 5, 8, 7, 6, 3],
        q: [0, 1, 2, 5, 8, 7, 6, 3],
        i: 0,
        speed: 200,
        pickIndex: '',
        lastIndex: 0

    }),
    props: ['awards'],
    mounted() {
      eventCenter.$on('draw', (index) => {
        this.draw(index)
      })
    },
    methods: {
        draw(index) {
            if (this.lock) return false;
            console.log(this.lock);
            this.scroll(index);
        },
        scroll(index) {
            if (!this.lock) { // 没有上锁的话，开始在上次中奖位置后转动
                this.i = 0; // 重置
                this.k = this.k.slice(this.k.indexOf(this.lastIndex));//从上次中奖的位置开始转。
                this.drawAnimat(index);
            }
        },
        drawAnimat(index) {
            this.lock = true;
            setTimeout(() => {
                if (this.k[this.i] === undefined) { // 长度不够,增加一整个长度
                    this.k = this.k.concat(this.q);
                }
                this.pickIndex = this.k[this.i];
                eventCenter.$emit('picIndex', this.pickIndex);
                this.speed = ((this.i + 1) / 25) * 500 <= 200 ? 200 : ((this.i + 1) / 25) * 500;//控制速度。
                if (this.i > 25) {
                        if (this.k[this.i] === index) { //匹配到抽奖礼物。
                            this.lock = false;
                            this.$emit('drawSuccess');
                            this.lastIndex = this.k[this.i];//保存当前中奖的位置。
                        }
                    }
                    if (this.lock) {
                        this.i++;
                        this.drawAnimat(index);
                    }
            }, this.speed);
        }
    }
  }
</script>
