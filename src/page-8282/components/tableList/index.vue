<style lang="scss">
table {
  width: 100%;
  text-align: center;
  border: 0;
  margin: 0;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  tr {
    padding: 0;
    th{
       padding:0 13px;
       word-break:break-all; /* 支持IE和chrome，FF不支持*/
word-wrap:break-word; /* 以上三个浏览器均支持 */
   }
  }
  tr:nth-child(even) {
    background-color: #f8f8f8;
  }

  td {
    height: 90px;
    line-height: 90px;
  }
  th {
    font-size: 22px;
    color: #999;
    font-weight: normal;
    height: 90px;
  }
  td {
    font-size: 28px;
    color: #25252f;
  }
}
</style>

<template>
    <div class="components-table">
        <table>
            <tr>
                <th v-for="(item,index) in labelList" :key="index">{{item}}</th>
            </tr>
            <tr v-for="(item,index) in dataList" :key="index">
                <td v-for="(itm,idx) in keyList" :key="idx">{{item[itm]}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    name: 'tablelist',
    props: ['labelList', 'dataList', 'keyList'],
    data() {
        return {
            token: ''
        };
    },
    created() {


    },
    methods: {

    }
};
</script>
