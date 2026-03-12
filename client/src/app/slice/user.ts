import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch } from '../store.ts';
import { postRequest } from "../../utils/fetch.ts";
import { fetchCart } from './cart.ts';
import { LoginParamsType, LoginResponseType, UserStateType, TokenType } from '../../utils/type.ts';

export function getUserInfo(token: string): UserStateType {
  if (token) {
    const tokenParts = token.split('.');
    const encodedPayload = tokenParts[1];
    const decodedPayload = atob(encodedPayload);
    const userInfo: TokenType = JSON.parse(decodedPayload) as TokenType;
    return {
      token: token,
      id: userInfo.user,
      role: userInfo.role
    }
  }
  return {
    token: '',
    id: '',
    role: ''
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState: getUserInfo(localStorage.getItem('token') || ''),
  reducers: {
    updateUser: (state, action: PayloadAction<{token: string, id: string, role: string}>) => {
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.role = action.payload.role;
    },
  },
});

export const { updateUser } = userSlice.actions;

export const doLogin = (data: LoginParamsType) => async (dispatch: AppDispatch) => {
  try {
    const res: LoginResponseType = await postRequest<LoginResponseType>('/auth/login', data);
    console.log(res);
    localStorage.setItem('token', res.token);
    const info: UserStateType = getUserInfo(res.token);
    dispatch(updateUser(info));
    if (info.role === 'Customer' || info.role === 'Admin')
      await dispatch(fetchCart());
  } catch (e) {
    const msg: string = e as string;
    throw new Error(msg);
  }
};

export default userSlice.reducer;