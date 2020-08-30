<template>
  <div class="app-container">
    <!--    搜索和操作-->
    <el-card class="box-card garmin-form">
      <el-form :inline="true" :model="searchField">

        <el-form-item>
          <el-input v-model="searchField.name" placeholder="搜索名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchField.status" placeholder="状态">
            <el-option label="全部" value="-100"></el-option>
            <el-option label="待支付" value="0"></el-option>
            <el-option label="已支付待打印" value="1"></el-option>
            <el-option label="已打印" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
<!--          <el-button type="success" @click="editOrCreate">创建</el-button>-->
        </el-form-item>

      </el-form>
    </el-card>

    <!--    数据表格-->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        prop="id"
        label="ID"
      >
      </el-table-column>
      <el-table-column
        label="包裹状态"
      >
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.status == 0">待支付</el-tag>
          <el-tag v-if="scope.row.status == 1">已支付</el-tag>
          <el-tag type="success" v-if="scope.row.status == 2">已打印</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="number"
        label="第三方订单">
      </el-table-column>
      <el-table-column
        prop="recipient_name"
        label="收件人">
      </el-table-column>
      <el-table-column
        prop="recipient_tel"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="delivery_number"
        label="快递单号">
      </el-table-column>

      <el-table-column
        prop="delivery_name"
        label="快递">
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.status !== 2" size="mini" type="success" @click="printPackage(scope.row.id)">打印</el-button>
          <el-button size="mini" type="primary" @click="lookDetail(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
      </el-table>



      <!--    分页-->
    <div class="block" style="float: right;margin: 20px 0px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getRolesList } from '@/api/auth'

  var self;
  export default {
    name:'index',
    components:{
      // addEdit
    },
    data() {
      return {
        list: null, // 列表
        listLoading: true, // 加载

        // 搜索表单
        searchField: {
          name: '',
          status:'-100',
        },

        currentPage:1, // 当前页面
        pageSize:10, // 显示条数
        total:0,// 商品条数
      }
    },
    created() {
      self = this;
      this.fetchData()
    },
    methods: {
      printPackage(id){
        self.$confirm('是否打印该包裹?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {id: id}
            self.$request({url:`/order/printPackage`, method:'post', params}).then(response=>{
              self.$message.info(response.message)
              this.listLoading = false
              this.fetchData();
            }).catch(error=>{

            })
        })
      },
      // 切换栏目
      toggleSideBar(state='') {
        this.$store.dispatch('app/toggleSideBar', state)
      },
      // 获取列表数据
      fetchData() {
        this.listLoading = true
        let params = {
          'page_index': self.currentPage,
          'page_size': self.pageSize,
        }
        params = Object.assign(params, self.searchField);
        self.$request({url:'/orderPackage', method:'GET', params}).then(response=>{
          self.list = response.data.list
          self.total = response.data.count
          self.listLoading = false
        }).catch(error=>{

        })
      },

      // 搜索
      onSearch() {
        self.fetchData()
      },
      // 编辑 or 创建
      editOrCreate(id=0){
        console.log(id)
        this.$router.push({path:'/article/article/add_edit', query: {id:id}})
      },
      // 删除
      deleteRowHandle(id){
        this.$confirm('是否删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$request({url:`/article/article/${id}`, method:'DELETE'}).then(response=>{
            this.listLoading = false
            this.fetchData();
          }).catch(error=>{

          })

          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSizeChange(val) {
        self.pageSize = val
        self.fetchData()
      },
      handleCurrentChange(val) {

        self.currentPage= val;
        self.fetchData()
      }
    }
  }
</script>
