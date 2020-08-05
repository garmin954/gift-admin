<template>
  <div class="add_edit">
    <el-form :model="params" ref="params" label-width="100px" class="demo-dynamic garmin-form">
      <div class="gm-form-block" v-show="currentPage==1">
        <el-form-item
          prop="name"
          label="名称"
          :rules="[
            { required: true, message: '名称不能为空', trigger: 'blur' },
          ]">
          <el-input v-model="params.name"></el-input>
        </el-form-item>

        <el-form-item
          prop="categories_id"
          label="分类">

            <el-cascader
              ref="cascader"
              v-model="category_select"
              :options="goodsCategoryList"
              :props="props"
              clearable></el-cascader>

        </el-form-item>


        <el-form-item
          label="商品主图">
          <el-upload
            class="avatar-uploader"
            :action="uploadPath"
            :show-file-list="false"
            :on-change="uploadStateHandle">

            <img v-if="params.thumb" :src="img_domain+params.thumb" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>


        <el-form-item
          label="商品图片">
          <el-upload
            :action="uploadPath"
            :on-change="uploadsStateHandle"
            list-type="picture-card"
            name="file"
            :file-list="thumbMain"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

        <el-form-item
          prop="price"
          label="价格">
          <el-input type="number" v-model="params.price"></el-input>
        </el-form-item>

        <el-form-item
          label="重量"
          :rules="{
            required: true, message: '重量不能为空', trigger: 'blur'
          }">
          <el-input type="number" aria-placeholder="0" v-model="params.weight"></el-input>
        </el-form-item>

        <el-form-item
          prop="http_method"
          label="库存">
          <el-input type="number" v-model="params.stock"></el-input>
        </el-form-item>

        <el-form-item
          prop="detail"
          label="商品简介">
          <el-input type="textarea" v-model="params.detail"></el-input>
        </el-form-item>

        <el-form-item
          prop="sort"
          label="权重">
          <el-input type="number" v-model="params.sort"></el-input>
        </el-form-item>
      </div>


      <div v-show="currentPage==2" class="gm-form-block">
        <el-card style="height: 610px; margin-bottom: 20px">
        <quill-editor v-model="params.content" ref="myQuillEditor" style="height: 500px;" :options="editorOption">
        </quill-editor>
        </el-card>
      </div>
      <el-form-item>
        <el-button v-if="currentPage==1" type="primary" @click="currentPage=2">下一步</el-button>
        <el-button v-if="currentPage==2"  type="primary" @click="submitForm('params')" :loading="submitting">提交</el-button>
        <el-button v-if="currentPage==2" type="" @click="currentPage=1">上一步</el-button>
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
          name: '',
          detail: '',
          content:'',
          sort: 0,
          price: 0,
          weight: 0,
          stock: 0,
          thumb:'',
          categories_id:[],
          img_domain: this.img_domain,
        },

        methods: [],
        submitting:false,

        dialogImageUrl: '',
        dialogVisible: false,
        thumbMain: [], // 主图

        currentPage:1,// 当前页面

        editorOption:{},
        props: { multiple: true, value: 'id', label:'name', checkStrictly: true  },
        category_select:[],
        goodsCategoryList: [], // 商品分类
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
        let urls = '/goods/goods' + (this.params.id >0 ? `/${this.params.id}/edit` : '/create');
        self.$request({ url: urls, method:'get'}).then(response=>{

          self.goodsCategoryList = response.data.category_list;

          if (this.params.id >0){
            if (response.data.hasOwnProperty('info')){
              self.params = response.data.info;
              if (response.data.info.hasOwnProperty('thumb') && response.data.info.thumb){
                response.data.info.thumb_list.split(',').map(item=>{
                  self.thumbMain.push({
                    'name' : 'main',
                    'url' : self.img_domain+item,
                  });
                })

                console.log(self.thumbMain)
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
        self.params.categories_id = self.$refs.cascader.checkedValue;
        this.$refs[formName].validate((valid, object) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(self.params));
            params.thumb = params.thumb.replace(self.img_domain, '');
            params.thumb_list = self.thumbMain

            params.thumb_list = [];
            self.thumbMain.map(item=>{
              console.log(item)
              item.url = item.url.replace(self.img_domain, '');
              params.thumb_list.push(item.url);
            })
            params.thumb_list= params.thumb_list.join();
            //判断创建还是提交
            let _url ='', _method='';
            if (self.params.id > 0){
              _url = '/goods/goods' + (self.params.id > 0 ? `/${self.params.id}` : '');
              _method = "put";
            }else{
              _url = '/goods/goods'
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
        console.log(file, fileList);
        self.thumbMain = fileList;
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
      uploadsStateHandle(file, fileList){
        if (file.status === "success" && file.response.code === 200){
          self.thumbMain.push({
            'name' : 'main',
            'url' : self.img_domain+file.response.data.path,
          });
        }
      },
      // 返回上一页
      goBack(){
        this.$router.go(-1); //返回上一层
      },
    },

  }

</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border: 1px solid gray;
  }
</style>
