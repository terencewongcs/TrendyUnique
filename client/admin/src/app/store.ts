import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/user';
import globalReducer from './slice/global';

const store = configureStore({
  reducer: {
    user: userReducer,
    global: globalReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
