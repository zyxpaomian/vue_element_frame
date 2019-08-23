<template>
  <el-form :model="loginform" :rules="loginrlue" ref="loginform" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginform.username" auto-complete="off" placeholder="UM"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginform.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!--el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox-->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click="loginCommit" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>
<script>
  // import { requestLogin } from '../api/api'; 
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        loginform: {
          username: '',
          password: ''
        },
        loginrlue: {
          username: [
            { required: true, message: '请输入UM账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },

          ]
        },
        checked: true
      };
    },
    methods: {
      loginCommit(){
        var currentTime = new Date().getTime()
        var data = {"username":this.loginform.username,"password":this.loginform.password};
        var url = '/mgt/api/v1/user/userauth'
        this.loading = true
        this.$post(url,data,'认证失败，请检查参数是否正确').then((response)=> {
        this.loading = false
        this.token = response.Token
        this.role = response.Role
        this.$store.dispatch("setIsAuthenticate",true).then(() =>{
          this.$store.dispatch("setUserName",response.Username)}).then(() =>{                    
            this.$store.dispatch("setRole",response.Role)}).then(() => {
              this.$store.dispatch("setToken",response.Token)}).then(() =>{
                this.$store.dispatch("setPasstime",currentTime)}).then(() =>{  
                  this.$router.push({ path: '/index' })})    
            })
		    }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>