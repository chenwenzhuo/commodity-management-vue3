<template>
    <el-card class="box-card">
        <!--头部工具栏，包含搜索商品功能和添加商品按钮-->
        <template #header>
            <div class="card-header">
                <div class="header-search">
                    <el-select v-model="searchMethod">
                        <el-option value="productName" label="按名称搜索">按名称搜索</el-option>
                        <el-option value="productDesc" label="按描述搜索">按描述搜索</el-option>
                    </el-select>
                    <el-input type="text" v-model="searchKeyword" placeholder="请输入关键词" autocomplete="off"/>
                    <el-button type="primary" @click="handleSearchProduct">
                        <el-icon>
                            <Search/>
                        </el-icon>
                        <span>搜索</span>
                    </el-button>
                </div>
                <!--handleAddModifyProduct中根据参数确定添加/修改商品，若不传undefined，框架默认传入事件对象，无法与数据对象row区分-->
                <el-button type="primary" @click="handleAddModifyProduct(undefined)">
                    <el-icon>
                        <Plus/>
                    </el-icon>
                    <span>添加商品</span>
                </el-button>
            </div>
        </template>
        <!--主体部分，展示商品信息-->
        <!--为每一个el-table-column设置min-width属性，属性值会作为比例，分配剩余宽度-->
        <el-table :data="productTableData" style="width: 100%" border :header-cell-style="{ 'text-align': 'center' }">
            <el-table-column prop="name" label="商品名称" min-width="200"/>
            <el-table-column prop="desc" label="商品描述" min-width="600"/>
            <!--“价格”、“状态”列需要对数据进行格式化后再展示-->
            <el-table-column label="价格" align="center" min-width="100">
                <template #default="scope">{{ `¥ ${scope.row.price}` }}</template>
            </el-table-column>
            <el-table-column label="状态" align="center" min-width="100">
                <template #default="scope">
                    {{ scope.row.status === 1 ? '在售' : (scope.row.status === 0 ? '已下架' : '状态异常') }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="150">
                <template #default="scope">
                    <el-button type="primary" class="table-op-btn"
                               @click="handleViewProductDetail(scope.row)">
                        详情
                    </el-button>
                    <el-button type="primary" class="table-op-btn"
                               @click="handleAddModifyProduct(scope.row)">
                        修改
                    </el-button>
                    <el-button type="primary" class="table-op-btn"
                               @click="handleUpdateProductStatus(scope.row)">
                        {{ scope.row.status === 1 ? '下架' : '上架' }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--element-plus的表格组件不自带分页功能，需要借助单独的分页组件-->
        <!--layout属性中的 -> 符号用于调整布局，->后的元素会靠右显示-->
        <el-pagination background :total="totalProducts"
                       layout="->,prev,pager,next,sizes"
                       :page-sizes="[5,10,20]"
                       v-model:current-page="tablePageNum"
                       v-model:page-size="tablePageSize"
                       @current-change="reqProductData"
                       @size-change="reqProductData"
                       style="margin-top: 15px"/>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {Plus, Search} from "@element-plus/icons-vue";

import ajaxMtd from "@/utils/ajax";
import {useSelectedProductStore} from "@/stores/SelectedProduct";
import router from "@/router";

const selectedProductStore = useSelectedProductStore();
const searchMethod = ref<string>('productName');//搜索方式，默认值为按名称搜索
const searchKeyword = ref<string>('');//搜索关键词
const productTableData = reactive([]);//产品表格数据
const tablePageNum = ref<number>(1);//产品表格当前分页
const tablePageSize = ref<number>(10);//产品表格当前分页大小
const totalProducts = ref<number>(0);//商品总数，用于表格分页

async function reqProductData() {//查询商品数据
    const response: any = await ajaxMtd('/manage/product/list', {
        pageNum: tablePageNum.value,
        pageSize: tablePageSize.value,
    });
    productTableData.length = 0;//每次查询，都清空表格数据
    if (response.status !== 0) {
        ElMessage.error(response.msg);
        return;
    }
    ElMessage.success('查询商品数据成功');
    productTableData.push(...response.data.list);//更新表格数据
    totalProducts.value = response.data.total;//更新商品总数
}

async function handleSearchProduct() {
    const response: any = await ajaxMtd('/manage/product/search', {
        pageNum: tablePageNum.value,
        pageSize: tablePageSize.value,
        searchType: searchMethod.value,
        productName: searchKeyword.value,
        productDesc: searchKeyword.value,
    });
    if (response.status !== 0) {
        ElMessage.error(response.msg);
        return;
    }
    ElMessage.success('搜索产品成功');
    productTableData.length = 0;//清空商品数组
    productTableData.push(...response.data.list);//更新表格数据
    totalProducts.value = response.data.total;//更新商品总数
}

function handleViewProductDetail(row) {
    //将当前商品的数据存入pinia
    selectedProductStore.$patch({
        targetProduct: {
            _id: row._id,
            categoryId: row.categoryId,
            pCategoryId: row.pCategoryId,
            name: row.name,
            desc: row.desc,
            detail: row.detail,
            imgs: row.imgs,
        }
    });
    router.push('/product/detail');//跳转到详情界面
}

function handleAddModifyProduct(row) {
    if (row) {//row为有效值，则当前为更新，将当前商品的数据存入pinia
        selectedProductStore.$patch({
            targetProduct: {
                _id: row._id,
                categoryId: row.categoryId,
                pCategoryId: row.pCategoryId,
                name: row.name,
                desc: row.desc,
                price: row.price,
                detail: row.detail,
                imgs: row.imgs,
            }
        });
    }
    router.push('/product/manage');//跳转到详情界面
}

async function handleUpdateProductStatus(row) {
    const response: any = await ajaxMtd('/manage/product/updateStatus', {
        productId: row._id,
        status: (row.status === 0 ? 1 : 0)
    }, 'POST');
    if (response.status !== 0) {
        ElMessage.error(response.msg);
        return;
    }
    ElMessage.success(`${row.status === 0 ? '上架' : '下架'}成功`);
    reqProductData();//重新请求数据
}

onMounted(() => {
    reqProductData();//组件挂载时查询商品数据
});
</script>

<style scoped lang="less">
.box-card {
  height: 99%;
  overflow-y: scroll;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-search {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .el-select {
        width: 120px;
      }

      .el-input {
        width: 180px;
        margin: 0 10px;
      }
    }

    .el-button { //可同时选中搜索和添加商品按钮
      background-color: #409EFF;
    }
  }

  .table-op-btn {
    margin: 0;
    padding: 0;
    border: 0;
    color: #409EFF;
    background-color: #ffffff00;

    &:nth-child(2) {
      margin: 0 10px;
    }
  }

  //修改el-pagination背景色
  .el-pagination {
    --el-color-primary: #409EFF;
  }
}
</style>
