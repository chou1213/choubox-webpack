<style lang="scss">
.components-date {
  .date {
    background: rgba(0, 17, 61, 0.08);
    text-align: center;
    height: 80px;
    line-height: 80px;
    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }
    span {
      font-size: 30px;
      color: #fff;
      vertical-align: middle;
      margin: 0 12px;
      display: inline-block;
      min-width: 165px;
    }
  }
  .data {
    height: 577px;
    box-sizing: border-box;
    overflow: hidden;
    padding-top: 50px;
    .num {
      font-size: 54px;
      color: #fff;
      font-weight: bold;
      text-align: center;
      margin-bottom: 4px;
    }
    .desc {
      font-size: 28px;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      margin-bottom: 62px;
    }
  }

  .chart {
    height: 280px;
    position: relative;
    > .line {
      position: absolute;
      width: 651px;
      height: 2px;
      border-top: 3px dashed rgba(255, 255, 255, 0.6);
      left: 11%;
      span {
        font-size: 22px;
        color: rgba(255, 255, 255, 0.6);
        position: absolute;
        right: 660px;
        top: -15px;
      }
    }
    > .line:nth-child(1) {
      top: 0;
    }
    > .line:nth-child(2) {
      top: 50%;
    }
    ul {
      height: 100%;
      padding-left: 88px;
      box-sizing: border-box;
      vertical-align: text-bottom;
      position: relative;
    }
    li {
      width: 26px;
      height: 100%;
      border-radius: 100px;
      background-color: transparent;
      display: inline-block;
      margin: 0 33px;
      position: relative;
      bottom: 0;
      > div {
        width: 100%;
        height: 1px;
        border-radius: 8px;
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: #fff;
        &.ani {
          transition: all 250ms linear;
        }
      }
      span {
        position: absolute;
        bottom: -44px;
        left: -10px;
        font-size: 22px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}
</style>

<template>
    <div class="components-date">
        <div class="date">
            <img src="~@assets/img/ic_arrow_left.png" @click.stop="prev" />
            <span v-text="date"></span>
            <img src="~@assets/img/ic_arrow_right.png" @click.stop="next" />
        </div>
        <div class="data">
            <div class="num">{{increaseNum | numUnitReverse}}</div>
            <div class="desc" v-text="desc"></div>
            <div class="chart">
                <div class="line">
                    <span>{{maxNum_c | _numUnitReverse}}</span>
                </div>
                <div class="line">
                    <span>{{calHalfNum(maxNum_c) | _numUnitReverse}}</span>
                </div>
                <ul>
                    <li v-for="(item,index) in dailyDataList_c" :key="index">
                        <div :style="{'height':numToPercentage(item.num)}" class="ani"></div>
                        <span v-text="item.day"></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'charts',
    props: ['date', 'increaseNum', 'desc', 'maxNum', 'dailyDataList'],
    data() {
        return {
            maxNum_c: 0,
            dailyDataList_c: [
                { num: 0 },
                { num: 0 },
                { num: 0 },
                { num: 0 },
                { num: 0 },
                { num: 0 },
                { num: 0 }
            ]
        };
    },
    created() {

    },
    watch: {
        dailyDataList(val) {
            this.dailyDataList_c = this.dailyDataList;
        },
        maxNum(val) {
            if (val > 1000 && val < 10000) {
                this.maxNum_c = Math.ceil(val / 1000) * 1000;
            } else if (val > 10000 && val < 100000) {
                this.maxNum_c = Math.ceil(val / 10000) * 10000;
            } else if (val > 1000000 && val < 10000000) {
                this.maxNum_c = Math.ceil(val / 1000000) * 1000000;
            } else {
                this.maxNum_c = val;
            }
        }
    },
    methods: {
        prev() {
            this.$emit('prev');
        },
        next() {
            this.$emit('next');
        },
        /**
         * 数值转百分比
         */
        numToPercentage(num) {
            let _num = Number(num);
            if (_num <= 0) {
                return '1px';
            }
            return (_num / this.maxNum_c) * 100 + '%';
        },
        /**
         * 根据最大值计算纵轴数指
         */
        calHalfNum(num) {
            return num / 2;
        }
    },
    filters: {

        _numUnitReverse(value, fixed) {
            let unit = '';
            let temp = value;

            if (value < 1000) {
                return value;
            }

            if (value >= 1000 && value < 1000000) {
                unit = 'K';
                value = value / 1000;
            }

            if (value >= 1000000) {
                unit = 'M';
                value = value / 1000000;
            }


            if (value.toString().split('.')[0].length > 2) {
                temp = parseFloat(value.toFixed(0));
            } else if (value.toString().split('.')[0].length > 1) {
                temp = parseFloat(value.toFixed(1));
            } else {
                temp = parseFloat(value.toFixed(2));
            }

            return temp + unit;
        }

    }
};
</script>
