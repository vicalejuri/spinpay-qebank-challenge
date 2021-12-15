import React, { useState } from 'react';

import logo from './logo.svg';
import styles from './App.module.css';

import { getUserData } from '../../services/accounts/getUserData';

function App() {
  const [count, setCount] = useState(0);

  return (
    <section className={styles.App}>
      <header className={styles['App-header']}>
        <img src={logo} className={styles['App-logo']} alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        env is: {import.meta.env.NODE_ENV}
        <pre>
          <code>{import.meta.env.VITE_ENDPOINTS_ACCOUNT}</code>
        </pre>
        <pre>
          getUserData:
          <code>{getUserData}</code>
        </pre>
      </header>
    </section>
  );
}

export default App;
