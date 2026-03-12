import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartsType } from '../../utils/type.ts';
import { AppDispatch } from "../store.ts";
import { getRequest, postRequest, patchRequest, deleteRequest } from "../../utils/fetch.ts";

const initialCartState: CartsType = {
  items: [],
  totalPrice: 0
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    carts: initialCartState,
    totalProducts: 0
  },
  reducers: {
    updateCarts: (state, action: PayloadAction<CartsType>) => {
      state.carts = action.payload;
    },
    updateTotalProducts: (state, action: PayloadAction<number>) => {
      state.totalProducts = action.payload;
    }
  },
});

export const { updateCarts, updateTotalProducts } = cartSlice.actions;

export const fetchCart = () => async (dispatch: AppDispatch) => {
  try {
    const res: CartsType = await getRequest<CartsType>('/api/carts');
    console.log(res);
    let count = 0;
    for (const item of res.items) {
      count += item.quantity;
    }
    dispatch(updateCarts(res));
    dispatch(updateTotalProducts(count));
  } catch (e) {
    const msg: string = e as string;
    throw new Error(msg);
  }
};

export const addOneToCart = (productId: string) => async (dispatch: AppDispatch) => {
  try {
    const res: CartsType = await postRequest<CartsType>(`/api/carts/${productId}`);
    console.log(res);
    let count = 0;
    for (const item of res.items) {
      count += item.quantity;
    }
    dispatch(updateCarts(res));
    dispatch(updateTotalProducts(count));
  } catch (e) {
    const msg: string = e as string;
    throw new Error(msg);
  }
};

export const updateOneToCart = (productId: string, quantity: number) => async (dispatch: AppDispatch) => {
  try {
    const res: CartsType = await patchRequest<CartsType>(`/api/carts/${productId}`, {quantity: quantity});
    console.log(res);
    let count = 0;
    for (const item of res.items) {
      count += item.quantity;
    }
    dispatch(updateCarts(res));
    dispatch(updateTotalProducts(count));
  } catch (e) {
    const msg: string = e as string;
    throw new Error(msg);
  }
};

export const deleteOneFromCart = (productId: string) => async (dispatch: AppDispatch) => {
  try {
    const res: CartsType = await deleteRequest<CartsType>(`/api/carts/${productId}`);
    console.log(res);
    let count = 0;
    for (const item of res.items) {
      count += item.quantity;
    }
    dispatch(updateCarts(res));
    dispatch(updateTotalProducts(count));
  } catch (e) {
    const msg: string = e as string;
    throw new Error(msg);
  }
};

export default cartSlice.reducer;