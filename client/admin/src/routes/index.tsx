import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../pages/App';
import ErrorPage from '../pages/Error';
import ProductList from '../pages/ProductList';
import ProductFormPage from '../pages/ProductFormPage';
import OrderList from '../pages/OrderList';
import Signin from '../pages/Signin';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/',
    element: <ProtectedRoute><App /></ProtectedRoute>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: 'products', element: <ProductList /> },
      { path: 'products/add', element: <ProductFormPage /> },
      { path: 'products/edit/:id', element: <ProductFormPage /> },
      { path: 'orders', element: <OrderList /> },
    ],
  },
]);

export default router;
