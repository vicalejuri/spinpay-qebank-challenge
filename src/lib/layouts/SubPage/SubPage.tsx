import { cn } from '$lib/utils';
import React, { ReactNode } from 'react';

import styles from './subpage.module.css';

import BackButton from '$components/BackButton/BackButton';

export interface SubPageProps {
  className: string | string[];
  children: ReactNode;
  title: string | ReactNode;
  backButton?: boolean;
}

/**
 * a Sub page layout contains a title,
 *  some content centered,
 *  optionally a back-button
 */
export default function SubPage({ className, children, title, backButton }: SubPageProps) {
  return (
    <article className={cn(styles.subpage, className)}>
      <h1 className={cn('headline', styles.title)}>
        {backButton && <BackButton className={styles.backButton} />}
        {title}
      </h1>
      {children}
    </article>
  );
}
