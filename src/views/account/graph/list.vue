<template>
  <div class="app-container">

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="timeRang"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-row style="text-align: center">
      <el-button size="mini" type="primary">按月</el-button>
      <el-button size="mini" type="success">按周</el-button>
      <el-button size="mini" type="info">按天</el-button>
      <el-button size="mini" type="warning">按时</el-button>
      <el-button size="mini" type="danger">按分</el-button>
    </el-row>
    <div id="myChart"> </div>

    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="date"
        label="支付宝充值金额"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="卖出商品总金额"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="运费总收入">
      </el-table-column>
      <el-table-column
        prop="address"
        label="用户总消费">
      </el-table-column>
      <el-table-column
        prop="address"
        label="包裹数量">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  var self;
  export default {
    data(){
      return{
        formInline:[],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timeRang: [], // 最近一个月内
      }
    },
    mounted() {
      this.drawLine();
      self = this;
      self.timeRang = [self.getNowFormatDate('','-30', '-'), self.getNowFormatDate('','0', '-')]
    },
    methods: {
      fetchData(){

      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        myChart.setOption({ // 绘制图表
          title: {text: 'Echarts图形图表'},
          tooltip: {

          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true
            },
            {
              data: [80, 332, 601, 934, 590, 330, 660],
              type: 'line',
              smooth: true
            },
          ]
        });
      },
      onSubmit(){

      },
      getNowFormatDate(sdate,interval,caret) {
        var patt1 =  /^\d{4}-([0-1]?[0-9])-([0-3]?[0-9])$/;  //判断输入的日期是否符合格式正则表达式
        if(!(sdate && typeof(sdate) == "string" &&  patt1.test(sdate))){
          sdate = new Date(); //不满足日期的则使用当前年月日
        }
        interval = isNaN(parseInt(interval)) ? 0 : parseInt(interval);//若没有输入间隔，则使用当前日
        caret = (caret && typeof(caret) == "string") ? caret : "";
        var gdate = new Date(sdate).getTime();//获取指定年月日
        gdate = gdate + 1000*60*60*24*interval; //加减相差毫秒数
        var speDate = new Date(gdate);//获取指定好毫秒数时间
        var preYear = speDate.getFullYear();
        var preMonth = speDate.getMonth() + 1;
        var preDay = speDate.getDate();
        preMonth = (preMonth < 10) ? ("0" + preMonth) :preMonth;
        preDay = (preDay < 10) ? ("0" + preDay) :preDay;
        var preDate =  preYear + caret +  preMonth + caret + preDay;
        return preDate;
      }

    }
  }
</script>

<style scoped>
  #myChart{
    width: 100%;
    height: 300px;
  }
  .el-tab-pane > div, .el-tab-pane div{
    width: 100%!important;
  }

</style>
