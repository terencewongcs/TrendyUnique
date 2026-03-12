import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { postRequest } from '../../utils/fetch';
import { fetchCart } from './cart';
import { LoginParamsType, LoginResponseType, UserStateType, TokenType } from '../../utils/type';

export function getUserInfo(token: string): UserStateType {
  if (token) {
    const parts = token.split('.');
    const payload: TokenType = JSON.parse(atob(parts[1])) as TokenType;
    return { token, id: payload.user, role: payload.role };
  }
  return { token: '', id: '', role: '' };
}

export const userSlice = createSlice({
  name: 'user',
  initialState: getUserInfo(localStorage.getItem('token') || ''),
  reducers: {
    updateUser: (state, action: PayloadAction<UserStateType>) => {
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
    localStorage.setItem('token', res.token);
    const info = getUserInfo(res.token);
    dispatch(updateUser(info));
    if (info.role === 'Customer') {
      await dispatch(fetchCart());
    }
  } catch (e) {
    throw new Error(e as string);
  }
};

export default userSlice.reducer;
