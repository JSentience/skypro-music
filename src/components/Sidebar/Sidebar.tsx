'use client';

import Link from 'next/dist/client/link';
import Image from 'next/image';
import styles from './Sidebar.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setLogout } from '@/store/features/authSlice';
import { redirect } from 'next/navigation';
import { removeTokens, removeUser } from '@/utils/authTokens';
import { useEffect } from 'react';
import { getSelections } from '@/sevices/tracks/selectionsApi';
import { SelectionType } from '@/sharedTypes/sharedTypes';
import { setSelections } from '@/store/features/trackSlice';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const userName = useAppSelector((state) => state.auth.user?.username);
  const selections = useAppSelector((state) => state.tracks.selections);

  useEffect(() => {
    getSelections().then((data: SelectionType[]) => {
      dispatch(setSelections(data));
    });
  }, [dispatch]);

  const selectionsArray = Array.isArray(selections) ? selections : [];
  const handleOut = () => {
    dispatch(setLogout());
    removeUser();
    removeTokens();
    redirect('/auth/signin');
  };

  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>{userName}</p>
        <div onClick={handleOut} className={styles.sidebar__icon}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          {selectionsArray
            .filter((selection) => [2, 3, 4].includes(selection._id))
            .map((selection) => (
              <div key={selection._id} className={styles.sidebar__item}>
                <Link
                  className={styles.sidebar__link}
                  href={`/music/categoties/${selection._id}`}
                >
                  <Image
                    className={styles.sidebar__img}
                    src={`/img/playlist0${selection._id - 1}.png`}
                    alt={selection.name || 'playlist'}
                    width={250}
                    height={170}
                    loading="eager"
                  />
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
