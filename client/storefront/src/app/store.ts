import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/user';
import globalReducer from './slice/global';
import searchReducer from './slice/search';
import cartReducer from './slice/cart';

const store = configureStore({
  reducer: {
    user: userReducer,
    global: globalReducer,
    search: searchReducer,
    cart: cartReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
