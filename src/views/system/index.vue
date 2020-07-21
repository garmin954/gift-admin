<template>
  <div class="app-container">

    <el-card class="box-card garmin-form">
      <el-form :inline="true" >
        <el-form-item>
          <el-button type="success" @click="editOrCreate">创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-form ref="form" label-width="80px" v-loading="loading">
      <template v-for="(system, index) in systemData">
        <el-form-item v-if="system.type == 1" :label="system.name">
          <el-input v-model="system.value"></el-input>
        </el-form-item>

        <el-form-item v-if="system.type == 9" :label="system.name">
          <el-upload
            :action="uploadPath"
            list-type="picture-card"
            name="file"
            :on-success="(response)=>{system.value=response.data.path}"
            :limit="1"
            :file-list="[{url:img_domain+system.value}]">
            <i class="el-icon-plus"></i>
          </el-upload>
          <input type="hidden" v-model="system.value">
        </el-form-item>


        <el-form-item v-if="system.type == 2" :label="system.name">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="system.type == 4" :label="system.name">
          <el-switch v-model="form.delivery"></el-switch>
        </el-form-item>
        <el-form-item v-if="system.type == 5" :label="system.name">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="system.type == 3" :label="system.name">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  v-if="system.type == 6" :label="system.name">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>

        <el-button type="primary" icon="el-icon-edit" circle  @click="onEdit(system.id)"></el-button>
      </template>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交更新</el-button>
      </el-form-item>
    </el-form>



    <!-- Form -->
    <el-dialog title="配置编辑"   width="60%" :visible.sync="dialogEditVisible">
      <add-edit ref="add_edit" :editId.sync="editId" @on-success="()=>{dialogEditVisible=false;getPageData();}"/>
    </el-dialog>
  </div>



</template>

<script>

var self;
import AddEdit from '@/views/system/add_edit'
export default {
  name: 'index',
  components:{
    AddEdit
  },
  data(){
    return {
      activeName: '',
      dialogEditVisible: false,
      loading: true,
      thumbMain:[],
      dialogVisible:false,
      dialogImageUrl:'',
      uploadPath: this.domain+'upload/otherImage',
      loading: true,
      systemData:[],
      editId: 0,

    }
  },
  created() {
    self = this;
    self.getPageData();
  },
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  },
  methods:{
    getPageData(){
      self.loading = true;
      self.$request({url:'system', method:'get'}).then(response=>{
        self.systemData = response.data.systemList;
        self.loading = false;
      }).catch(error=>{
        self.$messgae.error('获取数据错误')
        self.loading = false;
      })
      setTimeout(()=>self.loading = false, 1500)
    },
    handleClick(){

    },
    editOrCreate(){
      self.dialogEditVisible = true;
    },
    onSubmit() {
      let params =new FormData;
      self.systemData.forEach(item=>{
        if ( item.value == 9){
          item.value = item.value ? item.value.replace(this.img_domain, '') : '';
        }
        params.append(item.sign, item.value)
      })
      self.$request({url:'system/publish', method: 'post', data:params}).then(response=>{
        if (response.code == 200){
          // 关闭
          self.$message.success('提交成功！')
          return false;
        }
        self.$message.error(response.message)
      }).catch(error=>{
        self.$message.error(error)
      })
    },
    onEdit(id){
      // self.editId = id;
      self.dialogEditVisible = true
      setTimeout(()=>self.$refs['add_edit'].params.id=id, 1);
      setTimeout(()=>self.$refs['add_edit'].getInfo(), 1)
    },
  },

}
</script>

<style lang="sass">

  .el-form-item
    width: calc(100% - 45px)
    display: inline-block

</style>
