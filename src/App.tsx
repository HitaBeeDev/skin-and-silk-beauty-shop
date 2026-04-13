import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Error from '@/Components/ui/Error';
import Cart from '@/Components/features/cart/Cart';
import CreateOrder, {
  action as createOrderAction,
} from '@/Components/features/order/CreateOrder';
import Order, {
  loader as orderLoader,
} from '@/Components/features/order/Order';
import { action as updateOrderAction } from '@/Components/features/order/UpdateOrder';
import ProductsList, {
  loader as menuLoader,
} from '@/Components/features/products-list/ProductsList';
import AppLayout from '@/Components/ui/AppLayout';
import Home from '@/Components/ui/Home';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,

    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/products-list',
        element: <ProductsList />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      { path: '/cart', element: <Cart /> },
      {
        path: '/order/new',
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: '/order/:orderId',
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
