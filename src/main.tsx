import React, { createContext, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';

import { ErrorBoundary } from 'react-error-boundary';

import Router from './router';
const StoreProvider = lazy(() => import('./lib/stores'));

import './lib/styles/textStyles.css';

if (process.env.NODE_ENV === 'development') {
  (async function mock() {
    const { worker } = await import('./mocks/browser');
    worker.start({
      onUnhandledRequest: 'bypass'
    });
  })();
}

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={({ error }) => <pre>Something went wrong: {error.message}</pre>}>
        <StoreProvider>
          <Router />
        </StoreProvider>
      </ErrorBoundary>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
