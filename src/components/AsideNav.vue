<template>
    <div class="aside-nav-header">
        <img src="../assets/imgs/mall-logo.png" alt=""/>
        <span>商品管理系统</span>
    </div>
    <el-menu
            active-text-color="#ffd04b"
            background-color="#081524"
            text-color="#ffffff"
            :default-active="currentMenuStore.curMenuIndex"
            @select="onSelectMenu"
    >
        <el-menu-item index="1" v-if="menuItemDisplay.home">
            <el-icon :size="30">
                <HomeFilled/>
            </el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="2" v-if="menuItemDisplay.category||menuItemDisplay.product">
            <template #title>
                <el-icon :size="30">
                    <MoreFilled/>
                </el-icon>
                <span>商品</span>
            </template>
            <el-menu-item index="2-1" v-if="menuItemDisplay.category">
                <el-icon :size="30">
                    <Paperclip/>
                </el-icon>
                <span>品类管理</span>
            </el-menu-item>
            <el-menu-item index="2-2" v-if="menuItemDisplay.product">
                <el-icon :size="30">
                    <Present/>
                </el-icon>
                <span>商品管理</span>
            </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="3" v-if="menuItemDisplay.role">
            <el-icon :size="30">
                <Menu/>
            </el-icon>
            <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="4" v-if="menuItemDisplay.user">
            <el-icon :size="30">
                <UserFilled/>
            </el-icon>
            <span>用户管理</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup lang="ts">
import {
    HomeFilled, Menu, Paperclip, Present, MoreFilled, UserFilled
} from "@element-plus/icons-vue";
import router from "@/router";
import {useCurrentUserStore} from "@/stores/CurrentUser";
import {useCurMenuStore} from "@/stores/CurrentMenu";
import {computed} from "vue";

let curActiveMenuIndex = '1';
const currentUserStore = useCurrentUserStore();
const currentMenuStore = useCurMenuStore();

//计算属性，一个对象，属性分别表示是否渲染对应菜单选项
let menuItemDisplay = computed(() => {
    //admin用户拥有所有权限
    if (currentUserStore.curUser.username === 'admin')
        return {home: true, category: true, product: true, role: true, user: true};
    return {
        home: currentUserStore.curUser.role.menus.includes('/home'),
        category: currentUserStore.curUser.role.menus.includes('/category'),
        product: currentUserStore.curUser.role.menus.includes('/product'),
        role: currentUserStore.curUser.role.menus.includes('/role'),
        user: currentUserStore.curUser.role.menus.includes('/user'),
    }
});

function onSelectMenu(index: string): void {
    if (index === curActiveMenuIndex)
        return;
    curActiveMenuIndex = index;
    switch (index) {
        case '1':
            router.push('/home');
            break;
        case '2-1':
            router.push('/category');
            break;
        case '2-2':
            router.push('/product');
            break;
        case '3':
            router.push('/role');
            break;
        case '4':
            router.push('/user');
            break;
        default:
            console.error('menu index有误');
            break;
    }
}
</script>

<style scoped lang="less">
.aside-nav-header {
  height: 80px;
  background-color: #081524;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #c9c9c9;

  img {
    width: 70px;
    margin-right: 15px;
  }

  span {
    font-size: 30px;
    font-weight: bold;
    color: #ffffff;
  }
}

.el-menu {
  padding: 20px 15px;
}
</style>