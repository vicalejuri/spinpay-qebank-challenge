import { cn } from '$lib/utils';
import { useNavigate } from 'react-router-dom';

import { ArrowLeftIcon } from '@radix-ui/react-icons';

export default function BackButton({ className }: { className: string | string[] }) {
  let navigate = useNavigate();

  function handleClick(ev: React.MouseEvent) {
    ev.preventDefault();
    navigate(-1);
  }

  return (
    <a href="" onClick={handleClick} className={cn(className)}>
      <ArrowLeftIcon />
    </a>
  );
}