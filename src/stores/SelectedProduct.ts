import {defineStore} from "pinia";
import {reactive} from "vue";

interface ProductDetail {
    _id: string,
    categoryId: string,
    pCategoryId: string,
    name: string,
    desc: string,
    price: number | undefined,
    detail: string,
    imgs: string[]
}

export const useSelectedProductStore = defineStore('selectedProduct', () => {
    const targetProduct = reactive<ProductDetail>({
        _id: '',
        categoryId: '',
        pCategoryId: '',
        name: '',
        desc: '',
        price: undefined,
        detail: '',
        imgs: []
    });
    return {targetProduct};
}, {persist: true});