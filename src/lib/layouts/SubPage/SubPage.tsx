import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { cn } from '$lib/utils';

import BackButton from '$components/BackButton/BackButton';
import styles from './subpage.module.css';

import { defaultTransition as transition } from '$lib/motion';

export interface SubPageProps {
  className: string | string[];
  children: ReactNode;
  title: string | ReactNode;
  backButton?: boolean;
}

const titleVariants = {
  exit: { opacity: 0, transition },
  enter: { opacity: 1, transition }
};

const backButtonVariants = {
  exit: { x: 100, opacity: 0, transition },
  enter: { x: 0, opacity: 1, transition: { delay: 1, ...transition } }
};

const childVariants = {
  exit: { y: '20%', opacity: 0, transition },
  enter: {
    y: '0%',
    opacity: 1,
    transition
  }
};

/**
 * a Sub page layout contains a title,
 *  some content centered,
 *  optionally a back-button
 */
export default function SubPage({ className, children, title, backButton }: SubPageProps) {
  return (
    <motion.article className={cn(styles.subpage, className)} initial="exit" animate="enter" exit="exit">
      <h1 className={cn('headline', styles.title)}>
        {backButton && (
          <motion.div>
            <BackButton className={styles.backButton} />
          </motion.div>
        )}
        <motion.div variants={titleVariants} className={styles.titleElement}>
          {title}
        </motion.div>
      </h1>
      {/* {children} */}
      <motion.div variants={childVariants}>{children}</motion.div>
    </motion.article>
  );
}
