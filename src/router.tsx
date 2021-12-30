import { FundsStoreProvider } from '$features/funds/store/funds';
import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const PancakeStackLayout = lazy(() => import('./lib/layouts/PancakeStack/PancakeStack'));
const Header = lazy(() => import('./components/Header/Header'));
const FundsHome = lazy(() => import('./features/funds/routes/home/home'));
const Deposit = lazy(() => import('./features/funds/routes/deposit/deposit'));
const Withdraw = lazy(() => import('./features/funds/routes/withdraw/withdraw'));
const Statement = lazy(() => import('./features/funds/routes/statement/statement'));
const Login = lazy(() => import('./features/auth/routes/login/login'));
const Logout = lazy(() => import('./features/auth/routes/logout/logout'));

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/auth" element={<PancakeStackLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route
          path="/funds"
          element={
            <FundsStoreProvider>
              <PancakeStackLayout first={<Header />} />
            </FundsStoreProvider>
          }
        >
          <Route index element={<FundsHome />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="statement" element={<Statement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
