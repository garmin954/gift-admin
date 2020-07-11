<template>
  <div class="app-container">
    <!--    搜索和操作-->
    <el-card class="box-card garmin-form">
      <el-form :inline="true" :model="searchField">

<!--        <el-form-item>-->
<!--          <el-input v-model="searchField.name" placeholder="搜索广告名称"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-select v-model="searchField.banner_type_id" placeholder="广告分类">-->
<!--            <el-option-->
<!--              v-for="item in bannerTypeList"-->
<!--              :key="item.id"-->
<!--              :label="item.name"-->
<!--              :value="item.id">-->
<!--            </el-option>-->
<!--          </el-select>-->

<!--        </el-form-item>-->
        <el-form-item>
<!--          <el-button type="primary" @click="onSearch">查询</el-button>-->
          <el-button type="success" @click="editOrCreate">创建</el-button>
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

      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="首重">
        <template slot-scope="scope">
          {{ scope.row.start }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="首重价格">
        <template slot-scope="scope">
          {{ scope.row.start_price }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="续重" >
        <template slot-scope="scope">
          {{ scope.row.refill }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="续重价格" >
        <template slot-scope="scope">
          {{ scope.row.refill_price }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">正常</el-tag>
          <el-tag v-else type="danger">已关闭</el-tag>
        </template>
      </el-table-column>

      <el-table-column  fixed="right" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-link type="primary" @click="editOrCreate(scope.row.id)">编辑</el-link>
          <el-link type="danger" @click="deleteRowHandle(scope.row.id)">删除</el-link>
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
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
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
          banner_type_id: '',
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
        self.$request({url:'weight', method:'GET', params}).then(response=>{
          console.log(response)
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
        this.$router.push({path:'/weight/add_edit', query: {id:id}})
      },
      // 删除
      deleteRowHandle(id){
        this.$confirm('是否删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$request({url:`weight/${id}`, method:'DELETE'}).then(response=>{
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
