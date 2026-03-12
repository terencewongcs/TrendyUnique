import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartsType } from '../../utils/type';
import { AppDispatch } from '../store';
import { getRequest, postRequest, patchRequest, deleteRequest } from '../../utils/fetch';

const initialCartState: CartsType = { items: [], totalPrice: 0 };

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    carts: initialCartState,
    totalProducts: 0,
  },
  reducers: {
    updateCarts: (state, action: PayloadAction<CartsType>) => {
      state.carts = action.payload;
    },
    updateTotalProducts: (state, action: PayloadAction<number>) => {
      state.totalProducts = action.payload;
    },
  },
});

export const { updateCarts, updateTotalProducts } = cartSlice.actions;

const countItems = (cart: CartsType) =>
  cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const fetchCart = () => async (dispatch: AppDispatch) => {
  const res: CartsType = await getRequest<CartsType>('/api/carts');
  dispatch(updateCarts(res));
  dispatch(updateTotalProducts(countItems(res)));
};

export const addOneToCart = (productId: string) => async (dispatch: AppDispatch) => {
  const res: CartsType = await postRequest<CartsType>(`/api/carts/${productId}`);
  dispatch(updateCarts(res));
  dispatch(updateTotalProducts(countItems(res)));
};

export const updateOneToCart = (productId: string, quantity: number) => async (dispatch: AppDispatch) => {
  const res: CartsType = await patchRequest<CartsType>(`/api/carts/${productId}`, { quantity });
  dispatch(updateCarts(res));
  dispatch(updateTotalProducts(countItems(res)));
};

export const deleteOneFromCart = (productId: string) => async (dispatch: AppDispatch) => {
  const res: CartsType = await deleteRequest<CartsType>(`/api/carts/${productId}`);
  dispatch(updateCarts(res));
  dispatch(updateTotalProducts(countItems(res)));
};

export default cartSlice.reducer;
