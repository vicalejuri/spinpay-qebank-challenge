import { lazy } from 'react';
import { cn } from '$lib/utils';

const SubPage = lazy(() => import('$lib/layouts/SubPage/SubPage'));

export default function withdraw() {
  return (
    <SubPage className={cn('withdraw', 'pageWrapper')} title={'Withdraw'} backButton>
      <div>Withdraw</div>
    </SubPage>
  );
}
