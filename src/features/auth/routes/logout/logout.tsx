import React, { useEffect } from 'react';

import { useAuthStore } from '$features/auth/store/auth';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

export default observer(function Logout() {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    authStore?.logout();
    navigate('/');
  }, []);

  return <section className="logout"></section>;
});
