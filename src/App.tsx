import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import Error from '@/components/ui/Error';
import Cart from '@/components/features/cart/Cart';
import CreateOrder, {
  action as createOrderAction,
} from '@/components/features/order/CreateOrder';
import Order, {
  loader as orderLoader,
} from '@/components/features/order/Order';
import { action as updateOrderAction } from '@/components/features/order/UpdateOrder';
import ProductDetail, {
  loader as productDetailLoader,
} from '@/components/features/products/ProductDetail';
import ProductsList from '@/components/features/products/ProductsList';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/components/ui/Home';

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
        element: <ProductsList />,
        errorElement: <Error />,
      },
      {
        path: ROUTES.PRODUCT_DETAIL,
        element: <ProductDetail />,
        loader: productDetailLoader,
        errorElement: <Error />,
      },
      { path: ROUTES.CART, element: <Cart /> },
      {
        path: ROUTES.CREATE_ORDER,
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: ROUTES.ORDER_DETAIL,
        element: <Order />,
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
