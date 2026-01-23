'use client';

import Filter from '@/components/Filter/Filter';
import Search from '@/components/Search/Search';
import Track from '@/components/Track/Track';
import { useAuth } from '@/hooks/useAuth';

import { getTracks } from '@/sevices/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { setPlaylist } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import styles from './Centerblock.module.css';

export default function Centerblock() {
  const { isAuthenticated, accessToken } = useAuth();
  const dispatch = useAppDispatch();
  const playlist = useAppSelector((state) => state.tracks.playlist || []);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !accessToken || playlist.length > 0) return;

    getTracks(accessToken)
      .then((tracks: TrackType[]) => {
        dispatch(setPlaylist(tracks));
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data);
        } else if (error.request) {
          setError(error.request);
        } else {
          setError(error);
        }
        setError(error.config);
      });
  }, [dispatch, isAuthenticated, accessToken, playlist.length]);

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>
      <Filter />
      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classNames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>
        <div className={styles.content__playlist}>
          {error && <div>{error}</div>}
          {playlist.map((track: TrackType) => (
            <Track key={track._id} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
}
