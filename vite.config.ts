import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        //element-plus按需引入配置
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 7638,//修改启动端口号
        proxy: {
            '/ajaxPrefix': {
                target: 'http://localhost:5001',
                //用于控制请求头中的host值。为true时，将host值替换为target属性值，为false时不进行替换
                changeOrigin: true,
                //URL中 /ajaxPrefix 前缀是为解决跨域额外添加的，将其替换为空字符串
                rewrite: path => path.replace(/^\/ajaxPrefix/, ''),
            }
        }
    }
});
