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
  cartCount: number;
}

export interface ProductPageType {
  data: ProductType[];
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface CartsItemType {
  product: ProductType;
  quantity: number;
}

export interface CartsType {
  items: CartsItemType[];
  totalPrice: number;
}

export interface OrderItemType {
  product: ProductType;
  quantity: number;
  price: number;
}

export interface VendorBasic {
  _id: string;
  username: string;
  email: string;
}

export interface OrderType {
  _id: string;
  customer: string;
  vendor: VendorBasic;
  items: OrderItemType[];
  totalPrice: number;
  status: 'Pending' | 'Delivering' | 'Delivered';
  shippingAddress: string;
  createdAt: string;
}
