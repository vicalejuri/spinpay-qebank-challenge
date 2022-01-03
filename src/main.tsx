import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from 'react-error-boundary';
import Preloader from '$components/Preloader/Preloader';

import Router from './router';

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
      <ErrorBoundary FallbackComponent={({ error }) => <pre>Something went wrong: {error.message}</pre>}>
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
