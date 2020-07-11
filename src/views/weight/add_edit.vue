<template>
  <div class="add_edit">
    <el-form :model="params" ref="params" label-width="100px" class="demo-dynamic garmin-form">
        <el-form-item
          prop="name"
          label="重量范围">
          <el-input-number v-model="params.start" :min="1" :max="100" label="kg" :step="0.5"></el-input-number> (kg) 内
          <el-input-number v-model="params.start_price" label="￥" :step="0.1"></el-input-number> 元
        </el-form-item>

      <el-form-item
        prop="name"
        label="续重范围">

        每 <el-input-number v-model="params.refill" :min="1" :max="100" label="kg" :step="0.5"></el-input-number> (kg) 续重费用
        <el-input-number v-model="params.refill_price" label="￥" :step="0.1"></el-input-number> 元
      </el-form-item>

        <el-form-item
          prop="sort"
          label="状态">
          <el-switch
            v-model="params.status"
            :active-value="1"
            :inactive-value="0"
            >
          </el-switch>
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
          start:1,
          start_price:0,
          refill:1,
          refill_price:0,
          status:1,
        },
        bannerTypeList:[],
        submitting:false,
      };
    },
    watch:{
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
        let urls = '/weight' + (this.params.id >0 ? `/${this.params.id}/edit` : '/create');
        self.$request({ url: urls, method:'get'}).then(response=>{

          if (this.params.id >0){
            if (response.data.hasOwnProperty('info')){
              self.params = response.data.info;
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
              _url = '/weight' + (self.params.id > 0 ? `/${self.params.id}` : '');
              _method = "put";
            }else{
              _url = '/weight'
              _method = "Post";
            }

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
      // 返回上一页
      goBack(){
        this.$router.go(-1); //返回上一层
      },
    }
  }

</script>

<style scoped>

</style>
