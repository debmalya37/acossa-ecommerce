import { createSlice } from "@reduxjs/toolkit";

const calculateFinalPrice = (item: any) => {
  const baseTotal = item.sellingPrice * item.qty;

  const addonTotal =
    item.addons?.reduce((sum: number, addon: any) => {
      let price = addon.basePrice || 0;
      if (addon.option) price += addon.option.price || 0;
      return sum + price;
    }, 0) || 0;

  return baseTotal + addonTotal;
};

const initialState = {
  count: 0,
  products: [] as any[],
};

export const cartReducer = createSlice({
  name: "cartStore",
  initialState,
  reducers: {
    addIntoCart: (state, action) => {
      const payload = action.payload;

      const existingIndex = state.products.findIndex(
        (p) =>
          p.productId === payload.productId &&
          p.variantId === payload.variantId
      );

      if (existingIndex < 0) {
        payload.finalPrice = calculateFinalPrice(payload);
        state.products.push(payload);
      }

      state.count = state.products.length;
    },

    increaseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;

      const item = state.products.find(
        (p) => p.productId === productId && p.variantId === variantId
      );

      if (item) {
        item.qty += 1;
        item.finalPrice = calculateFinalPrice(item);
      }
    },

    decreaseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;

      const item = state.products.find(
        (p) => p.productId === productId && p.variantId === variantId
      );

      if (item && item.qty > 1) {
        item.qty -= 1;
        item.finalPrice = calculateFinalPrice(item);
      }
    },

    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;

      state.products = state.products.filter(
        (p) => !(p.productId === productId && p.variantId === variantId)
      );

      state.count = state.products.length;
    },

    clearCart: (state) => {
      state.products = [];
      state.count = 0;
    },
  },
});

export const {
  addIntoCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartReducer.actions;

export default cartReducer.reducer;
