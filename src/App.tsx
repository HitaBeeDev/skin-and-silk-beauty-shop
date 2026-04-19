import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import Error from "@/components/ui/Error";
import CartSkeleton from "@/components/ui/CartSkeleton";
import OrderDetailSkeleton from "@/components/ui/OrderDetailSkeleton";
import ProductDetailSkeleton from "@/components/ui/ProductDetailSkeleton";
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";
import RouteSkeleton from "@/components/ui/RouteSkeleton";
import AppLayout from "@/components/layout/AppLayout";
import LinkButton from "@/components/ui/LinkButton";

const Home = lazy(() => import("@/components/ui/Home"));
const Blog = lazy(() => import("@/components/ui/Blog"));
const BlogArticle = lazy(() => import("@/components/ui/BlogArticle"));
import { action as createOrderAction } from "@/routes/createOrder.action";
import { loader as orderLoader } from "@/routes/order.loader";
import { loader as productDetailLoader } from "@/routes/productDetail.loader";

const ProductsList = lazy(
  () => import("@/components/features/products/ProductsList"),
);
const ProductDetail = lazy(
  () => import("@/components/features/products/ProductDetail"),
);
const Cart = lazy(() => import("@/components/features/cart/Cart"));
const CreateOrder = lazy(
  () => import("@/components/features/order/CreateOrder"),
);
const OrderConfirmation = lazy(
  () => import("@/components/features/order/OrderConfirmation"),
);
const Order = lazy(() => import("@/components/features/order/Order"));

function withRouteSuspense(node: JSX.Element): JSX.Element {
  return <Suspense fallback={<RouteSkeleton />}>{node}</Suspense>;
}

function OrderRouteError(): JSX.Element {
  return (
    <div className="mx-auto flex w-[min(100%-2rem,48rem)] flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8">
      <h1 className="font-['Playfair_Display',serif] text-4xl text-[#5a4034]">
        Order not found
      </h1>
      <p className="text-sm leading-7 text-[#5b463d]">
        The order ID you opened doesn&apos;t match an existing saved order.
      </p>
      <LinkButton to={ROUTES.HOME}>Back home</LinkButton>
    </div>
  );
}

function ProductRouteError(): JSX.Element {
  return (
    <div className="mx-auto flex w-[min(100%-2rem,48rem)] flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <h1 className="font-['Playfair_Display',serif] text-4xl text-[#5a4034]">
        Product not found
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[#5b463d]">
        The product you opened is no longer available from this catalog view.
        Browse the full collection to continue exploring.
      </p>
      <div className="mt-6">
        <LinkButton to={ROUTES.PRODUCTS}>Browse Products</LinkButton>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,

    children: [
      {
        path: ROUTES.HOME,
        element: withRouteSuspense(<Home />),
      },
      {
        path: ROUTES.BLOG,
        element: withRouteSuspense(<Blog />),
      },
      {
        path: ROUTES.BLOG_ARTICLE,
        element: withRouteSuspense(<BlogArticle />),
      },
      {
        path: ROUTES.PRODUCTS,
        element: (
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductsList />
          </Suspense>
        ),
        errorElement: <Error />,
      },
      {
        path: ROUTES.PRODUCT_DETAIL,
        element: (
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetail />
          </Suspense>
        ),
        loader: productDetailLoader,
        errorElement: <ProductRouteError />,
      },
      {
        path: ROUTES.CART,
        element: (
          <Suspense fallback={<CartSkeleton />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: ROUTES.CREATE_ORDER,
        element: withRouteSuspense(<CreateOrder />),
        action: createOrderAction,
      },
      {
        path: ROUTES.ORDER_CONFIRMATION,
        element: (
          <Suspense fallback={<OrderDetailSkeleton />}>
            <OrderConfirmation />
          </Suspense>
        ),
        loader: orderLoader,
        errorElement: <OrderRouteError />,
      },
      {
        path: ROUTES.ORDER_DETAIL,
        element: (
          <Suspense fallback={<OrderDetailSkeleton />}>
            <Order />
          </Suspense>
        ),
        loader: orderLoader,
        errorElement: <OrderRouteError />,
      },
    ],
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
