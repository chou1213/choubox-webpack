<style lang="scss" scoped>
@import "~@assets/css/main.scss";
</style>

<template>
    <div class="page">
        <!--条形图-->
        <div class="chart-wrap padding-top backgrond-purple">
            <chart :date='chartData.date' :increaseNum='chartData.increaseNum' :desc='chartData.desc' :maxNum='chartData.maxNum' :dailyDataList='chartData.dailyDataList' @prev='prev' @next='next'></chart>
        </div>
        <!--表格-->
        <table-list :labelList='tableData.labelList' :dataList='tableData.dataList' :keyList='tableData.keyList'></table-list>
    </div>
</template>
<script>
import { format } from '@assets/js/date';
import { last7dayIncome } from '@/services/index';

export default {
    name: 'live',
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
            tableData: {
                keyList: ['day', 'audience', 'beans', 'follows'],
                labelList: [],
                dataList: []
            },
            currenTimestamp: '', //当前时间戳
            timestamp: '' //计算前7天的时间戳
        };
    },
    created() {
        this.chartData['desc'] = this.curLang.lang024;
        this.tableData['labelList'] = [this.curLang.lang018, this.curLang.lang025, this.curLang.lang026, this.curLang.lang027];
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

            that.chartData['date'] = dayArr[0].formatFullDay + '-' + dayArr[6].formatFullDay;
            that.chartData['increaseNum'] = data.totalLiveBeans;
            dayArr.forEach(function (element, index) {
                let _num = data[element.day].liveBeans;
                _arr.push({
                    day: element.formatDay,
                    num: _num || 0,
                    compareWith: data[element.day].videoCompareFans,
                    audience: data[element.day].liveViewers,
                    beans: data[element.day].liveBeans,
                    follows: data[element.day].liveFans
                })
            });
            _maxNum = Math.max.apply(null, _arr.map(function (o) { return o.num }));
            _maxNum = _maxNum > 0 ? _maxNum : 1;
            that.chartData['maxNum'] = Math.ceil(_maxNum / 10) * 10;
            that.chartData['dailyDataList'] = _arr;
            that.tableData['dataList'] = _arr;
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
