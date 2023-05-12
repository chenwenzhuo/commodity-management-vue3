import {createRouter, createWebHistory} from 'vue-router'

import {useCurrentUserStore} from "@/stores/CurrentUser";

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
                {path: '/home', component: () => import('../views/Home.vue')},
                {path: '/category', component: () => import('../views/Category.vue')},
                {path: '/product', component: () => import('../views/product/Product.vue')},
                {path: '/role', component: () => import('../views/Role.vue')},
                {path: '/user', component: () => import('../views/User.vue')},
            ]
        },
    ]
})

export default router
