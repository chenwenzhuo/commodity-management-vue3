import {defineStore} from "pinia";
import {reactive} from "vue";

interface User {
    _id: String,
    username: String,
    phone: String,
    email: String,
    create_time: number,
    role_id: String,
    role: object
}

export const useCurrentUserStore = defineStore('curUser', () => {
    let curUser: User = reactive({
        _id: '',
        username: '',
        phone: '',
        email: '',
        create_time: 0,
        role_id: '',
        role: {}
    });
    return {curUser}
}, {persist: true});//persist选项用于将user数据持久化
