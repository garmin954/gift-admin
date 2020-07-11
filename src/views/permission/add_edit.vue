<template>
  <div>
    <el-form :model="params" ref="params" label-width="100px" class="demo-dynamic">
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
        label="标识"
        :rules="{
          required: true, message: '标识不能为空', trigger: 'blur'
        }">
        <el-input v-model="params.slug"></el-input>
      </el-form-item>

      <el-form-item
        prop="http_method"
        label="请求方式">
        <el-select v-model="params.http_method" multiple placeholder="请选择">
          <el-option
            size="medium"
            v-for="item in methods"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        prop="http_path"
        label="路由"
        :rules="[
          { required: true, message: '路由不能为空', trigger: 'blur' },
        ]">
        <el-input type="textarea" v-model="params.http_path"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('params')" :loading="submitting">提交</el-button>
        <el-button @click="resetForm('params')">重置</el-button>
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
          slug: '',
          http_method:'',
          http_path:'',
        },

        methods: [],
        submitting:false,
      };
    },
    created() {
      self = this;
      if (this.data_id){
        this.params.id = this.data_id
      }
      self.initData();

    },
    methods: {
      // 获取初始数据
      initData(){
        self.$request({ url: '/auth/permission/create'}).then(response=>{
          self.methods = response.data
        }).catch(errer=>{

        })
      },
      // 提交数据
      submitForm(formName) {
        self.submitting = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {

            let params = JSON.parse(JSON.stringify(self.params));
            params.http_method = params.http_method.join()
            self.$request({ url: '/auth/permission', method: 'POST', params}).then(response=>{
              self.$message({
                message: response.message,
                type: 'success'
              });

              self.closeDialog();
              self.$refs['params'].resetField();
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
      // 关闭dialog
      closeDialog(){
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style scoped>

</style>
