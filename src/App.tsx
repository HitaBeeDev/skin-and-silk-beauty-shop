import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import Error from '@/components/ui/Error';
import RouteSkeleton from '@/components/ui/RouteSkeleton';
import { action as updateOrderAction } from '@/components/features/order/UpdateOrder';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/components/ui/Home';
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
        element: withRouteSuspense(<ProductsList />),
        errorElement: <Error />,
      },
      {
        path: ROUTES.PRODUCT_DETAIL,
        element: withRouteSuspense(<ProductDetail />),
        loader: productDetailLoader,
        errorElement: <Error />,
      },
      { path: ROUTES.CART, element: withRouteSuspense(<Cart />) },
      {
        path: ROUTES.CREATE_ORDER,
        element: withRouteSuspense(<CreateOrder />),
        action: createOrderAction,
      },
      {
        path: ROUTES.ORDER_DETAIL,
        element: withRouteSuspense(<Order />),
        loader: orderLoader,
        errorElement: <Error />,
        action: updateOrderAction,
      },
    ],
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
