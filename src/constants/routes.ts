export const ROUTES = {
  HOME: "/",
  BLOG: "/blog",
  BLOG_ARTICLE: "/blog/:articleId",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",
  CART: "/cart",
  CREATE_ORDER: "/order/new",
  ORDER_CONFIRMATION: "/order/confirmation/:orderId",
  ORDER_DETAIL: "/order/:orderId",
} as const;
