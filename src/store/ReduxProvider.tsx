'use client';

import { initializeHttpStore } from '@/services/http';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from './store';
let appStore: AppStore | undefined;

function getAppStore(): AppStore {
  if (!appStore) {
    appStore = makeStore();
    initializeHttpStore(appStore);
  }
  return appStore;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = getAppStore();
  return <Provider store={store}>{children}</Provider>;
}
