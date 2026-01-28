'use client';

import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loading} aria-live="polite">
      <div className={styles.loading__spinner} />
      <span className={styles.loading__text}>Загрузка…</span>
    </div>
  );
}
