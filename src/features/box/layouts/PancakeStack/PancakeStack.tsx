import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './Pancake.module.css';

/**
 * A two-rows layout with a <header> and a <main>
 */
function PancakeStack({ first }: { first?: React.LazyExoticComponent<() => JSX.Element> }) {
  const FirstComponent = first ? first : <header />;
  return (
    <section className={styles.pancake}>
      <FirstComponent />
      <main>
        <Outlet />
      </main>
    </section>
  );
}

export default PancakeStack;
