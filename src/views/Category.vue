<template>
    <el-card class="box-card">
        <!--卡片头部，左侧展示标题，右侧为添加分类按钮-->
        <template #header>
            <div class="card-header">
                <!--列表中展示一级分类时，标题仅为文字-->
                <span v-if="parentCateId==='0'" style="font-size: 20px">一级分类列表</span>
                <!--否则列表中展示的是二级分类，则展示一个按钮用于返回一级列表，以及当前父分类名称-->
                <span v-else class="card-title">
                    <el-button link type="primary" class="header-category-btn"
                               @click="handleBackToMainList">
                        一级分类列表
                    </el-button>
                    <el-icon :size="20"><Right/></el-icon><!--右箭头图标-->
                    <span style="font-size: 20px">
                        {{ selectedCategory ? selectedCategory.name : '' }}
                    </span>
                </span>
                <!--添加分类按钮-->
                <el-button class="add-cate-btn" type="primary"
                           @click="handleAddCate">
                    <el-icon>
                        <Plus/>
                    </el-icon>
                    <span>添加分类</span>
                </el-button>
            </div>
        </template>
        <!--品类数据表格-->
        <el-table :data="cateTableData" border>
            <el-table-column prop="name" label="商品名称"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button link type="primary" style="color: #1DA57A"
                               @click="handleUpdateCate(scope.row)">
                        修改分类名称
                    </el-button>
                    <el-button link type="primary" style="color: #1DA57A"
                               @click="handleViewSubCate(scope.row)"
                               v-show="parentCateId==='0'"><!--仅当展示一级分类时，显示“查看子分类”按钮-->
                        查看子分类
                    </el-button>
                    <el-button link type="primary" style="color: #1DA57A"
                               @click="handleDeleteCate(scope.row)">
                        删除分类
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--对话框，同时用于新增、修改分类-->
        <el-dialog :title="dialogTitle" width="30%"
                   :model-value="dialogDisplayStatus!==0"
                   @close="onDialogClose">
            <el-form ref="categoryFormRef" :model="categoryFormData"
                     status-icon :rules="categoryFormRules">
                <!--新增分类时展示“所属分类”表单项，表示新分类的父分类-->
                <el-form-item label="所属分类" prop="parentId" v-if="dialogDisplayStatus===2">
                    <el-select v-model="categoryFormData.parentId" autocomplete="off"
                               placeholder="请选择所属分类" style="width: 100%">
                        <el-option value="0" label="一级分类">一级分类</el-option>
                        <el-option v-for="item in categoriesData" :key="item._id"
                                   :value="item._id" :label="item.name">
                            {{ item.name }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input type="text" v-model="categoryFormData.categoryName"
                              placeholder="请输入分类名称" autocomplete="off"
                              style="width: 100%"/>
                </el-form-item>
            </el-form>
            <!--对话框footer插槽，包含确定、取消按钮-->
            <template #footer>
                 <span class="dialog-footer">
                     <el-button class="cancel-btn" @click="onDialogClose">取消</el-button>
                     <el-button type="primary" class="confirm-btn"
                                @click="handleDialogConfirm">
                         确定
                     </el-button>
                 </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage, ElMessageBox} from "element-plus";
import {Plus, Right} from "@element-plus/icons-vue";
import ajaxMtd from "@/utils/ajax";

interface Category {
    __v: number,
    _id: string,
    name: string,
    parentId: string
}

let categoriesData = reactive([]);//一级分类表格数据
let subCategoriesData = reactive([]);//二级分类表格数据
let parentCateId = ref('0');//当前分类列表的父分类id
let selectedCategory = reactive<Category | null>(null);//当前被选择的行的数据
let dialogDisplayStatus = ref<number>(0);//对话框展示状态，0-隐藏，1-修改分类，2-添加分类
const categoryFormRef = ref<FormInstance>();//新增/修改分类表单引用对象
let categoryFormData = reactive({//新增/修改分类表单数据
    parentId: '',
    categoryName: '',
});
//新增/修改分类表单校验规则
const categoryFormRules = reactive<FormRules>({
    parentId: [{required: true, message: '请选择父分类'}],
    categoryName: [{required: true, message: '请输入分类名称'}],
});

//计算属性，根据parentCateId切换品类表格需要加载的数据
let cateTableData = computed(() => {
    return parentCateId.value === '0' ? categoriesData : subCategoriesData;
});
//计算属性，新增/修改品类对话框的标题
let dialogTitle = computed(() => {
    if (dialogDisplayStatus.value === 1) {
        return '修改分类';
    } else if (dialogDisplayStatus.value === 2) {
        return '新增分类';
    }
    return '';//对话框隐藏时标题为空
});

async function reqCategories() {
    const response: any = await ajaxMtd('/manage/category/list', {parentId: parentCateId.value});
    if (response.status !== 0) {//出错时进行提示
        ElMessage.error(response.msg);
        return;
    }
    //成功时更新数据
    ElMessage.success('查询分类信息成功');
    if (parentCateId.value === '0') {
        categoriesData.length = 0;//清空数组
        categoriesData.push(...response.data);
    } else {
        subCategoriesData.length = 0;//清空数组
        subCategoriesData.push(...response.data);
    }
}

//对话框点击确定时的回调
function handleDialogConfirm() {
    if (dialogDisplayStatus.value === 1) {
        handleUpdateCate();//更新时调用
    } else {
        handleAddCate();//添加时调用
    }
}

function handleUpdateCate(row?: any) {
    if (dialogDisplayStatus.value === 0) {//对话框为隐藏，则打开对话框
        dialogDisplayStatus.value = 1;
        selectedCategory = row;//打开对话框时记录数据
        categoryFormData.categoryName = row.name;
        return;
    }
    categoryFormRef.value?.validate(async (valid) => {
        if (!valid) return;
        const response: any = await ajaxMtd('/manage/category/update', {
            categoryId: (selectedCategory as Category)._id,//断言selectedCategory为Category类型
            categoryName: categoryFormData.categoryName
        }, 'POST');
        if (response.status !== 0) {//更新失败时提示
            ElMessage.error(response.msg);
            return;
        }
        ElMessage.success('更新分类成功');
        reqCategories();//重新请求分类数据
        categoryFormRef.value?.resetFields();//清空表单
        categoryFormData.categoryName = '';//重置表单绑定的数据对象
        dialogDisplayStatus.value = 0;//隐藏对话框
    });
}

function handleAddCate() {
    if (dialogDisplayStatus.value === 0) {//对话框为隐藏，则打开对话框
        dialogDisplayStatus.value = 2;
        categoryFormRef.value?.clearValidate();//清除校验结果
        return;
    }
    categoryFormRef.value?.validate(async (valid) => {
        if (!valid) return;
        const response: any = await ajaxMtd('/manage/category/add', {
            parentId: categoryFormData.parentId,
            categoryName: categoryFormData.categoryName,
        }, 'POST');
        if (response.status !== 0) {//添加失败时提示
            ElMessage.error(response.msg);
            return;
        }
        ElMessage.success('更新分类成功');
        reqCategories();//重新请求分类数据
        categoryFormRef.value?.resetFields();//清空表单
        categoryFormData = {//重置表单绑定的数据对象
            parentId: '',
            categoryName: ''
        };
        dialogDisplayStatus.value = 0;//隐藏对话框
    });
}

function handleViewSubCate(row) {
    parentCateId.value = row._id;
    selectedCategory = row;
    reqCategories();//查询子分类数据
}

function handleDeleteCate(row) {
    ElMessageBox.confirm(`是否确认删除分类${row.name}？`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {//点击确认时走then中逻辑
        const response: any = await ajaxMtd('/manage/category/delete', {categoryId: row._id}, 'POST');
        if (response.status !== 0) {
            ElMessage.error(response.msg);
            return;
        }
        ElMessage.success('删除分类成功');
        reqCategories();//重新请求数据
    }).catch(() => {//点击取消时走catch中逻辑
    });
}

function handleBackToMainList() {
    parentCateId.value = '0';
    selectedCategory = null;
}

function onDialogClose() {
    dialogDisplayStatus.value = 0;//隐藏对话框
    categoryFormData = {
        parentId: '',
        categoryName: ''
    };
}

onMounted(() => {
    reqCategories();//组件挂载时请求数据
})
</script>

<style scoped lang="less">
.box-card {
  height: 99%;
  overflow-y: scroll;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      display: flex;
      align-items: center;
    }

    .header-category-btn {
      color: #1DA57A;
      font-size: 20px
    }

    .add-cate-btn {
      background-color: #1DA57A;
      font-size: 16px;
      padding: 18px;
    }
  }
}

.text-button {
  margin: 0;
  padding: 0;
  border: 0;
  background-color: rgba(255, 255, 255, 0);
  color: #1DA57A;
  cursor: pointer;
}
</style>
