import api from "./api";
const BASE_URL = "/recipes/categories";

export const categoryService = {
    getCategoryById: async (categoryId) => {
        if (typeof categoryId !== 'number' || isNaN(categoryId) || categoryId < 1) {
            return Promise.reject(new Error("categoryId not valid."));
        }
        const response = await api.get(`${BASE_URL}/${categoryId}`);
        return response.data;
    },

    getAllCategories: async () => {
        const response = await api.get(`${BASE_URL}/`);
        return response.data;
    },

    getAllParentCategories: async () => {
        const response = await api.get(`${BASE_URL}/?parent_category_id=1`);
        return response.data;
    },

    getChildCategoriesOfSpecificParent: async (parentCategoryId) => {
        if (typeof parentCategoryId !== 'number' || isNaN(parentCategoryId || parentCategoryId < 2)) {
            return Promise.reject(new Error("parent_category_id not valid."));
        }
        const response = await api.get(`${BASE_URL}/?parent_category_id=${parentCategoryId}`);
        return response.data;
    },

    createCategoryAdmin: async (categoryData) => {
        const response = await api.post(`${BASE_URL}/`, categoryData);
        return response.data;
    },

    updateCategoryAdmin: async (categoryId, categoryData) => {
        if (typeof categoryId !== 'number' || isNaN(categoryId) || categoryId < 1) {
            return Promise.reject(new Error("unit_type_id not valid."));
        };
        const response = await api.put(`${BASE_URL}/${categoryId}/`, categoryData);
        return response.data;
    },

    deleteCategoryAdmin: async (categoryId) => {
        if (typeof categoryId !== 'number' || isNaN(categoryId) || categoryId < 1) {
            return Promise.reject(new Error("unit_type_id not valid."));
        };
        await api.delete(`${BASE_URL}/${categoryId}/`);
        return true;
    }
};