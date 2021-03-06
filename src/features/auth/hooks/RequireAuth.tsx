import React from 'react';
import { useNavigate } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import { useAuthStore } from '$features/auth/store/auth';

/**
 * Hook for constraining a Route to only authenticated users
 */
export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  if (!authStore?.authenticated) {
    // Redirect them to the /login page
    React.useEffect(() => {
      return (() => {
        navigate('/auth/login', { state: { from: '' } });
      })();
    });
  }

  return children;
};

export default observer(RequireAuth);
