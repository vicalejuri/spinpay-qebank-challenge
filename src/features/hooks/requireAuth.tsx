import { useAuthStore } from '$features/auth/store';
import { Navigate } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

/**
 * Hook for constraining a Route to only authenticated users
 */
export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const authStore = useAuthStore();

  if (!authStore?.authenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  return children;
};

export default observer(RequireAuth);
