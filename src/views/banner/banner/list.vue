<template>
  <div class="app-container">
    <!--    搜索和操作-->
    <el-card class="box-card garmin-form">
      <el-form :inline="true" :model="searchField">

        <el-form-item>
          <el-input v-model="searchField.name" placeholder="搜索广告名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchField.banner_type_id" placeholder="广告分类">
            <el-option
              v-for="item in bannerTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

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
      <el-table-column align="center" label="ID" width="45">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="图片" width="110" align="center">
        <template slot-scope="scope">

          <el-avatar shape="square" :size="100" fit="fill"  :src="scope.row.images" />
          <!-- <span>{{ scope.row.author }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.banner_type.name }}</el-tag>
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
        bannerTypeList:[],
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
        self.$request({url:'banner/banner', method:'GET', params}).then(response=>{
          if (response.data.list){
            self.list =  response.data.list.forEach(item=>{
              item.images = self.img_domain + item.images;
              return item;
            })
          }
          self.bannerTypeList = response.data.banner_type_list
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
        this.$router.push({path:'/banner/banner/add_edit', query: {id:id}})
      },
      // 删除
      deleteRowHandle(id){
        this.$confirm('是否删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$request({url:`banner/banner/${id}`, method:'DELETE'}).then(response=>{
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
