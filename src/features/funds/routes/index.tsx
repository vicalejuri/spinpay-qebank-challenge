import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const FundsStoreProvider = lazy(() =>
  import('$features/funds/store/funds').then((module) => ({ default: module.FundsStoreProvider }))
);
const AtmStoreProvider = lazy(() =>
  import('$features/atm/store/atm').then((module) => ({ default: module.AtmStoreProvider }))
);

const RequireAuth = lazy(() => import('$features/auth/hooks/RequireAuth'));

const PancakeStackLayout = lazy(() => import('$lib/layouts/PancakeStack/PancakeStack'));
const Header = lazy(() => import('$components/Header/Header'));
const FundsHome = lazy(() => import('./home/home'));
const Deposit = lazy(() => import('./deposit/deposit'));
const Withdraw = lazy(() => import('./withdraw/withdraw'));
const Statement = lazy(() => import('./statement/statement'));

const FundsRoutes: RouteObject[] = [
  {
    path: '/funds',
    element: (
      <FundsStoreProvider>
        <RequireAuth>
          <PancakeStackLayout first={<Header />} />
        </RequireAuth>
      </FundsStoreProvider>
    ),
    children: [
      { index: true, element: <FundsHome /> },
      { path: 'deposit', element: <Deposit /> },
      {
        path: 'withdraw',
        element: (
          <AtmStoreProvider>
            <Withdraw />
          </AtmStoreProvider>
        )
      },
      { path: 'statement', element: <Statement /> }
    ]
  }
];

export default FundsRoutes;
