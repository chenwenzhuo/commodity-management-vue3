<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <el-button @click="handleBackToHome">
                    <el-icon>
                        <Back/>
                    </el-icon>
                    <span>返回主页</span>
                </el-button>
                <span class="header-title">商品详情</span>
            </div>
        </template>
        <div class="card-body">
            <el-row align="middle">
                <el-col :span="4">商品名称：</el-col>
                <el-col :span="20">{{ selectedProductStore.targetProduct.name }}</el-col>
            </el-row>
            <el-row align="middle">
                <el-col :span="4">商品描述：</el-col>
                <el-col :span="20">{{ selectedProductStore.targetProduct.desc }}</el-col>
            </el-row>
            <el-row align="middle">
                <el-col :span="4">所属分类：</el-col>
                <el-col :span="20">
                    <span v-if="pCategoryName!==''">
                        <span>{{ pCategoryName }}</span>
                        <el-icon><Right/></el-icon>
                    </span>
                    <span>{{ categoryName }}</span>
                </el-col>
            </el-row>
            <el-row align="middle">
                <el-col :span="4">商品图片：</el-col>
                <el-col :span="20">
                    <img v-for="(item,index) in selectedProductStore.targetProduct.imgs"
                         :key="index" :src='`http://localhost:5001/upload/${item}`' alt=""
                         @click="handleImgPreview(item)">
                </el-col>
            </el-row>
            <el-row align="middle">
                <el-col :span="4">商品详情：</el-col>
                <el-col :span="20">
                    <span v-html="selectedProductStore.targetProduct.detail"></span>
                </el-col>
            </el-row>
        </div>
        <el-dialog title="图片预览" :model-value="imgPreviewDisplay"
                   @close="handlePreviewClose"
                   width="40%" align-center>
            <img :src='`http://localhost:5001/upload/${selectedImgName}`' alt=""/>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Back, Right} from "@element-plus/icons-vue";

import {useSelectedProductStore} from "@/stores/SelectedProduct";
import ajaxMtd from "@/utils/ajax";
import router from "@/router";

const selectedProductStore = useSelectedProductStore();//当前要展示的商品的store对象
const categoryName = ref<string>('');//当前商品所属分类名称
const pCategoryName = ref<string>('');//当前商品所属分类的父分类名称
const imgPreviewDisplay = ref<boolean>(false);//是否展示图片预览弹窗
const selectedImgName = ref<string>('');//要预览的图片名称

//查询当前商品所属的分类及父分类名称
async function reqCategoryNames() {
    const url = '/manage/category/info';//请求URL
    //使用Promise.all同时发送多个请求
    const responses: any[] = await Promise.all([
        ajaxMtd(url, {categoryId: selectedProductStore.targetProduct.pCategoryId}),
        ajaxMtd(url, {categoryId: selectedProductStore.targetProduct.categoryId}),
    ]);
    pCategoryName.value = responses[0].status === 0 ? responses[0].data.name : '';
    categoryName.value = responses[1].status === 0 ? responses[1].data.name : '';
}

function handleImgPreview(imgName) {
    imgPreviewDisplay.value = true;//展示弹窗
    selectedImgName.value = imgName;//设置图片名称
}

function handlePreviewClose() {
    imgPreviewDisplay.value = false;
}

function handleBackToHome() {
    router.go(-1);//返回主页
}

onMounted(() => {
    reqCategoryNames();//组件挂载时发送请求查询分类名称
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

    .el-button {
      margin: 0;
      padding: 0;
      border: 0;
      color: #1DA57A;
      background-color: #ffffff00;
      font-size: 24px;
    }

    .header-title {
      font-size: 24px;
    }
  }

  .card-body {
    .el-row {
      border-top: 1px solid #dadada;
      padding: 25px 0;

      &:last-child {
        border-bottom: 1px solid #dadada;
      }

      .el-col:first-child { //选中标签行，将字体放大
        font-size: 22px;
        padding-left: 30px;
        max-width: 200px;
      }

      &:nth-child(4) img {
        max-width: 240px;
        margin-right: 20px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .el-dialog img {
    width: 90%;
    margin-left: 5%;
  }
}
</style>
