import { ReactElement, cloneElement } from 'react';
import { cn } from '$lib/utils';
import styles from './Card.module.css';

export type Variants = 'shadowed';

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
  const ImgElement =
    typeof img === 'string' ? (
      <img className={styles.cardMedia} src={img} alt={String(title)} />
    ) : (
      cloneElement(img, { className: cn(styles.cardMedia, img.props.className) })
    );
  return (
    <div className={cn(styles.card, className)}>
      {ImgElement}
      {typeof title === 'string' ? <h2 className={cn(styles.cardLabel)}>{title}</h2> : title}
      {children}
    </div>
  );
}
