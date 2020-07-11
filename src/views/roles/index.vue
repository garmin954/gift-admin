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

    </el-table>


<!--    添加编辑框-->
    <el-dialog
      title="创建和编辑"
      :visible.sync="dialogAddEdit"
      width="60%"
      @open="toggleSideBar(false)"
      @close="toggleSideBar"
      :before-close="handleClose">
        <add-edit></add-edit>

    </el-dialog>
</div>
</template>

<script>
import { getRolesList } from '@/api/auth'
import addEdit from '@/views/roles/add_edit'
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
      list: null,
      listLoading: true,

      formInline: {
        user: '',
        region: ''
      },

      dialogAddEdit: false, // dialog框
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 切换栏目
    toggleSideBar(state='') {
      this.$store.dispatch('app/toggleSideBar', state)
    },
    fetchData() {
      this.listLoading = true
      getRolesList().then(response => {
        this.list = response.data.user_list
        this.listLoading = false
      })
    },

    onSubmit() {
      console.log('submit!');
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
}
</script>
