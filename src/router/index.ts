import {createRouter, createWebHistory} from 'vue-router'

import {useCurrentUserStore} from "@/stores/CurrentUser";
import {useCurMenuStore} from "@/stores/CurrentMenu";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/Login.vue'),
            beforeEnter: (to, from, next) => {
                const curUserStore = useCurrentUserStore();
                //若已有用户数据，表示当前已登陆，跳转到主页
                if (curUserStore.curUser.username) {
                    next('/');
                } else {
                    next();
                }
            }
        },
        {
            path: '/',
            name: 'admin',
            component: () => import('../views/Admin.vue'),
            beforeEnter: (to, from, next) => {
                const curUserStore = useCurrentUserStore();
                //若没有用户数据，表示当前未登陆，跳转到登陆页
                if (!curUserStore.curUser.username) {
                    next('/login');
                } else {
                    next();
                }
            },
            children: [
                {
                    path: '/home', component: () => import('../views/Home.vue'),
                    beforeEnter: (to, from, next) => {
                        const curMenuStore = useCurMenuStore();
                        curMenuStore.setCurMenuName('首页');
                        curMenuStore.setCurMenuIndex('1');
                        next();
                    }
                },
                {
                    path: '/category', component: () => import('../views/Category.vue'),
                    beforeEnter: (to, from, next) => {
                        const curMenuStore = useCurMenuStore();
                        curMenuStore.setCurMenuName('品类管理');
                        curMenuStore.setCurMenuIndex('2-1');
                        next();
                    }
                },
                {
                    path: '/product', component: () => import('../views/product/Product.vue'),
                    beforeEnter: (to, from, next) => {
                        const curMenuStore = useCurMenuStore();
                        curMenuStore.setCurMenuName('商品管理');
                        curMenuStore.setCurMenuIndex('2-2');
                        next();
                    },
                    children: [
                        {path: '', component: () => import('../views/product/ProductHome.vue')},
                        {path: 'detail', component: () => import('../views/product/ProductDetail.vue')},
                        {path: 'manage', component: () => import('../views/product/ProductManage.vue')},
                    ]
                },
                {
                    path: '/role', component: () => import('../views/Role.vue'),
                    beforeEnter: (to, from, next) => {
                        const curMenuStore = useCurMenuStore();
                        curMenuStore.setCurMenuName('角色管理');
                        curMenuStore.setCurMenuIndex('3');
                        next();
                    }
                },
                {
                    path: '/user', component: () => import('../views/User.vue'),
                    beforeEnter: (to, from, next) => {
                        const curMenuStore = useCurMenuStore();
                        curMenuStore.setCurMenuName('用户管理');
                        curMenuStore.setCurMenuIndex('4');
                        next();
                    }
                },
                {
                    path: '', name: 'redirect-by-auth', redirect: to => {
                        //根据用户菜单权限进行重定向
                        const curUserStore: any = useCurrentUserStore();
                        const userMenus = curUserStore.curUser.role.menus;
                        if (curUserStore.curUser.username === 'admin' || userMenus.includes('/home'))
                            return {path: '/home'};
                        if (userMenus.includes('/category')) return {path: '/category'};
                        if (userMenus.includes('/product')) return {path: '/product'};
                        if (userMenus.includes('/role')) return {path: '/role'};
                        if (userMenus.includes('/user')) return {path: '/user'};
                        return {path: '/home'};
                    }
                },
            ]
        },
    ]
})

export default router
