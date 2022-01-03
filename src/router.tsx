import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import FundsRoutes from '$features/funds/routes';

const PancakeStackLayout = lazy(() => import('./lib/layouts/PancakeStack/PancakeStack'));
const Login = lazy(() => import('./features/auth/routes/login/login'));
const Logout = lazy(() => import('./features/auth/routes/logout/logout'));

const allRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/auth',
    element: <PancakeStackLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'logout', element: <Logout /> }
    ]
  },
  ...FundsRoutes
];

const Router = () => {
  const routes = useRoutes(allRoutes);
  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      {routes}
    </AnimatePresence>
  );
};

export default Router;
