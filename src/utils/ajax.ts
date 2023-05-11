import axios from "axios";
// @ts-ignore
import {ElMessage} from "element-plus";

export default function ajaxMtd(url: String, data: Object = {}, method: String = 'GET'): Object {
    const URL_PREFIX: String = '/ajaxPrefix';
    return new Promise((resolve) => {
        let promise: Promise<any>;
        if (method === 'GET') {
            promise = axios.get('http://localhost:7638' + URL_PREFIX + url, {params: data});
        } else if (method === 'POST') {
            promise = axios.post('http://localhost:7638' + URL_PREFIX + url, data);
        } else {
            ElMessage.error('Axios请求参数有误');
            return;
        }
        //若请求成功（与后端通信成功），将外层promise置为成功状态，否则置为失败状态
        promise.then(response => {
            resolve(response.data);
        }).catch(error => {
            console.log('----------------------请求出错----------------------');
            console.log(error);
            ElMessage.error('请求出错！' + error.message);
        })
    });
}