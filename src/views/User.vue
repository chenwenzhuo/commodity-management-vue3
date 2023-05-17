<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <el-button type="primary">
                    <el-icon>
                        <Plus/>
                    </el-icon>
                    <span>创建用户</span>
                </el-button>
            </div>
        </template>
        <el-table :data="userTableData">
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
                    <el-button type="primary">修改</el-button>
                    <el-button type="primary">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import {ElMessage} from "element-plus";
import {Plus} from "@element-plus/icons-vue";

import ajaxMtd from "@/utils/ajax";
import {timeFormatter} from "@/utils/tools";

const userTableData = reactive([]);//用户表格数据
const roleData = reactive([]);//角色数据

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
}
</style>