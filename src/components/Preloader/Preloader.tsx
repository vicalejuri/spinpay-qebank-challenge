import React from 'react';

import styles from './Preloader.module.css';

export const Preloader = () => {
  return (
    <div className={styles.preloader}>
      <div className={styles.lines}>
        <div className={styles.singleLine} />
        <div className={styles.singleLine} />
        <div className={styles.singleLine} />
      </div>

      <div className={styles.loadingText}>LOADING</div>
    </div>
  );
};

export default Preloader;
