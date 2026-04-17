export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ProductImageSet {
  main: string;
  hover: string;
  gallery: string[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImageSet;
  description: string;
  inStock: boolean;
  isNew: boolean;
  tags: string[];
  unitPrice?: number;
  soldOut?: boolean;
  mainImage?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  mainImage?: string;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  cart: CartItem[];
  priority: boolean;
  status: string;
  estimatedDelivery: string;
  priorityPrice?: number;
  orderPrice?: number;
  position?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface UserPosition {
  latitude?: number;
  longitude?: number;
}

export interface User {
  username: string;
  position: UserPosition;
  address: string;
  status: LoadingStatus;
  error: string;
}

export interface Category {
  id: string;
  slug: string;
  label: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
  };
}

export type CreateOrderPayload = Omit<Order, 'id'>;
