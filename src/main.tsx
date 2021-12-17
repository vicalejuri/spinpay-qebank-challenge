import React, { createContext, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

// import { StoreProvider } from './lib/stores';

const StoreProvider = lazy(() => import('./lib/stores'));
const PancakeStackLayout = lazy(() => import('./lib/layouts/PancakeStack/PancakeStack'));
const Header = lazy(() => import('./components/Header/Header'));
const Home = lazy(() => import('./features/funds/routes/home/home'));
const Deposit = lazy(() => import('./features/funds/routes/deposit/deposit'));
const Withdraw = lazy(() => import('./features/funds/routes/withdraw/withdraw'));
const Statement = lazy(() => import('./features/funds/routes/statement/statement'));

console.log('main.tsx:loaded');
ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={({ error }) => <div>Something went wrong {error.message}</div>}>
        <StoreProvider>
          <Router>
            <Routes>
              <Route path="/" element={<PancakeStackLayout first={<Header />} />}>
                <Route index element={<Home />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/withdraw" element={<Withdraw />} />
                <Route path="/statement" element={<Statement />} />
              </Route>
            </Routes>
          </Router>
        </StoreProvider>
      </ErrorBoundary>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
