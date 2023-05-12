<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span v-if="parentCateId==='0'" style="font-size: 20px">一级分类列表</span>
                <span v-else class="card-title">
                    <el-button link type="primary" class="header-category-btn"
                               @click="backToMainList">
                        一级分类列表
                    </el-button>
                    <el-icon :size="20"><Right/></el-icon>
                    <span style="font-size: 20px">
                        {{ selectedCategory ? selectedCategory.name : '' }}
                    </span>
                </span>
                <el-button class="add-cate-btn" type="primary">
                    <el-icon>
                        <Plus/>
                    </el-icon>
                    <span>添加分类</span>
                </el-button>
            </div>
        </template>
        <el-table :data="cateTableData" border>
            <el-table-column prop="name" label="商品名称"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button link type="primary" style="color: #1DA57A">修改分类名称</el-button>
                    <el-button link type="primary" style="color: #1DA57A"
                               @click="viewSubCate(scope.row)"
                               v-show="parentCateId==='0'">
                        查看子分类
                    </el-button>
                    <el-button link type="primary" style="color: #1DA57A">删除分类</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
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

//计算属性，根据parentCateId切换品类表格需要加载的数据
let cateTableData = computed(() => {
    return parentCateId.value === '0' ? categoriesData : subCategoriesData;
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

function viewSubCate(row) {
    parentCateId.value = row._id;
    selectedCategory = row;
    reqCategories();//查询子分类数据
}

function backToMainList() {
    parentCateId.value = '0';
    selectedCategory = null;
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
