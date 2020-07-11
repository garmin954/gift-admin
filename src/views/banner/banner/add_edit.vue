<template>
  <div class="add_edit">
    <el-form :model="params" ref="params" label-width="100px" class="demo-dynamic garmin-form">
        <el-form-item
          prop="name"
          label="名称"
          :rules="[
            { required: true, message: '名称不能为空', trigger: 'blur' },
          ]">
          <el-input v-model="params.name"></el-input>
        </el-form-item>

        <el-form-item
          prop="banner_type_id"
          label="广告分类"
          :rules="[
            { required: true, message: '广告分类不能为空', trigger: 'blur' },
          ]">
          <el-select v-model="params.banner_type_id" placeholder="请选择">
            <el-option
              v-for="item in bannerTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item
          label="广告图片">
          <el-upload
            :action="uploadPath"
            :on-change="uploadStateHandle"
            list-type="picture-card"
            name="file"
            :before-upload="judgeHandle"
            :file-list="thumbMain"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item
          prop="url"
          label="链接">
          <el-input type="number" placeholder="http://" v-model="params.url"></el-input>
        </el-form-item>

        <el-form-item
          prop="sort"
          label="权重">
          <el-input type="number" style="width:100px" v-model="params.sort"></el-input>
        </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="submitForm('params')" :loading="submitting">提交</el-button>
        <el-button @click="resetForm('params')">重置</el-button>
        <el-button @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>


  var self;
  export default {
    name: 'AddEdit',
    components: {
    },

    data() {
      return {
        params: {
          name: '',
          images: '',
          sort: 0,
          url: '',
          banner_type_id: '',
        },
        bannerTypeList:[],
        submitting:false,

        dialogImageUrl: '',
        dialogVisible: false,
        thumbMain: [], // 主图

        editorOption:{},
        props: { multiple: true, value: 'id', label:'name', checkStrictly: true  },
        uploadPath: this.domain+'upload/bannerImage'
      };
    },
    watch:{

      "params.banner_type_id":{
        handler:function(val,b){
          self.uploadPath += `?banner_type_id=${val}`;
        }
      },

  },
    created() {
      self = this;
      if (this.$route.query.hasOwnProperty('id')){
        this.params.id = this.$route.query.id;
      }
      self.initData();
      console.log(self.domain)

    },
    methods: {
      // 获取初始数据
      initData(){
        let urls = '/banner/banner' + (this.params.id >0 ? `/${this.params.id}/edit` : '/create');
        self.$request({ url: urls, method:'get'}).then(response=>{

          self.bannerTypeList = response.data.banner_type_list;

          if (this.params.id >0){
            if (response.data.hasOwnProperty('info')){
              self.params = response.data.info;
              if (response.data.info.hasOwnProperty('images') && response.data.info.images){
                self.thumbMain.push({
                  'name' : 'main',
                  'url' : self.img_domain+response.data.info.images,
                });
              }
              self.category_select = response.data.category_select;
            }
          }
        }).catch(errer=>{

        })
      },
      // 提交数据
      submitForm(formName) {
        self.submitting = true;
        // 获取分类
        this.$refs[formName].validate((valid, object) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(self.params));

            //判断创建还是提交
            let _url ='', _method='';
            if (self.params.id > 0){
              _url = '/banner/banner' + (self.params.id > 0 ? `/${self.params.id}` : '');
              _method = "put";
            }else{
              _url = '/banner/banner'
              _method = "Post";
            }

            // params.http_method = params.http_method.join()
            self.$request({ url: _url, method: _method, data:params}).then(response=>{
              self.$message({
                message: response.message,
                type: 'success'
              });

              self.goBack();
              self.submitting = false;
            }).catch(errer=>{
              self.submitting = false;
            })
          } else {
            if (Object.keys(object)[0] !== 'content'){
              self.currentPage = 1;
            }
            self.submitting = false;
            return false;
          }
        });
      },
      // 重置数据
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      // 上传后
      uploadStateHandle(file, fileList){
        if (file.status === "success" && file.response.code === 200){
          self.params.images = file.response.data.path
        }
      },
      // 判断是否选择了分类 前置方法
      judgeHandle(){
        if (!self.params.banner_type_id){
          self.$message.error('请先选择广告分类！');return false;
        }
      },

      // 返回上一页
      goBack(){
        this.$router.go(-1); //返回上一层
        },
    }
  }





</script>

<style scoped>

</style>
