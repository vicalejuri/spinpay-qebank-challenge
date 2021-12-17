import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

// const App = lazy(() => import('./components/App/App'));
const PancakeStackLayout = lazy(() => import('./features/box/layouts/PancakeStack/PancakeStack'));
const Header = lazy(() => import('./components/Header/Header'));
const Home = lazy(() => import('./features/box/routes/home/home'));
const Statement = lazy(() => import('./features/box/routes/statement/statement'));

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={({ error }) => <div>Something went wrong {error.message}</div>}>
        <Router>
          <Routes>
            <Route path="/" element={<PancakeStackLayout first={Header} />}>
              <Route index element={<Home />} />
              <Route path="/statement" element={<Statement />} />
            </Route>
          </Routes>
        </Router>
      </ErrorBoundary>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
