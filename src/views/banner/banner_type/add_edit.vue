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
        prop="slug"
        label="标识"
        :rules="[
            { required: true, message: '标识不能为空', trigger: 'blur' },
          ]">
        <el-input v-model="params.slug"></el-input>
      </el-form-item>

      <el-form-item
        prop="slug"
        label="宽高">

        <el-input type="number" v-model="params.width" style="width: 90px"></el-input> x
        <el-input type="number" v-model="params.height" style="width: 90px"></el-input>

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

    data() {
      return {
        params: {
          name: '',
          slug: '',
          width: 0,
          height: 0,

        },

        submitting:false,
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
        let urls = '/banner/banner_type' + (this.params.id >0 ? `/${this.params.id}/edit` : '');
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
                _url = '/banner/banner_type' + (self.params.id > 0 ? `/${self.params.id}` : '');
                _method = "put";
             }else{
                _url = '/banner/banner_type'
               _method = "Post";
             }

            self.$request({ url: _url, method:_method, params}).then(response=>{
              self.$message({
                message: response.message,
                type: 'success'
              });

              self.goBack();

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
    }
  }





</script>

<style scoped>

</style>
