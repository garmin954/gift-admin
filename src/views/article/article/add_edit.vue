<template>
  <div class="add_edit">
    <el-form :model="params" ref="params" label-width="100px" class="demo-dynamic garmin-form">
        <el-form-item
          prop="title"
          label="名称"
          :rules="[
            { required: true, message: '名称不能为空', trigger: 'blur' },
          ]">
          <el-input v-model="params.title"></el-input>
        </el-form-item>

        <el-form-item prop="categories_id" label="分类">

          <el-select v-model="params.category_id" placeholder="广告分类">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>


<!--        <el-form-item-->
<!--          label="商品图片">-->
<!--          <el-upload-->
<!--            :action="uploadPath"-->
<!--            :on-change="uploadStateHandle"-->
<!--            list-type="picture-card"-->
<!--            name="file"-->
<!--            :file-list="thumbMain"-->
<!--            :on-preview="handlePictureCardPreview"-->
<!--            :on-remove="handleRemove">-->
<!--            <i class="el-icon-plus"></i>-->
<!--          </el-upload>-->
<!--          <el-dialog :visible.sync="dialogVisible">-->
<!--            <img width="100%" :src="dialogImageUrl" alt="">-->
<!--          </el-dialog>-->
<!--        </el-form-item>-->

        <el-form-item
          label="是否顶置">

          <el-switch v-model="params.is_top" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>

        <el-form-item
          prop="status"
          label="状态">

          <el-switch v-model="params.status" :active-value="1" :inactive-value="0">
          </el-switch>

        </el-form-item>


        <el-form-item
          prop="sort"
          label="权重">
          <el-input type="number" style="width: 100px" v-model="params.sort"></el-input>
        </el-form-item>
      <el-form-item
        prop="sort"
        label="内容">
        <el-card style="height: 610px; margin-bottom: 20px">
        <quill-editor v-model="params.content" ref="myQuillEditor" style="height: 500px;" :options="editorOption">
        </quill-editor>
        </el-card>
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
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  var self;
  export default {
    name: 'AddEdit',
    components: {
      quillEditor
    },

    data() {
      return {
        params: {
          title: '',
          content: '',
          sort:0,
          is_top: 0,
          status: 1,
          category_id: '',
        },

        methods: [],
        submitting:false,

        dialogImageUrl: '',
        dialogVisible: false,
        thumbMain: [], // 主图

        editorOption:{},
        categoryList: [], // 分类
        uploadPath: this.domain+'upload/goodsImage'
      };
    },
    created() {
      self = this;
      if (this.$route.query.hasOwnProperty('id')){
        this.params.id = this.$route.query.id;
      }
      self.initData();

    },
    methods: {
      // 获取初始数据
      initData(){
        let urls = '/article/article' + (this.params.id >0 ? `/${this.params.id}/edit` : '/create');
        self.$request({ url: urls, method:'get'}).then(response=>{

          self.categoryList = response.data.category_list;

          if (this.params.id >0){
            if (response.data.hasOwnProperty('info')){
              self.params = response.data.info;
              if (response.data.info.hasOwnProperty('thumb') && response.data.info.thumb){
                self.thumbMain.push({
                  'name' : 'main',
                  'url' : self.img_domain+response.data.info.thumb,
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
              _url = '/article/article' + (self.params.id > 0 ? `/${self.params.id}` : '');
              _method = "put";
            }else{
              _url = '/article/article'
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
      // 关闭dialog
      closeDialog(){
        this.$emit('closeDialog')
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
          self.params.thumb = file.response.data.path
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
