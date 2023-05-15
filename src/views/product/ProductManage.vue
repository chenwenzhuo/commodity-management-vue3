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
                <span class="header-title">{{ pageTitle }}</span>
            </div>
        </template>
        <el-form ref="productFormRef" :model="productFormData"
                 :rules="formRules">
            <el-form-item label="商品名称" prop="name" label-width="80px">
                <el-col :span="8" style="min-width: 150px; max-width: 400px">
                    <el-input type="text" v-model="productFormData.name" autocomplete="off"/>
                </el-col>
            </el-form-item>
            <el-form-item label="商品描述" prop="desc" label-width="80px">
                <el-col :span="8" style="min-width: 150px; max-width: 400px">
                    <el-input type="text" v-model="productFormData.desc" autocomplete="off"/>
                </el-col>
            </el-form-item>
            <el-form-item label="商品价格" prop="price" label-width="80px">
                <el-col :span="8" style="min-width: 150px; max-width: 400px">
                    <el-input type="text" v-model="productFormData.price" autocomplete="off">
                        <template #prefix>¥</template>
                        <template #suffix>元</template>
                    </el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="商品分类" prop="categories" label-width="80px">
                <el-col :span="8" style="min-width: 150px; max-width: 400px">
                    <el-cascader :options="cascaderOptions" v-model="productFormData.categories"
                                 :props="{checkStrictly:true}" clearable/>
                </el-col>
            </el-form-item>
            <el-form-item label="商品图片" label-width="80px">
                <el-col :span="16" style="min-width: 300px; max-width: 800px">
                    <el-upload action="http://localhost:7638/ajaxPrefix/manage/img/upload"
                               v-model:file-list="productFormData.imgs" list-type="picture-card"
                               accept="image/*" name="image" :limit="3"
                               :class="{hide_box:(productFormData.imgs.length>=3)}"
                               :on-success="handleImgSuccess"
                               :on-remove="handleImgRemove"
                               :on-preview="handleImgPreview">
                        <el-icon>
                            <Plus/>
                        </el-icon>
                    </el-upload>
                </el-col>
            </el-form-item>
            <el-form-item label="商品详情" label-width="80px">
                <el-col :span="20">
                    <Editor api-key="4515omdv5d7e77zr7j0d7jmvinghrt82ccsj9491qtgnjpe2"
                            :init="{plugins: 'lists link image table code help wordcount'}"
                            v-model="productFormData.detail"/>
                </el-col>
            </el-form-item>
            <el-form-item label="" label-width="80px">
                <el-button type="primary" @click="handleSubmitForm"
                           class="submit-btn">
                    提交
                </el-button>
            </el-form-item>
        </el-form>
        <el-dialog v-model="dialogVisible" title="图片预览">
            <img :src="dialogImgUrl" alt=""/>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";
import {Back, Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import Editor from "@tinymce/tinymce-vue";

import {useSelectedProductStore} from "@/stores/SelectedProduct";
import ajaxMtd from "@/utils/ajax";
import router from "@/router";

const selectedProductStore = useSelectedProductStore();//存储商品信息的store对象
const productFormRef = ref<FormInstance>();//表单ref引用对象
let productFormData = reactive({//表单数据绑定对象
    name: '',
    desc: '',
    price: '',
    categories: [],
    imgs: [],
    detail: '',
});
const formRules = reactive<FormRules>({
    name: [{required: true, message: '商品名称必须输入'}],
    desc: [{required: true, message: '商品描述必须输入'}],
    price: [
        {required: true, message: '商品价格必须输入'},
        {validator: validatePrice}
    ],
    categories: [{required: true, message: '商品分类必须输入'}],
});
let cascaderOptions = reactive([]);//商品分类级联选择器的选项数组
const dialogVisible = ref<boolean>(false);//图片预览弹窗是否可见
const dialogImgUrl = ref<string>('');//图片预览弹窗中的url

//计算属性，根据是否有商品信息来确定页面标题、当前功能
const currentFunc = computed(() => selectedProductStore.targetProduct._id === '' ? 'add' : 'update');
const pageTitle = computed(() => selectedProductStore.targetProduct._id === '' ? '添加商品' : '修改商品');

//查询指定父分类下的子分类
async function reqCategories(parentId: string) {
    //查询分类信息
    const response: any = await ajaxMtd('/manage/category/list', {parentId});
    if (response.status !== 0) {//查询出错，提示
        ElMessage.error('获取商品分类出错');
        return;
    }
    //查询成功，根据结果初始化级联选择器的选项数组
    initCascaderOptions(response.data, parentId);
    return cascaderOptions;
}

function initCascaderOptions(categories: any[], parentId: string) {
    if (parentId === '0') {//parentId为0，则当前categories数组为一级分类
        //将categories数组映射为选项数组
        const options = categories.map(item => {
            return {
                value: item._id,
                label: item.name,
                children: []
            }
        });
        cascaderOptions.length = 0;
        cascaderOptions.push(...options);
    } else {//当前categories数组为子分类时
        //寻找当前parentId对应的父分类项
        cascaderOptions.forEach(item => {
            if (item.value !== parentId) return;
            const childrenOptions = categories.map(child => {
                return {
                    value: child._id,
                    label: child.name,
                }
            });
            item.children.length = 0;
            item.children.push(...childrenOptions);
        });
    }
}

function handleImgSuccess(file) {
    if (file.status === 0) {
        //upload组件默认会将本地文件信息对象向绑定的file-list数组中存入一份，
        //若此处直接将file.data push进去，会导致同一张图片在照片墙中显示两次
        //所以需要用后端返回的文件信息对象替换掉本地文件信息对象
        setTimeout(() => productFormData.imgs.splice(productFormData.imgs.length - 1, 1, file.data));
    }
}

async function handleImgRemove(file) {
    if (file.status === 'success') {
        const response: any = await ajaxMtd('/manage/img/delete', {name: file.name}, 'POST');
        if (response.status === 0) {
            const filteredImgs = productFormData.imgs.filter(item => item.name !== file.name);
            productFormData.imgs.length = 0;//清空原数组
            productFormData.imgs.push(...filteredImgs);
        } else {
            ElMessage.error('删除图片失败');
        }
    }
}

function handleImgPreview(img) {
    dialogVisible.value = true;
    dialogImgUrl.value = img.url;
}

function handleSubmitForm() {
    productFormRef.value?.validate(async validate => {
        if (!validate) return;

        const reqData: any = {//组装请求数据
            name: productFormData.name,
            desc: productFormData.desc,
            price: productFormData.price,
            detail: productFormData.detail,
            pCategoryId: productFormData.categories.length === 1 ?
                '0' : productFormData.categories[0],
            categoryId: productFormData.categories.length === 1 ?
                productFormData.categories[0] : productFormData.categories[1],
            imgs: productFormData.imgs.map(item => item.name),
        };
        if (currentFunc.value === 'update') {//若为修改，则还需要商品id
            reqData._id = selectedProductStore.targetProduct._id;
        }
        const url = `/manage/product/${currentFunc.value}`;
        const response: any = await ajaxMtd(url, reqData, 'POST');
        if (response.status !== 0) {
            ElMessage.error(`${currentFunc.value === 'add' ? '新增' : '修改'}商品失败`);
            return;
        }
        ElMessage.success(`${currentFunc.value === 'add' ? '新增' : '修改'}商品成功`);
        handleBackToHome();
    });
}

function handleBackToHome() {
    //返回主页前清空pinia中商品数据
    selectedProductStore.$patch({
        targetProduct: {
            _id: '',
            categoryId: '',
            pCategoryId: '',
            name: '',
            desc: '',
            price: undefined,
            detail: '',
            imgs: []
        }
    });
    router.replace('/product');
}

function validatePrice(rule: any, value: any, callback: any) {
    if (!value)
        return callback(new Error('商品价格必须输入'));
    if (isNaN(Number(value))) {
        callback(new Error('商品价格应为数字'));
    } else if (Number(value) <= 0) {
        callback(new Error('商品价格应大于0'));
    }
    callback();
}

onMounted(() => {
    //修改商品时，初始化表单绑定对象
    if (currentFunc.value === 'update') {
        productFormData.name = selectedProductStore.targetProduct.name;
        productFormData.desc = selectedProductStore.targetProduct.desc;
        productFormData.price = String(selectedProductStore.targetProduct.price);
        productFormData.detail = selectedProductStore.targetProduct.detail;
        productFormData.categories.push(
            selectedProductStore.targetProduct.pCategoryId,
            selectedProductStore.targetProduct.categoryId,
        );
        const imgInfos = selectedProductStore.targetProduct.imgs.map((img, index) => ({
            uid: -index, name: img, status: 'done',
            url: 'http://localhost:5001/upload/' + img
        }));
        productFormData.imgs.push(...imgInfos);
    }
    //查询所有一级、二级分类
    reqCategories('0').then(result => result?.forEach(item => reqCategories(item.value)));
});
</script>

<style scoped lang="less">
//用于隐藏upload组件上传按钮
.hide_box /deep/ .el-upload--picture-card {
  display: none;
}

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
      font-size: 24px;
      color: #409EFF;
      background-color: #ffffff00;
    }

    .header-title {
      font-size: 24px;
    }
  }

  .submit-btn {
    font-size: 18px;
    background-color: #409EFF;
    margin-top: 20px;
    padding: 20px;
  }
}
</style>
