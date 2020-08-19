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
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status==1?'正常':'已禁用' }}</el-tag>
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
        <template slot-scope="scope" v-if="scope.row.id > 1">
        <el-link type="primary" @click="editUserInfo(scope.$index)">编辑</el-link>
        <el-link type="danger" @click="deleteRowHandle(scope.row.id, scope.row.status)">{{ scope.row.status==1?"加入黑名单":"加入白名单"}}</el-link>
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

    <el-dialog
      title="修改"
      :visible.sync="centerDialogVisible"
      width="400px"
      center>
      <el-form :model="editForm">
        <el-form-item label="账号余额">
          <el-input v-model="editForm.balance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账户状态" >
          <el-switch
            v-model="editForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button :disabled="disabled" type="primary"  @click="submitEdit">确 定</el-button>
  </span>
    </el-dialog>


  </div>
</template>

<script>
import { getUserList } from '@/api/auth'

var self;
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      centerDialogVisible:false,
      list: null,
      listLoading: true,
      dialogAddEdit: false, // dialog框
      currentPage:1, // 当前页面
      pageSize:10, // 显示条数
      total:0,// 商品条数
      editForm:{
        balance:0,
        status:0,
        id:9999999999999999999,
      },
      disabled:false

    }
  },
  created() {
    self = this;
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      let params = {
        page_index:self.currentPage,
        page_size:self.pageSize,
      }
      self.$request({url:'/auth/user', method:'get', params}).then(response=>{
        self.list = response.data.list
        self.total = response.data.total
        self.listLoading = false
      }).catch(error=>{

      })
    },
    // 编辑
    editUserInfo(index){
      let {status, balance,id} = self.list[index]
      self.centerDialogVisible = true;
      self.$set(self.editForm, 'status', status);
      self.$set(self.editForm, 'id', id);
      self.$set(self.editForm, 'balance', balance);
      console.log(self.list[index])
    },
    // 提交编辑;
    submitEdit(){
      self.disabled = true;
      let params = self.editForm;
      this.$request({url:`/user/userEdit`, method:'get', params}).then(response=>{
        this.listLoading = false
        if (response.code == 200){
          this.$message({
            type: 'success',
            message: response.message
          });
          this.fetchData();
        }

        self.disabled = false
        self.centerDialogVisible = false;
    })
    },
    // 加入黑名单
    deleteRowHandle(id, status){
      let text = status==1?"黑":"白";
      this.$confirm(`是否将改用户加入${text}名单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: id,
          status: status,
        };
        self.$request({url:`/user/userStatus`, method:'get', params}).then(response=>{
          this.listLoading = false
          if (response.code == 200){
            this.$message({
              type: 'success',
              message: response.message
            });
            this.fetchData();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    handleSizeChange(val) {
      self.pageSize = val;
      self.listLoading = true;
      self.fetchData();
    },
    handleCurrentChange(val) {
      self.currentPage= val;
      self.fetchData()
    }
  }
}
</script>
