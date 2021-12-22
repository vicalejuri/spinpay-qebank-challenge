import React, { createContext, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import './lib/styles/textStyles.css';

// import StoreProvider from './lib/stores';
// import RequireAuth from '$features/auth/hooks/RequireAuth';

if (process.env.NODE_ENV === 'development') {
  (async function mock() {
    const { worker } = await import('./mocks/browser');
    worker.start({
      onUnhandledRequest: 'bypass'
    });
  })();
}

const StoreProvider = lazy(() => import('./lib/stores'));
const PancakeStackLayout = lazy(() => import('./lib/layouts/PancakeStack/PancakeStack'));
const Header = lazy(() => import('./components/Header/Header'));
const FundsHome = lazy(() => import('./features/funds/routes/home/home'));
const Deposit = lazy(() => import('./features/funds/routes/deposit/deposit'));
const Withdraw = lazy(() => import('./features/funds/routes/withdraw/withdraw'));
const Statement = lazy(() => import('./features/funds/routes/statement/statement'));
const Login = lazy(() => import('./features/auth/routes/login/login'));
const Logout = lazy(() => import('./features/auth/routes/logout/logout'));

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={({ error }) => <pre>Something went wrong: {error.message}</pre>}>
        <StoreProvider>
          <Router>
            <Routes>
              <Route index element={<Login />} />
              <Route path="/auth" element={<PancakeStackLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="logout" element={<Logout />} />
              </Route>
              <Route path="/funds" element={<PancakeStackLayout first={<Header />} />}>
                <Route index element={<FundsHome />} />
                <Route path="deposit" element={<Deposit />} />
                <Route path="withdraw" element={<Withdraw />} />
                <Route path="statement" element={<Statement />} />
              </Route>
            </Routes>
          </Router>
        </StoreProvider>
      </ErrorBoundary>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
