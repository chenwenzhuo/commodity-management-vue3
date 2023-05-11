<template>
    <div class="login-root">
        <div class="login-header">
            <img src="../assets/imgs/sys-logo.png" alt=""/>
            <h1>商品管理系统</h1>
        </div>
        <div class="login-body">
            <el-form ref="loginForm" :model="loginForm"
                     status-icon :rules="loginFormRules"
                     class="login-form"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" type="text" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" autocomplete="off"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%">登陆</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import type {FormInstance, FormRules} from "element-plus";

const loginForm = reactive({
    username: '',
    password: '',
});
const loginFormRules: FormRules = {
    username: [
        {required: true, message: '用户名不能为空'}
    ],
    password: [
        {required: true, message: '密码不能为空'}
    ]
};
</script>

<style scoped lang="less">
.login-root {
  width: 100%;
  height: 100%;
  background-image: url("../assets/imgs/bg.jpg");
  background-size: 100%;
  box-sizing: border-box;

  .login-header {
    height: 100px;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    padding-left: 40px;

    img {
      width: 80px;
      margin-right: 30px;
    }

    h1 {
      font-size: 40px;
      font-weight: bold;
      color: #ffffff;
    }
  }

  .login-body {
    display: flex;
    justify-content: center;
    align-items: center;

    .login-form {
      width: 40%;
      height: 40%;
      background-color: #ffffff;
    }
  }
}
</style>