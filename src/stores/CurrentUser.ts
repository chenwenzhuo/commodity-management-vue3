import {defineStore} from "pinia";
import {reactive} from "vue";

interface User {
    username: String,
    password: String,
    phone: String,
    email: String,
    create_time: String,
    role_id: String,
}

export const useCurrentUserStore
    = defineStore('curUser', () => {
    let curUser: User = reactive({
        username: '',
        password: '',
        phone: '',
        email: '',
        create_time: '',
        role_id: '',
    });

    function saveUser(user: User): void {
        curUser = user;
    }

    function clearUser(): void {
        curUser = {
            username: '',
            password: '',
            phone: '',
            email: '',
            create_time: '',
            role_id: '',
        };
    }

    return {curUser, saveUser, clearUser}
})