<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="110" align="center">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="账号">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="余额">
        <template slot-scope="scope">
          {{ scope.row.balance }}
        </template>
      </el-table-column>

      <el-table-column label="手机号码">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status==1?'正常':'禁用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="订单数/包裹数">
        <template slot-scope="scope">
          {{ scope.row.order_nums }}
          &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
          {{ scope.row.package_nums }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="updated_at" label="操作">
        <el-button size="mini" type="primary">编辑</el-button>
        <el-button size="mini" type="danger">删除</el-button>
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
import { getUserList } from '@/api/auth'

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
  data() {
    return {
      list: null,
      listLoading: true,



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
    fetchData() {
      this.listLoading = true
      self.$request({url:'/auth/user', method:'get'}).then(response=>{
        self.list = response.data.list
        self.total = response.data.total
        self.listLoading = false
      }).catch(error=>{

      })
    },
    deleteRowHandle(id){
      this.$confirm('是否删除该条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request({url:`/goods/goods/${id}`, method:'DELETE'}).then(response=>{
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
