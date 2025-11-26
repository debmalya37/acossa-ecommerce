export const WEBSITE_HOME = "/";
export const WEBSITE_LOGIN = "/auth/login";
export const WEBSITE_REGISTER = "/auth/register";
export interface ProductDetailsFn {
    (SLUG?: string): string;
}

export const PRODUCT_DETAILS: ProductDetailsFn = (SLUG?: string) =>
    SLUG ? `/product/${SLUG}` : "/product";