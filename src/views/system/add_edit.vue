<template>

  <el-form :model="params" ref="params" label-width="100px" class="demo-dynamic" v-loading="loading">

    <el-form-item
      label="名称"
      :rules="{required: true, message: '配置名称', trigger: 'blur'}">
      <el-input v-model="params.name"></el-input>
    </el-form-item>

    <el-form-item
      prop="sign"
      label="标识"
      :rules="[{ required: true, message: '请输入标识', trigger: 'blur' },]">
      <el-input v-model="params.sign"></el-input>
    </el-form-item>

    <el-form-item
      prop="sign"
      label="表单类型" >
      <el-select v-model="params.type" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      prop="value"
      label="值">
      <el-input type="text" v-model="params.value"></el-input>
    </el-form-item>

    <el-form-item
      v-if="[2,3,4,5].includes(params.type)"
      prop="options"
      label="选项">
      <el-input type="textarea" v-model="params.options" placeholder="选项值"></el-input>
      <span style="font-size: 12px;color: red">选项选项按“)|(”分开, 键值按“=:”分开.例子：”0=:否)|(1=:是“</span>
    </el-form-item>

    <el-form-item
      prop="sign"
      label="备注">
      <el-input type="textarea" v-model="params.remark"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('params')">提交</el-button>
      <el-button @click="resetForm('params')">重置</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
  var self;
  export default {
    name: 'add_edit',
    props:{
      editId:{
        type:Number,
        default:0,
      }
    },
    data(){
      return{
        loading: true,
        params: {
          name : '',
          sign : '',
          type : 1,
          options : '',
          value : '',
          remark: '',
        },
        options:[
          {label:'输入框', value: 1},
          {label:'选择框', value: 2},
          {label:'单选框', value: 3},
          {label:'复选框', value: 5},
          {label:'文本框', value: 6},
          {label:'计数器', value: 7},
          {label:'switch', value: 4},
          {label:'富文本', value: 8},
          {label:'上传文件', value: 9},
        ],
      }
    },
    created() {
      self = this;
      self.$parent.dialogEditVisible = false;
      // self.$parent.getPageData();
      self.params.id = self.editId;
      self.loading = false;
    },
    methods:{
      submitForm(formName){
        let _url ='', _method='';
        if (self.params.id > 0){
          _url = 'system' + (self.params.id > 0 ? `/${self.params.id}` : '');
          _method = "put";
        }else{
          _url = 'system'
          _method = "post";
        }

        self.$request({url:_url,method:_method, data:self.params}).then(response=>{
          self.$message.success('提交成功！')
          setTimeout(()=>{
            self.$emit('on-success')
            self.$parent.dialogEditVisible = false;
          }, 1500)
          self.resetForm(formName);
        }).catch(error=>{
          self.$message.success(error)
        })
      },
      resetForm(formName){
        this.$refs[formName].resetFields();
      },
      getInfo(){
        self.loading = true;
        if (self.params.id > 0){
          self.$request({url:`system/${self.params.id}/edit`, method:'get'}).then(response=>{
            if (response.code == 200){
              self.params = response.data.info;
              self.loading = false;
              return true;
            }
            self.loading = false;
            return self.$message.error('获取数据失败')
          }).catch(error=>{
            return self.$message.error(error)
          })
        }
        console.log('进来是否会刷新一次');
      }
    }
  }
</script>
<style scoped>

</style>
