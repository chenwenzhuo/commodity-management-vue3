<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <el-button type="primary">
                    <el-icon>
                        <Plus/>
                    </el-icon>
                    <span>创建角色</span>
                </el-button>
                <el-button type="primary" :disabled="authBtnDisabled">
                    <el-icon>
                        <Edit/>
                    </el-icon>
                    <span>设置角色权限</span>
                </el-button>
            </div>
        </template>
        <el-table ref="roleTableRef" :data="tablePageData"
                  highlight-current-row border
                  @row-click="handleTableRowClick"
                  :row-class-name="tableRowClassName">
            <el-table-column label="" width="60" align="center">
                <template #default="scope">
                    <el-radio :label="scope.$index" v-model="selectedRowIndex">
                        {{ '' }}<!--el-radio内容区域绑定一个空字符串，否则label值会显示在radio按钮后，不美观-->
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column label='角色名称' property="name" align="center"/>
            <el-table-column label='创建时间' property="create_time" align="center">
                <template #default="scope">{{ timeFormatter(scope.row.create_time) }}</template>
            </el-table-column>
            <el-table-column label='授权人' property="auth_name" align="center"/>
            <el-table-column label='授权时间' property="auth_time" align="center">
                <template #default="scope">{{ timeFormatter(scope.row.auth_time) }}</template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="->, prev, pager, next, sizes"
                       :total="roleTableData.length" :page-sizes="[5,10,20]"
                       v-model:page-size="tablePageSize"
                       v-model:current-page="tableCurrentPage"/>
    </el-card>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {Edit, Plus} from "@element-plus/icons-vue";
import {ElMessage, ElTable} from "element-plus";

import ajaxMtd from "@/utils/ajax";
import {timeFormatter} from "@/utils/tools";

const roleTableRef = ref<InstanceType<typeof ElTable>>();
const roleTableData = reactive([]);
const selectedRowIndex = ref<string>('');//表格被选中行的索引
let selectedRowData = reactive({});//表格被选中行的数据
const authBtnDisabled = ref<boolean>(true);//设置权限按钮是否禁用
const tablePageSize = ref<number>(5);//表格分页大小
const tableCurrentPage = ref<number>(1);//表格当前页码

//计算属性，根据表格页码和分页大小，从roleTableData中获取对应子数组返回
let tablePageData = computed(() => {
    const startIndex = tablePageSize.value * (tableCurrentPage.value - 1);
    const endIndex = Math.min(
        tablePageSize.value * tableCurrentPage.value,
        roleTableData.length
    );
    return roleTableData.slice(startIndex, endIndex);
});

async function reqRoleData() {
    const response: any = await ajaxMtd('/manage/role/list');
    if (response.status !== 0) {
        ElMessage.error(response.msg);
        return;
    }
    ElMessage.success('查询角色信息成功');
    console.log('----------response.data', response.data);
    roleTableData.length = 0;
    roleTableData.push(...response.data);
}

function handleTableRowClick(row) {
    //若当前有一行被选中，且此次点击的是选中的行，则取消选中
    if (selectedRowIndex.value !== '' &&
        selectedRowIndex.value === row.index) {
        roleTableRef.value.setCurrentRow(undefined);//取消选中的行
        //清空选中行的索引和数据
        selectedRowIndex.value = '';
        selectedRowData = {};
        authBtnDisabled.value = true;//禁用设置权限按钮
    } else {
        roleTableRef.value.setCurrentRow(row);//选中当前行
        //记录当前行的索引和数据
        selectedRowIndex.value = row.index;
        selectedRowData = row;
        authBtnDisabled.value = false;//启用设置权限按钮
    }
}

//用于获取表格行的下标，添加到表格数据对象上
function tableRowClassName({row, rowIndex}) {
    row.index = rowIndex;
    return '';
}

onMounted(() => {
    reqRoleData();
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

  .el-pagination {
    margin-top: 20px;
  }
}
</style>