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
                    <el-button type="primary">
                        <el-icon>
                            <Search/>
                        </el-icon>
                        <span>搜索</span>
                    </el-button>
                </div>
                <el-button type="primary">
                    <el-icon>
                        <Plus/>
                    </el-icon>
                    <span>添加商品</span>
                </el-button>
            </div>
        </template>
        <!--主体部分，展示商品信息-->
        <!--为每一个el-table-column设置min-width属性，属性值会作为比例，分配剩余宽度-->
        <el-table :data="productTableData" style="width: 100%" border>
            <el-table-column prop="name" label="商品名称" min-width="200"/>
            <el-table-column prop="desc" label="商品描述" min-width="600"/>
            <!--“价格”、“状态”列需要对数据进行格式化后再展示-->
            <el-table-column label="价格" align="center" min-width="100">
                <template #default="scope">{{ `¥ ${scope.row.price}` }}</template>
            </el-table-column>
            <el-table-column label="状态" align="center" min-width="100">
                <template #default="scope">
                    {{ scope.row.status === 1 ? '在售' : (scope.row.status === 2 ? '已下架' : '状态异常') }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="150">
                <template #default="scope">
                    <el-button type="primary" class="table-op-btn">详情</el-button>
                    <el-button type="primary" class="table-op-btn">修改</el-button>
                    <el-button type="primary" class="table-op-btn">
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
    console.log('----------product data', response.data);
    productTableData.push(...response.data.list);//更新表格数据
    totalProducts.value = response.data.total;//更新商品总数
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
      background-color: #1DA57A;
    }
  }

  .table-op-btn {
    margin: 0;
    padding: 0;
    border: 0;
    color: #1DA57A;
    background-color: #ffffff00;

    &:nth-child(2) {
      margin: 0 10px;
    }
  }

  //修改el-pagination背景色
  :deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: #1DA57A;
  }
}
</style>
