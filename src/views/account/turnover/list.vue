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
        width="80">
      </el-table-column>

      <el-table-column
        prop="number"
        label="流水号"
        width="180">
      </el-table-column>

      <el-table-column
        prop="title"
        label="交易类型"
        width="120">
      </el-table-column>

      <el-table-column
        prop="money"
        label="交易金额"
        width="120">
      </el-table-column>
      <el-table-column
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.status == 1">成功</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 0">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="交易时间"
        width="170">
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
          category_id:'',
        },

        dialogAddEdit: false, // dialog框
        currentPage:1, // 当前页面
        pageSize:10, // 显示条数
        total:0,// 商品条数
        categoryList:[],
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
        self.$request({url:'/rechargeOrder', method:'GET', params}).then(response=>{
          self.categoryList = response.data.category_list

          self.list = response.data.list
          self.total = response.data.total
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
        // self.currentId = id;
        // self.dialogAddEdit = true // dialog框
        // self.$refs.addEdit.initData();
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
