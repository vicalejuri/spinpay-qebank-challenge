import { ReactChild, ReactFragment, ReactPortal } from 'react';

/**
 * Compose multiple providers into a single Context.Provider
 */
export const composeProviders = (
  contexts: any[],
  children: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined
) =>
  contexts.reduce((acc: any, [Context, value]: any) => {
    return <Context.Provider value={value}>{acc}</Context.Provider>;
  }, children);
