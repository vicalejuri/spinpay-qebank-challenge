import { cn } from '$lib/utils';
import { useNavigate } from 'react-router-dom';

import styles from './BackButton.module.css';

export default function BackButton({ className }: { className: string | string[] }) {
  let navigate = useNavigate();

  function handleClick(ev: React.MouseEvent) {
    ev.preventDefault();
    navigate(-1);
  }

  return (
    <button onClick={handleClick} className={cn(className, styles.backbutton)} aria-label="Go to previous page">
      ←
    </button>
  );
}
