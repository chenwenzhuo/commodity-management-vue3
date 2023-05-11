/// <reference types="vite/client" />

//TS2307: Cannot find module './App.vue' or its corresponding type declarations.
//若不添加以下声明，在.ts文件中导入.vue文件时会出现以上报错
declare module '*.vue' {
    import {defineComponent} from 'vue'
    const Component: ReturnType<typeof defineComponent>
    export default Component
}
