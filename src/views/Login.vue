<template>
    <div class="login-root">
        <div class="login-header">
            <img src="../assets/imgs/sys-logo.png" alt=""/>
            <h1>商品管理系统</h1>
        </div>
        <div class="login-body">
            <!--ref属性值与:model绑定的对象名不能相同，否则表单input无法输入-->
            <el-form ref="loginForm" :model="loginFormData"
                     status-icon :rules="loginFormRules"
                     class="login-form" label-width="66px" label-position="right"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginFormData.username" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginFormData.password" type="password" autocomplete="off"/>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%" type="primary"
                               @click="submitLogin(loginForm)">
                        登陆
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from "element-plus";

import router from "@/router";
import {useCurrentUserStore} from "@/stores/CurrentUser";
import ajaxMtd from "@/utils/ajax";

const loginForm = ref<FormInstance>();//form表单ref引用对象
const loginFormData = reactive({//form表单输入数据的绑定对象
    username: '',
    password: '',
});
//表单校验规则对象
const loginFormRules: FormRules = {
    username: [
        {required: true, message: '用户名不能为空'},
        {pattern: /^[0-9A-Za-z_]+$/, message: '用户名应由字母、数字、下划线组成'},
        {min: 4, max: 12, message: '用户名长度在4到12位之间'},
    ],
    password: [
        {required: true, message: '密码不能为空'},
    ]
};

//存储当前用户的store
const curUserStore = useCurrentUserStore();

function submitLogin(form: FormInstance): void {
    form.validate(async valid => {
        if (!valid)
            return;
        const response: any = await ajaxMtd('/login', {
            username: loginFormData.username,
            password: loginFormData.password
        }, 'POST');
        if (response.status === 0) {
            ElMessage.success('登陆成功');
            curUserStore.$patch({curUser: response.data});//存储用户数据
            router.replace('/');//跳转主页
        } else {
            ElMessage.error('登陆失败，用户名或密码输入有误');
        }
    });
}
</script>

<style scoped lang="less">
.login-root {
  width: 100%;
  height: 100%;
  background-image: url("../assets/imgs/bg.jpg");
  background-size: 100%;
  box-sizing: border-box;

  .login-header {
    height: 15%;
    max-height: 100px;
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
    height: 85%;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-form {
      width: 500px;
      height: 360px;
      background-color: #ffffff;
      padding: 100px 50px 0 45px;
      box-sizing: border-box;
    }
  }
}
</style>