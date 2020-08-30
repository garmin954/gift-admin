<template>
  <div class="app-container">
    <!--    搜索和操作-->
    <el-card class="box-card garmin-form">
      <el-form :inline="true" :model="searchField">

        <el-form-item>
          <el-input v-model="searchField.name" placeholder="搜索名称"></el-input>
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
        label="导入方式"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1">数据导入</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="form"
        label="数据来源">
      </el-table-column>
      <el-table-column
        prop="price"
        label="总费用（元）">
      </el-table-column>
      <el-table-column
        prop="form"
        label="订单状态">
      </el-table-column>
      <el-table-column
        prop="package_nums"
        label="包裹数量">
      </el-table-column>
      <el-table-column
        prop="remarks"
        label="备注">
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
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
    },
    data() {
      return {
        list: [], // 列表
        listLoading: true, // 加载

        // 搜索表单
        searchField: {
          name: '',
        },

        dialogAddEdit: false, // dialog框
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
        self.$request({url:'/order', method:'GET', params}).then(response=>{
          console.log(response.data.list)
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
