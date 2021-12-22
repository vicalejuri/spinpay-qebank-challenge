import React, { useEffect } from 'react';

import { useAuthStore } from '$features/auth/store';
import { observer } from 'mobx-react-lite';

export default observer(function Logout() {
  const authStore = useAuthStore();

  useEffect(() => {
    authStore?.deleteAuthTokenSession();
  }, []);

  return <section className="logout">Logout</section>;
});
