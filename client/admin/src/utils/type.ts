export interface UserStateType {
  token: string;
  id: string;
  role: string;
}

export interface TokenType {
  user: string;
  role: string;
}

export interface LoginParamsType {
  email: string;
  password: string;
}

export interface LoginResponseType {
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
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
}

export interface ProductCreateType {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ProductPageType {
  data: ProductType[];
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface CustomerBasic {
  _id: string;
  username: string;
  email: string;
}

export interface OrderItemType {
  product: ProductType;
  quantity: number;
  price: number;
}

export interface OrderType {
  _id: string;
  customer: CustomerBasic;
  vendor: string;
  items: OrderItemType[];
  totalPrice: number;
  status: 'Pending' | 'Delivering' | 'Delivered';
  shippingAddress: string;
  createdAt: string;
}
