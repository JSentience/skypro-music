'use client';

import ProgressBar from '@/components/ProgressBar/ProgressBar';
import {
  selectCanNext,
  selectCanPrev,
  setIsLoop,
  setIsPlay,
  setIsShuffle,
  setNextTrack,
  setPrevTrack,
} from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getTimePanel } from '@/utils/helper';
import classNames from 'classnames';
import Link from 'next/dist/client/link';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './Bar.module.css';

export default function Bar() {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoop = useAppSelector((state) => state.tracks.isLoop);
  const [timeDisplay, setTimeDisplay] = useState<string>('');
  const [isLoadedTrack, setIsLoadedTrack] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.3);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  const canNext = useAppSelector(selectCanNext);
  const canPrev = useAppSelector(selectCanPrev);

  if (!currentTrack) {
    return <></>;
  }

  const playAudio = () => {
    if (audioRef.current && isLoadedTrack) {
      audioRef.current.play().catch((error) => {
        console.error('Ошибка воспроизведения:', error);
      });
      dispatch(setIsPlay(true));
    }
  };
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      dispatch(setIsPlay(false));
    }
  };

  const onNextTrack = () => {
    dispatch(setNextTrack());
    setIsLoadedTrack(false);
    dispatch(setIsPlay(true));
  };

  const onToggleShuffle = () => {
    dispatch(setIsShuffle());
  };

  const toggleLoop = () => {
    const newLoopState = !isLoop;
    dispatch(setIsLoop(newLoopState));
    console.log('Toggle Loop:', newLoopState);
  };

  const onPrevTrack = () => {
    dispatch(setPrevTrack());
    setIsLoadedTrack(false);
    dispatch(setIsPlay(true));
  };

  const play = () => {
    if (audioRef.current?.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  };
  const onTimeUpdate = () => {
    if (audioRef.current && isLoadedTrack) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(currentTime);
      const timeString = getTimePanel(currentTime, duration);
      if (timeString) setTimeDisplay(timeString);
    }
  };
  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setIsLoadedTrack(true);
      const duration = audioRef.current.duration;
      setDuration(duration);
      const timeString = getTimePanel(0, duration);
      if (timeString) setTimeDisplay(timeString);

      audioRef.current.volume = volume;

      if (isPlay) {
        audioRef.current.play().catch((error) => {
          console.error('Ошибка воспроизведения:', error);
        });
      }
    }
  };
  const onEndedTrack = () => {
    if (!isLoop) {
      onNextTrack();
    }
  };
  const onError = () => {
    console.error('Ошибка воспроизведения аудио');
    dispatch(setIsPlay(false));
  };

  const onChangeProgress = (e: ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
    }
  };
  const onChangeVolume = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className={styles.bar}>
      <audio
        className={styles.audio}
        ref={audioRef}
        controls
        loop={isLoop}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEndedTrack}
        onError={onError}
        src={
          typeof currentTrack.track_file === 'object'
            ? (currentTrack.track_file as { url: string }).url
            : currentTrack.track_file
        }
      ></audio>
      <div className={styles.bar__content}>
        <ProgressBar
          max={duration}
          value={currentTime}
          step={0.01}
          onChange={onChangeProgress}
          readOnly={!isLoadedTrack}
        />
        <div className={styles.bar__playerProgress}></div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div
                className={classNames(styles.player__btnPrev, {
                  [styles.player__btn_disabled]: !canPrev,
                })}
                onClick={onPrevTrack}
                aria-disabled={!canPrev}
              >
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnPlay, styles.btn)}
                onClick={play}
              >
                <svg className={styles.player__btnPlaySvg}>
                  <use
                    xlinkHref={
                      isPlay
                        ? '/img/icon/sprite.svg#icon-pause'
                        : '/img/icon/sprite.svg#icon-play'
                    }
                  ></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnNext, {
                  [styles.player__btn_disabled]: !canNext,
                })}
                onClick={onNextTrack}
                aria-disabled={!canNext}
              >
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                onClick={toggleLoop}
                className={classNames(
                  styles.player__btnRepeat,
                  styles.btnIcon,
                  { [styles.btnIcon_active]: isLoop },
                )}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                onClick={onToggleShuffle}
                className={classNames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                  { [styles.btnIcon_active]: isShuffle },
                )}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use
                      xlinkHref={
                        (typeof currentTrack.logo === 'string'
                          ? currentTrack.logo
                          : currentTrack.logo?.url) ||
                        '/img/icon/sprite.svg#icon-note'
                      }
                    ></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack.author}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack.album}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__dislike}>
                <div
                  className={classNames(
                    styles.player__btnShuffle,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={classNames(
                    styles.trackPlay__dislike,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar__time}>{timeDisplay}</div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classNames(styles.volume__progress, styles.btn)}>
                <input
                  onChange={onChangeVolume}
                  className={classNames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  name="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
