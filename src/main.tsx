import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Router from './router';

import Preloader from '$components/Preloader/Preloader';
import ErrorFallback from '$components/ErrorFallback/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

const StoreProvider = lazy(() => import('./lib/stores'));

// if (process.env.NODE_ENV === 'development') {
//   (async function mock() {
//     const { worker } = await import('./mocks/browser');
//     worker.start({
//       onUnhandledRequest: 'bypass'
//     });
//   })();
// }

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<Preloader />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <StoreProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </StoreProvider>
      </ErrorBoundary>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
