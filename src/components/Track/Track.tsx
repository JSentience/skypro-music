'use client';

import {
  addTrackToFavorites,
  removeTrackFromFavorites,
} from '@/sevices/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import {
  addFavoriteTrack,
  removeFavoriteTrack,
  setCurrentTrack,
  setIsPlay,
} from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatTime } from '@/utils/helper';
import classNames from 'classnames';
import Link from 'next/link';
import styles from './Track.module.css';

type TrackTypeProp = {
  track: TrackType;
};

export default function Track({ track }: TrackTypeProp) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const onClickTrack = () => {
    dispatch(setCurrentTrack(track));
    dispatch(setIsPlay(true));
  };

  const isCurrentTrack = currentTrack?._id === track._id;
  const showPlayedIcon = isCurrentTrack && isPlay;
  const showCurrentTrackIcon = isCurrentTrack && !isPlay;
  const isFavorite = favoriteTracks.some((item) => item._id === track._id);

  const onToggleFavorite = async (
    event: React.MouseEvent<HTMLOrSVGElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    if (!isAuthenticated) return;

    try {
      if (isFavorite) {
        await removeTrackFromFavorites(track._id);
        dispatch(removeFavoriteTrack(track._id));
      } else {
        await addTrackToFavorites(track._id);
        dispatch(addFavoriteTrack(track));
      }
    } catch (error) {
      console.error('Ошибка при обновлении избранного', error);
    }
  };

  return (
    <>
      <div className={styles.playlist__item} onClick={onClickTrack}>
        <div className={styles.playlist__track}>
          <div className={styles.track__title}>
            <div className={styles.track__titleImage}>
              <svg className={styles.track__titleSvg}>
                <use xlinkHref={'/img/icon/sprite.svg#icon-note'}></use>
              </svg>
              {showPlayedIcon && (
                <svg
                  className={classNames(
                    styles.track__titleSvg_dot,
                    styles.active,
                  )}
                >
                  <use xlinkHref={'/img/icon/sprite.svg#icon-played'}></use>
                </svg>
              )}
              {showCurrentTrackIcon && (
                <svg className={styles.track__titleSvg_dot}>
                  <use xlinkHref={'/img/icon/sprite.svg#icon-played'}></use>
                </svg>
              )}
            </div>
            <div className={styles.track__title_text}>
              <Link className={styles.track__titleLink} href="">
                {track.name} <span className={styles.track__titleSpan}></span>
              </Link>
            </div>
          </div>
          <div className={styles.track__author}>
            <Link className={styles.track__authorLink} href="">
              {track.author}
            </Link>
          </div>
          <div className={styles.track__album}>
            <Link className={styles.track__albumLink} href="">
              {track.album}
            </Link>
          </div>
          <div className={styles.track__time}>
            <svg className={styles.track__timeSvg} onClick={onToggleFavorite}>
              <use
                xlinkHref={`/img/icon/sprite.svg#${isFavorite ? 'icon-like' : 'icon-dislike'}`}
              ></use>
            </svg>
            <span className={styles.track__timeText}>
              {formatTime(track.duration_in_seconds)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
