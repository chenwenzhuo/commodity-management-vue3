import {defineStore} from "pinia";
import {ref} from "vue";

export const useCurMenuStore = defineStore('curMenu', () => {
    let curMenuName = ref<string>('');//当前激活的菜单名称
    let curMenuIndex = ref<string>('');//当前激活的菜单在边栏菜单组件中的index

    function setCurMenuName(menuName: string): void {
        curMenuName.value = menuName;
    }

    function setCurMenuIndex(menuIndex: string): void {
        curMenuIndex.value = menuIndex;
    }

    return {curMenuName, setCurMenuName, curMenuIndex, setCurMenuIndex};
});