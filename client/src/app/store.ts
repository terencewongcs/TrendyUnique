import { configureStore } from '@reduxjs/toolkit'
import useReducer from './slice/user.ts';
import globalReducer from './slice/global.ts';
import searchSlice from "./slice/search.ts";
import cartSlice from './slice/cart.ts';

const store = configureStore({
  reducer: {
    user: useReducer,
    global: globalReducer,
    search: searchSlice,
    cart: cartSlice
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;