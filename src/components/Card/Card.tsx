import { cn } from '$lib/utils';
import { ReactElement } from 'react';
import styles from './Card.module.css';

/**
 * A Card with title and background image.
 *
 * You can pass ReactElements to title/img, otherwise it's will
 * create a h2 and img
 */
export default function Card({
  title,
  className,
  img,
  children
}: {
  title?: string | ReactElement;
  className?: string | string[];
  img?: string | ReactElement;
  children?: ReactElement;
}) {
  return (
    <div className={cn(styles.card, className)}>
      {typeof img === 'string' ? <img className={styles.cardMedia} src={img} alt={String(title)} /> : img}
      {typeof title === 'string' ? <h2 className={cn('headline5', styles.cardLabel)}>{title}</h2> : title}
      {children}
    </div>
  );
}
