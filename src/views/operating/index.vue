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



  </div>
</template>

<script>
  import { getRolesList } from '@/api/auth'

  export default {

    data() {
      return {
        list: null,
        listLoading: true,

        formInline: {
          user: '',
          region: ''
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 切换栏目
      toggleSideBar(state = '') {
        this.$store.dispatch('app/toggleSideBar', state)
      },
      fetchData() {
        this.listLoading = true
        getRolesList().then(response => {
          this.list = response.data.user_list
          this.listLoading = false
        })
      },
    }

  }
</script>
