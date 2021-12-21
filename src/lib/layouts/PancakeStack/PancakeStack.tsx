import { Outlet } from 'react-router-dom';

import { cn } from '$lib/utils';
import styles from './Pancake.module.css';

export type Variants = 'centered';

/**
 * A two-rows layout with a <header> and a <main>, occupy full viewport
 *
 * <header>
 * <main>
 * ...
 * </main>
 *
 * {first} can be ommited, to generate only a full-screen <main>
 */
function PancakeStack({ first, variant = 'centered' }: { first?: JSX.Element; variant?: Variants }): JSX.Element {
  const FirstComponent = first ? () => first : () => <h1></h1>;
  return (
    <section className={styles.pancake}>
      <FirstComponent />
      <main className={cn(variant === 'centered' && styles.pageWrapperCenter)}>
        <Outlet />
      </main>
    </section>
  );
}

export default PancakeStack;
