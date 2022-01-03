import { cn } from '$lib/utils';

import styles from './ErrorFallback.module.css';

export const ErrorFallback = ({ error }) => {
  // ***************************************************************************
  // Add observability of react errors here
  // ***************************************************************************
  console.error(error);
  return (
    <div className={cn(styles.errorFallback)}>
      <h1>App crashed 😢</h1>
      <pre className="error">{error.message}</pre>
    </div>
  );
};

export default ErrorFallback;
