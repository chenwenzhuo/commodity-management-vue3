<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <el-button type="primary" @click="handleCreateUser">
                    <el-icon>
                        <Plus/>
                    </el-icon>
                    <span>创建用户</span>
                </el-button>
            </div>
        </template>
        <!--用户数据表格-->
        <el-table :data="tablePageData" border>
            <el-table-column prop="username" label="用户名" align="center"/>
            <el-table-column prop="email" label="邮箱" align="center"/>
            <el-table-column prop="phone" label="电话" align="center"/>
            <el-table-column label="注册时间" align="center">
                <template #default="scope">
                    {{ timeFormatter(scope.row.create_time) }}
                </template>
            </el-table-column>
            <el-table-column label="所属角色" :formatter="userRoleFormatter" align="center"/>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button type="primary" @click="handleUpdateUser(scope.row)">修改</el-button>
                    <el-button type="primary" @click="handleDeleteUser(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="->, prev, pager, next, sizes"
                       :total="userTableData.length" :page-sizes="[5,10,20]"
                       v-model:page-size="tablePageSize"
                       v-model:current-page="tableCurrentPage"/>
        <!--创建、修改用户弹窗-->
        <el-dialog :model-value="dialogDisplayStatus" width="500"
                   :title="dialogTitle" @close="handleCloseDialog">
            <el-form ref="modifyUserFormRef" :model="modifyUserFormData"
                     label-width="70" :rules="modifyUserFormRules">
                <el-form-item prop="username" label="用户名">
                    <el-input type="text" placeholder="请输入用户名" v-model="modifyUserFormData.username"/>
                </el-form-item>
                <el-form-item v-if="dialogType==='create'" prop="password" label="密码">
                    <el-input type="password" placeholder="请输入密码" v-model="modifyUserFormData.password"/>
                </el-form-item>
                <el-form-item prop="phone" label="手机号">
                    <el-input type="text" placeholder="请输入手机号" v-model="modifyUserFormData.phone"/>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input type="text" placeholder="请输入邮箱" v-model="modifyUserFormData.email"/>
                </el-form-item>
                <el-form-item prop="role_id" label="角色">
                    <el-select v-model="modifyUserFormData.role_id" placeholder="请选择角色">
                        <el-option v-for="item in roleData" :key="item._id"
                                   :label="item.name" :value="item._id">
                            {{ item.name }}
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button class="cancel-btn" @click="handleCloseDialog">取消</el-button>
                <el-button type="primary" @click="handleDialogConfirm">确定</el-button>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Plus} from "@element-plus/icons-vue";
import type {FormInstance} from "element-plus";

import ajaxMtd from "@/utils/ajax";
import {timeFormatter} from "@/utils/tools";

interface UserDataInterface {
    _id?: string,
    username: string,
    password?: string,
    phone: string,
    email: string,
    role_id: string,
}

const userTableData = reactive([]);//用户表格数据
const tablePageSize = ref<number>(5);//表格分页大小
const tableCurrentPage = ref<number>(1);//表格当前页码
const roleData = reactive([]);//角色数据
const dialogDisplayStatus = ref<boolean>(false);//是否展示编辑用户弹窗
const dialogType = ref<string>('');//弹窗类型
const modifyUserFormRef = ref<FormInstance>();//编辑用户表单引用
let modifyUserFormData = reactive<UserDataInterface>({//编辑用户表单数据
    _id: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    role_id: '',
});
const modifyUserFormRules = reactive({
    username: [
        {required: true, message: '用户名必须输入'},
        {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名应由字母、数字、下划线组成'},
        {min: 4, max: 12, message: '用户名长度在4位到12位之间'},
    ],
    password: [
        {required: true, message: '密码必须输入'},
        {pattern: /^[a-zA-Z0-9_]+$/, message: '密码应由字母、数字、下划线组成'},
        {min: 4, max: 12, message: '密码长度在4位到12位之间'},
    ],
    phone: [
        {required: true, message: '手机号必须输入'},
        {pattern: /^[0-9]+$/, message: '手机号应只包含数字'},
        {len: 11, message: '手机号长度应为11位'},
    ],
    email: [{required: true, message: '邮箱必须输入'},],
    role_id: [{required: true, message: '必须选择角色'},],
});

//计算属性，弹窗标题
let dialogTitle = computed(() => {
    if (dialogType.value === 'create') return '创建用户';
    if (dialogType.value === 'update') return '修改用户';
    return '';
});
//计算属性，根据表格页码和分页大小，从roleTableData中获取对应子数组返回
let tablePageData = computed(() => {
    const startIndex = tablePageSize.value * (tableCurrentPage.value - 1);
    const endIndex = Math.min(
        tablePageSize.value * tableCurrentPage.value,
        userTableData.length
    );
    return userTableData.slice(startIndex, endIndex);
});

async function reqUserData() {
    const response: any = await ajaxMtd('/manage/user/list');
    if (response.status !== 0) {
        ElMessage.error(response.msg);
        return;
    }
    ElMessage.success('查询用户数据成功');
    userTableData.length = 0;//清空旧数据
    roleData.length = 0;
    userTableData.push(...response.data.users);//插入新数据
    roleData.push(...response.data.roles);
}

function handleDialogConfirm() {
    if (dialogType.value === 'create') handleCreateUser();
    else if (dialogType.value === 'update') handleUpdateUser();
    else handleCloseDialog();
}

function handleCreateUser() {
    if (!dialogDisplayStatus.value) {
        dialogType.value = 'create';//设置弹窗类型
        modifyUserFormRef.value?.clearValidate();//清除表单校验结果
        dialogDisplayStatus.value = true;//打开弹窗
        return;
    }
    modifyUserFormRef.value?.validate(async valid => {
        if (!valid) return;
        const response: any = await ajaxMtd('/manage/user/add', {
            username: modifyUserFormData.username,
            password: modifyUserFormData.password,
            phone: modifyUserFormData.phone,
            email: modifyUserFormData.email,
            role_id: modifyUserFormData.role_id,
        }, 'POST');
        if (response.status !== 0) {
            ElMessage.error(response.msg);
            return;
        }
        ElMessage.success('创建用户成功');
        reqUserData();//重新请求数据
        handleCloseDialog();//关闭弹窗
    });
}

function handleUpdateUser(row?: any) {
    if (!dialogDisplayStatus.value) {
        dialogType.value = 'update';//设置弹窗类型
        modifyUserFormRef.value?.clearValidate();//清除表单校验结果
        dialogDisplayStatus.value = true;//打开弹窗
        /*modifyUserFormData = {
            username: row.username,
            phone: row.phone,
            email: row.email,
            role_id: row.role_id,
        }*/
        //修改时将用户当前数据填入作为默认值，
        //不能用以上注释中的方式赋值，否则会造成表单无法输入
        modifyUserFormData._id = row._id;
        modifyUserFormData.username = row.username;
        modifyUserFormData.phone = row.phone;
        modifyUserFormData.email = row.email;
        modifyUserFormData.role_id = row.role_id;
        return;
    }
    modifyUserFormRef.value?.validate(async valid => {
        if (!valid) return;
        const response: any = await ajaxMtd('/manage/user/update', {
            _id: modifyUserFormData._id,
            username: modifyUserFormData.username,
            phone: modifyUserFormData.phone,
            email: modifyUserFormData.email,
            role_id: modifyUserFormData.role_id,
        }, 'POST');
        if (response.status !== 0) {
            ElMessage.error(response.msg);
            return;
        }
        ElMessage.success('更新用户成功');
        reqUserData();//重新请求数据
        handleCloseDialog();//关闭弹窗
    });
}

function handleCloseDialog() {
    dialogDisplayStatus.value = false;//关闭弹窗
    dialogType.value = '';//清除弹窗类型
    //清除数据对象
    modifyUserFormData._id = '';
    modifyUserFormData.username = '';
    modifyUserFormData.password = '';
    modifyUserFormData.phone = '';
    modifyUserFormData.email = '';
    modifyUserFormData.role_id = '';
}

function handleDeleteUser(row) {
    //询问是否确认删除
    ElMessageBox.confirm(`是否确认删除用户${row.username}？`, 'warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {//点击确定的回调
        const response: any = await ajaxMtd('/manage/user/delete', {userId: row._id}, 'POST');
        if (response.status !== 0) {
            ElMessage.error(response.msg);
            return;
        }
        ElMessage.success('删除用户成功');
        reqUserData();//重新请求数据
    }).catch(() => {//点击取消的回调
        ElMessage.info('取消删除');
    });
}

function userRoleFormatter(row) {
    const role = roleData.find(item => item._id === row.role_id);
    return role ? role.name : "";
}

onMounted(() => {
    reqUserData();
});
</script>

<style scoped lang="less">
.box-card {
  height: 99%;
  overflow-y: scroll;

  .card-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .el-table {
    .el-button {
      margin: 0;
      padding: 0;
      border: 0;
      color: #409EFF;
      background-color: #ffffff00;

      &:first-of-type {
        margin-right: 10px;
      }
    }
  }

  .el-pagination {
    margin-top: 15px;
  }
}
</style>