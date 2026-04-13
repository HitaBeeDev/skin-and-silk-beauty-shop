export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ProductImageSet {
  main: string;
  hover?: string;
  gallery?: string[];
}

export interface Product {
  id: string | number;
  sku: string;
  name: string;
  category: string;
  price: number;
  images: ProductImageSet;
  description: string;
  inStock: boolean;
  slug?: string;
  compareAtPrice?: number;
  isNew?: boolean;
  tags?: string[];
  unitPrice?: number;
  soldOut?: boolean;
  mainImage?: string;
}

export interface CartItem {
  productId: string | number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  mainImage?: string;
}

export interface Order {
  id: string | number;
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
  id: string | number;
  slug: string;
  label: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
  };
}
