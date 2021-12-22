import React, { useEffect } from 'react';

import { useAuthStore } from '$features/auth/store';

export default function Logout() {
  const authStore = useAuthStore();

  useEffect(() => {
    authStore?.deleteAuthTokenSession();
  }, []);

  return <section className="logout">Logout</section>;
}
