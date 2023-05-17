<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <el-button type="primary" @click="handleCreateRole">
                    <el-icon>
                        <Plus/>
                    </el-icon>
                    <span>创建角色</span>
                </el-button>
                <el-button type="primary" :disabled="authBtnDisabled"
                           @click="handleAuthRole">
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
        <!--创建角色弹窗-->
        <el-dialog :model-value="dialogDisplayStatus===1" width="500"
                   title="创建角色" @close="handleCancelDialog">
            <el-form ref="createRoleFormRef" :model="createRoleFormData">
                <el-form-item prop="roleName" label="角色名称"
                              :rules="[{required:true,message:'角色名称必须输入'}]">
                    <el-input type="text" v-model="createRoleFormData.roleName"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="create-dialog-footer">
                    <el-button class="cancel-btn" @click="handleCancelDialog">取消</el-button>
                    <el-button type="primary" @click="handleCreateRole">确定</el-button>
                </div>
            </template>
        </el-dialog>
        <!--设置角色权限弹窗-->
        <el-dialog :model-value="dialogDisplayStatus===2" width="500"
                   title="设置角色权限" @close="handleCancelDialog">
            <el-form ref="authRoleFormRef" :model="authRoleFormData">
                <el-form-item prop="roleName" label="角色名称">
                    <el-input type="text" disabled v-model="selectedRowData.name"/>
                </el-form-item>
                <el-form-item prop="menus" label="角色权限">
                    <el-tree ref="authRoleTree"
                             show-checkbox default-expand-all check-on-click-node
                             :data="treeData" :props="treeProps" node-key="key"
                             :expand-on-click-node="false"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="auth-dialog-footer">
                    <el-button class="cancel-btn" @click="handleCancelDialog">取消</el-button>
                    <el-button type="primary" @click="handleAuthRole">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import {Edit, Plus} from "@element-plus/icons-vue";
import {ElMessage, ElTable, ElTree} from "element-plus";
import type {FormInstance} from "element-plus";

import ajaxMtd from "@/utils/ajax";
import {timeFormatter} from "@/utils/tools";
import {useCurrentUserStore} from "@/stores/CurrentUser";

const currentUserStore = useCurrentUserStore();//当前登陆用户数据
const roleTableRef = ref<InstanceType<typeof ElTable>>();
const roleTableData = reactive([]);
const selectedRowIndex = ref<string>('');//表格被选中行的索引
let selectedRowData = reactive<any>({});//表格被选中行的数据
const authBtnDisabled = ref<boolean>(true);//设置权限按钮是否禁用
const tablePageSize = ref<number>(5);//表格分页大小
const tableCurrentPage = ref<number>(1);//表格当前页码
const dialogDisplayStatus = ref<number>(0);//弹窗展示状态，0-隐藏，1-展示创建弹窗，2-展示授权弹窗
const createRoleFormRef = ref<FormInstance>();//创建角色表单引用
const authRoleFormRef = ref<FormInstance>();//角色授权表单引用
let createRoleFormData = reactive({roleName: ''});//创建角色表单数据对象
let authRoleFormData = reactive({//角色表授权单数据对象
    roleName: '', menus: []
});
const authRoleTree = ref<InstanceType<typeof ElTree>>();//授权弹窗中树形组件引用
const treeData = [//树形控件数据
    {label: "首页", key: '/home'},
    {
        label: "商品", key: '/cate_prod', children: [
            {label: "品类管理", key: '/category'},
            {label: "商品管理", key: '/product'},
        ]
    },
    {label: "用户管理", key: '/user'},
    {label: "角色管理", key: '/role'}
];
const treeProps = {children: 'children', label: 'label'};

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

function handleCreateRole() {
    if (dialogDisplayStatus.value === 0) {
        dialogDisplayStatus.value = 1;//打开弹窗
        createRoleFormRef.value?.clearValidate();//清除表单校验结果
        return;
    }
    //校验表单
    createRoleFormRef.value?.validate(async valid => {
        if (!valid) return;
        const response: any = await ajaxMtd('/manage/role/add', {roleName: createRoleFormData.roleName}, 'POST');
        if (response.status !== 0) {
            ElMessage.error(response.msg);
            return;
        }
        ElMessage.success('创建角色成功');
        reqRoleData();//重新查询数据
        handleCancelDialog();//关闭弹窗
    });
}

async function handleAuthRole() {
    if (dialogDisplayStatus.value === 0) {
        dialogDisplayStatus.value = 2;//打开弹窗
        //修改dialogDisplayStatus后需要更新组件，通过nextTick在界面更新后再调用setCheckedKeys
        nextTick(() => authRoleTree.value?.setCheckedKeys(selectedRowData.menus));
        return;
    }
    const response: any = await ajaxMtd('/manage/role/update', {
        _id: selectedRowData._id,
        menus: authRoleTree.value?.getCheckedKeys(),
        auth_name: currentUserStore.curUser.username
    }, 'POST');
    if (response.status !== 0) {
        ElMessage.error(response.msg);
        return;
    }
    ElMessage.success('创建角色成功');
    roleTableRef.value.setCurrentRow(undefined);//取消选中的行
    //清空选中行的索引和数据
    selectedRowIndex.value = '';
    selectedRowData = {};
    authBtnDisabled.value = true;//禁用设置权限按钮
    reqRoleData();//重新查询数据
    dialogDisplayStatus.value = 0;//关闭弹窗
}

function handleCancelDialog() {
    dialogDisplayStatus.value = 0;//关闭弹窗
    createRoleFormRef.value?.resetFields();//重置表单
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