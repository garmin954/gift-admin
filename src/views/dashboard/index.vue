<template>
  <div class="dashboard-container">

    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
        <el-row :gutter="20">
          <el-col :span="8">
            <i class="sign el-icon-user-solid" ></i>
          </el-col>

          <el-col :span="16">
            <div class="label">总用户数量： <span>{{data.user_total}}</span></div>
            <div class="label">今日新增数： <span>{{data.user_today}}</span></div>
          </el-col>

        </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-row :gutter="20">
            <el-col :span="8">
              <i class="sign el-icon-s-order" ></i>
            </el-col>

            <el-col :span="16">
              <div class="label">总订单数量： <span>{{data.order_total}}</span></div>
              <div class="label">今日新增数： <span>{{data.order_today}}</span></div>
            </el-col>

          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-row :gutter="20">
            <el-col :span="8">
              <i class="sign el-icon-box" ></i>
            </el-col>

            <el-col :span="16">
              <div class="label">总包裹数量： <span>{{data.package_total}}</span></div>
              <div class="label">今日新增数： <span>{{data.package_today}}</span></div>

            </el-col>

          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-row :gutter="20">
            <el-col :span="8">
              <i class="sign el-icon-money" ></i>
            </el-col>

            <el-col :span="16">
              <div class="label">总充值金额： <span>{{data.recharge_total}}</span></div>
              <div class="label">今日充值额： <span>{{data.recharge_today}}</span></div>

            </el-col>

          </el-row>
        </div>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data(){
    return{
      data:[],
    }
  },
  created() {
    var self = this;
    self.$request({url:'getIndexData', method:'get'}).then(response=>{
      self.data = response.data;
    }).catch(error=>{
      self.$message.error(error)
    })
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  padding: 8px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
  .sign{
    font-size: 80px;color: #20a0ff
  }
  .label{
    text-align: right;
    font-size: 13px;
    margin-left: 20px;
  }
  .label span{
    font-size: 25px;
    color: #ff5a41;
  }
</style>
