'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from './store';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  // eslint-disable-next-line react-hooks/refs
  return <Provider store={storeRef.current!}>{children}</Provider>;
}
