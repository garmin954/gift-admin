<template>
  <div class="app-container">
    <!--    搜索和操作-->
    <el-card class="box-card garmin-form">
      <el-form :inline="true" :model="searchField">

        <el-form-item>
          <el-input v-model="searchField.name" placeholder="搜索分类名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="分类名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort}}
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
          <el-link type="primary" @click="editOrCreate(scope.row.id)">编辑</el-link>
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
      <add-edit ref="addEdit" :data_id="currentId" @closeDialog="closeDialogHandel"></add-edit>

    </el-dialog>
  </div>
</template>

<script>
  import { getRolesList } from '@/api/auth'
  import addEdit from '@/views/goods/goods_category/add_edit'

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
        searchField: {
          name:''
        },

        dialogAddEdit: false, // dialog框
        currentId: 0, // 当前id
      }
    },
    created() {
      self = this;
      this.fetchData()
    },
    methods: {
      // 切换栏目
      toggleSideBar(state='') {
        // this.$store.dispatch('app/toggleSideBar', state)
      },
      // 获取列表数据
      fetchData() {
        this.listLoading = true
        let params = {}
        params = Object.assign(params, self.searchField);
        self.$request({url:'/goods/goods_category', method:'GET', params}).then(response=>{
          this.list = response.data.list
          this.listLoading = false
        }).catch(error=>{

        })
      },

      // 搜索
      onSearch() {
        self.fetchData()
      },
      // 编辑 or 创建
      editOrCreate(id=0){
        this.$router.push({path:'/goods/goods_category/add_edit', query: {id:id}})
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
          self.$request({url:`/goods/goods_category/${id}`, method:'DELETE'}).then(response=>{
            this.list = response.data.list
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
      }
    }
  }
</script>
