'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './Loading.module.css'

type LoadingVariant = 'tracks' | 'page';

type LoadingProps = {
  variant?: LoadingVariant;
  count?: number;
};

export default function Loading({
  variant = 'tracks',
  count = 10,
}: LoadingProps) {
  if (variant === 'page') {
    return (
      <div className={styles.page} aria-live="polite">
        <SkeletonTheme baseColor="#2a2a2a" highlightColor="#3a3a3a">
          <div className={styles.pageCard}>
            <div className={styles.pageHeader}>
              <div className={styles.equalizer} aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span key={index} className={styles.equalizerBar} />
                ))}
              </div>
              <div className={styles.pageHeaderText}>
                <Skeleton width={220} height={20} />
                <Skeleton width={140} height={14} />
              </div>
            </div>
            <div className={styles.pageList}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={styles.pageRow}>
                  <Skeleton width={24} height={24} circle />
                  <Skeleton height={14} className={styles.pageRowTitle} />
                  <Skeleton height={12} className={styles.pageRowMeta} />
                </div>
              ))}
            </div>
          </div>
        </SkeletonTheme>
      </div>
    );
  }

  return (
    <SkeletonTheme baseColor="#2a2a2a" highlightColor="#3a3a3a">
      <div className={styles.skeletonList} aria-live="polite">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={styles.skeletonRow}>
            <div className={styles.skeletonTitle}>
              <Skeleton
                width={51}
                height={51}
                className={styles.skeletonIcon}
              />
              <Skeleton height={16} className={styles.skeletonText} />
            </div>
            <Skeleton height={16} className={styles.skeletonAuthor} />
            <Skeleton height={16} className={styles.skeletonAlbum} />
            <Skeleton height={16} className={styles.skeletonTime} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}
