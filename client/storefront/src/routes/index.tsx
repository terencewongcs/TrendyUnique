import { createBrowserRouter } from 'react-router-dom';
import App from '../pages/App';
import ErrorPage from '../pages/Error';
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import CartPage from '../pages/CartPage';
import Checkout from '../pages/Checkout';
import OrderHistory from '../pages/OrderHistory';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'product/:id', element: <ProductDetail /> },
      {
        path: 'cart',
        element: <ProtectedRoute role="Customer"><CartPage /></ProtectedRoute>,
      },
      {
        path: 'checkout',
        element: <ProtectedRoute role="Customer"><Checkout /></ProtectedRoute>,
      },
      {
        path: 'orders',
        element: <ProtectedRoute role="Customer"><OrderHistory /></ProtectedRoute>,
      },
      { path: 'signin', element: <Signin /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
]);

export default router;
