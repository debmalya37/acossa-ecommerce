import { createSlice } from "@reduxjs/toolkit";
import { count } from "console";

const initialState = {
    count: 0,
    products: [] as any[],

}

export const cartReducer = createSlice({
    name: 'cartStore',
    initialState,
    reducers: {
        addIntoCart: (state, action) => {
            const payload = action.payload
            const existingProduct = state.products.findIndex(
                (Product) => Product.productId === payload.productId && Product.variantId === payload.variantId
            )

            if (existingProduct < 0) {
                state.products.push(payload);
                state.count = state.products.length;
            }
        },
        increaseQuantity: (state, action) => {
            const { productId, variantId } = action.payload;
            const existingProduct = state.products.findIndex(
                (Product) => Product.productId === productId && Product.variantId === variantId
            )

            if (existingProduct >= 0) {
                state.products[existingProduct].qty += 1;
            }
        },
        decreaseQuantity: (state, action) => {
            const { productId, variantId } = action.payload;
            const existingProduct = state.products.findIndex(
                (Product) => Product.productId === productId && Product.variantId === variantId
            )

            if (existingProduct >= 0) {
                if (state.products[existingProduct].qty > 1) {
                    state.products[existingProduct].qty -= 1;
                }
            }
        },
        removeFromCart: (state, action) => {
            const { productId, variantId } = action.payload;

            state.products = state.products.filter(
                (product) => product.productId === !(productId && product.variantId === variantId
            ));
            state.count = state.products.length;
        },
        clearCart: (state, action) => {
            state.products = [];
            state.count = 0;
        }
    }
})

export const { addIntoCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = cartReducer.actions;

export default cartReducer.reducer;