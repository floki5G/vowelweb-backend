// ? category
export type ICategory = {
    category_id?: number;
    name: string;
    is_active: boolean;
    is_disabled: boolean;
    is_new: boolean;
};

// ? product
export type IProduct = {
    product_id?: number;
    name: string;
    price: number;
    is_active: boolean;
    is_disabled: boolean;
    is_new: boolean;
};

// ? categoryProduct
export type ICategoryProduct = {
    id?: number;
    category_id: number;
    product_id: number;
    is_active: boolean;
    is_disabled: boolean;
    is_new: boolean;
};