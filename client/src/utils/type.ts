export interface UserStateType {
  token: string,
  id: string,
  role: string
}

export interface TokenType {
  user: string,
  role: string
}

export interface LoginParamsType {
  email: string,
  password: string,
}

export interface LoginResponseType {
  token: string;
  user: User;
}

interface User {
  Id: string;
  username: string;
  email: string;
  orders: [];
  _v: number;
}

export interface ProductType {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  owner: string;
  createdAt: string;
  cartCount: number;
  _v: number;
}

export interface ProductPageType {
  data: ProductType[];
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface ProductCreateType {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartsItemType {
  product: ProductType,
  quantity: number
}

export interface CartsType {
  items: CartsItemType[],
  totalPrice: number
}