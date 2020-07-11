<template>
  <div class="app-container">
<!--    搜索和操作-->
    <el-card class="box-card garmin-form">
      <el-form :inline="true" :model="formInline">

        <el-form-item>
          <el-input v-model="formInline.user" placeholder="搜索权限名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="success" @click="dialogAddEdit= true">创建</el-button>
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="标识" width="110" align="center">
        <template slot-scope="scope">

          <el-avatar :src="scope.row.avatar" />
          <!-- <span>{{ scope.row.author }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="权限">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="updated_at" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-link type="primary" @click="editRowHandle(scope.row.id)">编辑</el-link>
          <el-link type="danger" @click="deleteRowHandle(scope.row.id)">删除</el-link>
        </template>
      </el-table-column>

    </el-table>


<!--    添加编辑框-->
    <el-dialog
      title="创建和编辑"
      :visible.sync="dialogAddEdit"
      width="40%"
      @open="toggleSideBar(false)"
      @close="toggleSideBar"
      :before-close="handleClose">
        <add-edit @closeDialog="closeDialogHandel"></add-edit>

    </el-dialog>
</div>
</template>

<script>
import { getRolesList } from '@/api/auth'
import addEdit from '@/views/permission/add_edit'

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
    addEdit
  },
  data() {
    return {
      list: null, // 列表
      listLoading: true, // 加载

      // 搜索表单
      formInline: {
        user: '',
        region: ''
      },

      dialogAddEdit: false, // dialog框
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
      let params = {}
      self.$request({url:'/auth/permission', method:'GET', params}).then(response=>{
        this.list = response.data.list
        this.listLoading = false
      }).catch(error=>{

      })
    },

    // 搜索
    onSubmit() {
      console.log('submit!');
    },
    // 关闭dialog框
    handleClose(done) {
      done();
    },
    // 关闭dialog框
    closeDialogHandel(){
      self.dialogAddEdit = false // dialog框
      this.fetchData();
    },
    // 编辑
    editRowHandle(){

    },
    // 删除
    deleteRowHandle(){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
    }
  }
}
</script>
