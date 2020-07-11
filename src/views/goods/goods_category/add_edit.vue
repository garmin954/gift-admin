<template>
  <div class="add_edit">
    <el-form :model="params" ref="params" label-width="100px" class="demo-dynamic garmin-form">
      <el-form-item
        prop="name"
        label="名称"
        :rules="[
            { required: true, message: '名称不能为空', trigger: 'blur' },
          ]"
      >
        <el-input v-model="params.name"></el-input>
      </el-form-item>

      <el-form-item
        prop="http_method"
        label="排序">
        <el-input type="number" v-model="params.sort"></el-input>
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
    props:{
      data_id:{
        type: Number,
        default: 0,
      }
    },
    data() {
      return {
        params: {
          name: '',
          sort:0,
        },

        methods: [],
        submitting:false,

        dialogImageUrl: '',
        dialogVisible: false,
        currentPage:1,// 当前页面

        content: null,
        editorOption:{},
      };
    },
    created() {
      self = this;
      // console.log(this.$route.query)
      if (this.$route.query.hasOwnProperty('id')){
        this.params.id = this.$route.query.id;
      }
      self.initData();

    },
    methods: {
      // 获取初始数据
      initData(){
        let urls = '/goods/goods_category' + (this.params.id >0 ? `/${this.params.id}/edit` : '');
        self.$request({ url: urls, method:'get'}).then(response=>{
          if (response.data.hasOwnProperty('info')){
            self.params = response.data.info
          }
        }).catch(errer=>{

        })
      },
      // 提交数据
      submitForm(formName) {
        self.submitting = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(self.params));

            //判断创建还是提交
            let _url ='', _method='';
             if (self.params.id > 0){
                _url = '/goods/goods_category' + (self.params.id > 0 ? `/${self.params.id}` : '');
                _method = "put";
             }else{
                _url = '/goods/goods_category'
               _method = "Post";
             }

            self.$request({ url: _url, method:_method, params}).then(response=>{
              self.$message({
                message: response.message,
                type: 'success'
              });

              self.goBack();

              // self.closeDialog();
              // self.$refs['params'].resetField();
              self.submitting = true;
            }).catch(errer=>{
              self.submitting = false;
            })
          } else {
            self.submitting = false;
            return false;
          }
        });
      },
      // 重置数据
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      goBack(){
        this.$router.go(-1); //返回上一层

      },
      // 关闭dialog
      closeDialog(){
        this.$emit('closeDialog')
        self.$refs['params'].resetField();
      },


    }
  }





</script>

<style scoped>

</style>
