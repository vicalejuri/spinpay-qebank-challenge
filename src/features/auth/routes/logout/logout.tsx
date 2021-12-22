import React, { useEffect } from 'react';

import { useAuthStore } from '$features/auth/store';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

export default observer(function Logout() {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    authStore?.deleteAuthTokenSession();
  }, []);

  return (
    <section className="logout">
      <button onClick={() => navigate('/')}>Voltar</button>
    </section>
  );
});
