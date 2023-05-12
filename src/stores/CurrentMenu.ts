import {defineStore} from "pinia";
import {ref} from "vue";

export const useCurMenuStore = defineStore('curMenu', () => {
    let curMenuName = ref('');

    function setCurMenuName(menuName: string): void {
        curMenuName.value = menuName;
    }

    return {curMenuName, setCurMenuName};
});