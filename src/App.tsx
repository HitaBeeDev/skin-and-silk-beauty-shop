import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import Error from '@/components/ui/Error';
import CartSkeleton from '@/components/ui/CartSkeleton';
import OrderDetailSkeleton from '@/components/ui/OrderDetailSkeleton';
import ProductDetailSkeleton from '@/components/ui/ProductDetailSkeleton';
import ProductGridSkeleton from '@/components/ui/ProductGridSkeleton';
import RouteSkeleton from '@/components/ui/RouteSkeleton';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/components/ui/Home';
import LinkButton from '@/components/ui/LinkButton';
import { action as createOrderAction } from '@/routes/createOrder.action';
import { loader as orderLoader } from '@/routes/order.loader';
import { loader as productDetailLoader } from '@/routes/productDetail.loader';

const ProductsList = lazy(() => import('@/components/features/products/ProductsList'));
const ProductDetail = lazy(() => import('@/components/features/products/ProductDetail'));
const Cart = lazy(() => import('@/components/features/cart/Cart'));
const CreateOrder = lazy(() => import('@/components/features/order/CreateOrder'));
const Order = lazy(() => import('@/components/features/order/Order'));

function withRouteSuspense(node: JSX.Element): JSX.Element {
  return <Suspense fallback={<RouteSkeleton />}>{node}</Suspense>;
}

function OrderRouteError(): JSX.Element {
  return (
    <div>
      <h1>Order not found</h1>
      <p>The order ID you entered doesn&apos;t match an existing order.</p>
      <LinkButton to={ROUTES.HOME}>Search again</LinkButton>
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
        element: <Home />,
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
        errorElement: <Error />,
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
