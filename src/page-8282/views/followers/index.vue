<template>
    <div class="page">
        <!--条形图-->
        <div class="chart-wrap background-blue padding-top">
            <chart :date='chartData.date' :increaseNum='chartData.increaseNum' :desc='chartData.desc' :maxNum='chartData.maxNum' :dailyDataList='chartData.dailyDataList' @prev='prev' @next='next'></chart>
        </div>
        <ul class="list">
            <li>
                <div>
                    <div class="msg">
                        <p class="title" v-text="curLang.lang011"></p>
                        <p class="desc" v-text="curLang.lang012"></p>
                    </div>
                    <div class="num">
                        <span>{{yesterdayFollowersIncreased | numUnitReverse }}</span>
                    </div>
                </div>
            </li>
            <li>
                <div>
                    <div class="msg">
                        <p class="title">{{curLang.lang013}}</p>
                        <p class="title">{{timestamp | getPrev7Day}}</p>
                        <p class="desc">{{ curLang.lang012 }}</p>
                    </div>
                    <div class="num">
                        <span>{{comparedWith | numUnitReverse }}</span>
                    </div>
                </div>
            </li>
        </ul>
        <p v-if="comparedWith <= 0">
            <span class="" v-text="curLang.lang014"></span>
            <span> &nbsp; </span>
            <router-link tag="a" to="/guidepage" v-text="curLang.lang015"></router-link>
        </p>
    </div>
</template>
<script>
import { format } from '@assets/js/date';
import { last7dayIncome } from '@/services/index';

export default {
    name: 'followers',
    data() {
        return {
            token: window.bigolive.token,
            curLang: window.curLang, //当前国家多语言
            chartData: {
                'date': '', //柱状图数据开始日期和结束日期
                'desc': '', //柱状图描述
                'increaseNum': 0, //7天的增长数
                'maxNum': 0, //7天增长最大值
                'dailyDataList': []//每天增长数据
            },
            yesterdayFollowersIncreased: 0, //昨日增长数
            comparedWith: 0, // 同比上一周的增长数
            currenTimestamp: '', //当前时间戳
            timestamp: '' //计算前7天的时间戳
        };
    },
    created() {
        this.chartData['desc'] = this.curLang.lang012;
        this.currenTimestamp = new Date().getTime();
        this.timestamp = this.currenTimestamp;
        //获取当天起前7天数据
        this.getChartData(new Date());
    },
    mounted() {

    },
    methods: {
        /**
         * 获取前7天数据
         * timestamp 时间戳，前7天数据的临界时间
         */
        getChartData(timestamp) {
            const that = this;
            let key = format('yyyy-MM-dd', new Date(timestamp));
            last7dayIncome({ token: that.token, day_before: key }).then(that.getChartDataCallBack).catch(function (err) {
                console.log(err);
            });
        },
        getChartDataCallBack(res) {
            const that = this;
            let data = res.data;
            let dayArr = this.get7Day(that.timestamp); //获取前七天的日期数组
            let _arr = [];
            let _maxNum = 0;

            //console.log(data);
            that.chartData['date'] = dayArr[0].formatFullDay + ' - ' + dayArr[6].formatFullDay;
            that.chartData['increaseNum'] = data.totalVideoFans;
            dayArr.forEach(function (element, index) {
                let _num = data[element.day].videoFans;
                _arr.push({ day: element.formatDay, num: _num || 0, compareWith: data[element.day].videoCompareFans })
            });
            _maxNum = Math.max.apply(null, _arr.map(function (o) { return o.num }));
            _maxNum = _maxNum > 0 ? _maxNum : 1;
            that.chartData['maxNum'] = Math.ceil(_maxNum / 10) * 10;
            that.chartData['dailyDataList'] = _arr;
            that.yesterdayFollowersIncreased = that.chartData['dailyDataList'][6].num;
            that.comparedWith = that.chartData['dailyDataList'][6].compareWith;
        },
        prev() {
            const prev7DayTimestamp = this.timestamp - 7 * 86400000;
            if (prev7DayTimestamp < 1514736000000) {
                //不获取2018-01-01: 0:00:00前的直播数据
                alert(this.curLang.lang028);
                return false;
            }
            this.timestamp = prev7DayTimestamp;
            this.getChartData(this.timestamp);
        },
        next() {
            const next7DayTimestamp = this.timestamp + 7 * 86400000;
            if (next7DayTimestamp > this.currenTimestamp) {
                //不获取当天后的数据
                alert(this.curLang.lang028);
                return false;
            }
            this.timestamp = next7DayTimestamp;;
            this.getChartData(this.timestamp);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@assets/css/main.scss";
html,
body {
  background-color: #fff;
}
.page {
  > p {
    padding: 0 30px;
    margin-bottom: 100px;
    span {
      @include font(28, #999999);
    }
    a {
      @include font(28, #ce48ec);
      text-decoration: none;
      border-bottom: 1px solid #ce48ec;
    }
  }
}
.list {
  margin-bottom: 30px;
  li {
    border-bottom: 1px solid #e9e9ea;
    padding: 20px 20px;
    position: relative;
    > div {
      position: relative;
      //   top: 50%;
      //   transform: translate(0, -50%);
    }
  }
  .msg {
    width: 455px;
    display: inline-block;
    vertical-align: middle;
    .title {
      @include font(34, #25252f);
      margin-bottom: 1px;
    }
    .desc {
      @include font(26, #999999);
    }
  }
  .num {
    width: 250px;
    text-align: right;
    display: inline-block;
    vertical-align: middle;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    span {
      @include font(48, #25252f, bold);
      vertical-align: middle;
    }
  }
}
</style>
