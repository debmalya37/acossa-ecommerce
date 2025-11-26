

export const ADMIN_DASHBOARD = '/admin/dashboard'
export const ADMIN_MEDIA_SHOW= '/admin/media'
export const ADMIN_MEDIA_EDIT=(id:any)=>id ? `/admin/media/edit/${id}` : ''

export const ADMIN_CATEGORY_ADD= '/admin/category/add'
export const ADMIN_CATEGORY_SHOW= '/admin/category'
export const ADMIN_CATEGORY_EDIT=(id:any)=>id ? `/admin/category/edit/${id}` : ''

export const ADMIN_TRASH='/admin/trash'


//product routes
export const ADMIN_PRODUCT_ADD= '/admin/product/add'
export const ADMIN_PRODUCT_SHOW= '/admin/product'
export const ADMIN_PRODUCT_EDIT=(id:any)=>id ? `/admin/product/edit/${id}` : ''


//product variant routes
export const ADMIN_PRODUCT_VARIANT_ADD= '/admin/productvariant/add'
export const ADMIN_PRODUCT_VARIANT_SHOW= '/admin/productvariant'
export const ADMIN_PRODUCT_VARIANT_EDIT=(id:any)=>id ? `/admin/productvariant/edit/${id}` : ''


//coupon routes
export const ADMIN_COUPON_ADD= '/admin/coupon/add'
export const ADMIN_COUPON_SHOW= '/admin/coupon'
export const ADMIN_COUPON_EDIT=(id:any)=>id ? `/admin/coupon/edit/${id}` : ''





//coupon routes
export const ADMIN_CUSTOMERS_SHOW= '/admin/customers'





//review routes
export const ADMIN_REVIEWS_SHOW= '/admin/review'

