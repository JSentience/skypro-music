'use client';

import Filter from '@/components/Filter/Filter';
import Search from '@/components/Search/Search';
import Track from '@/components/Track/Track';
import { useFavoriteTracks } from '@/hooks/useFavoriteTracks';
import { TrackType } from '@/sharedTypes/sharedTypes';
import {
  resetFilters,
  selectTrackFilters,
  selectTrackSearch,
  setFilterAuthors,
  setFilterGenre,
  setFilterYears,
  setSearch as setSearchAction,
} from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import Loading from '../Loading/Loading';
import styles from './Centerblock.module.css';

interface CenterblockProps {
  tracks: TrackType[];
  title: string;
}

type FilterName = 'author' | 'genre' | 'year';

type FilterOption = {
  name: FilterName;
  label: string;
  options: string[];
};

type SelectedFilter = {
  author: string[];
  genre: string[];
  year: string[];
};

export default function Centerblock({ tracks, title }: CenterblockProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isLoadingTracks = useAppSelector(
    (state) => state.tracks.isLoadingTracks,
  );
  useFavoriteTracks();
  const selectedFilter = useAppSelector(selectTrackFilters) as SelectedFilter;
  const search = useAppSelector(selectTrackSearch);

  const filters = useMemo<FilterOption[]>(() => {
    const authorFilter = Array.from(
      new Set(tracks.map((track) => track.author)),
    ).filter(Boolean);
    const yearFilter = ['по умолчанию', 'новые', 'старые'];
    const genreFilter = Array.from(
      new Set(tracks.flatMap((track) => track.genre)),
    ).filter(Boolean);

    return [
      { name: 'author', label: 'исполнителю', options: authorFilter },
      { name: 'genre', label: 'жанру', options: genreFilter },
      { name: 'year', label: 'году выпуска', options: yearFilter },
    ];
  }, [tracks]);

  const onSelectFilter = useCallback(
    (name: FilterName, value: string) => {
      if (name === 'author') {
        dispatch(setFilterAuthors(value));
        return;
      }
      if (name === 'genre') {
        dispatch(setFilterGenre(value));
        return;
      }
      dispatch(setFilterYears(value));
    },
    [dispatch],
  );

  const setSearch = useCallback(
    (value: string) => {
      dispatch(setSearchAction(value));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(resetFilters());
  }, [dispatch, pathname]);

  const filteredTracks = useMemo(() => {
    const loweredSearch = search.trim().toLowerCase();

    let filtered = tracks.filter((track) => {
      if (
        selectedFilter.author.length > 0 &&
        !selectedFilter.author.includes(track.author)
      ) {
        return false;
      }
      if (
        selectedFilter.genre.length > 0 &&
        !track.genre.some((value) => selectedFilter.genre.includes(value))
      ) {
        return false;
      }
      if (!loweredSearch) return true;

      const byName = track.name.toLowerCase().includes(loweredSearch);
      const byAuthor = track.author.toLowerCase().includes(loweredSearch);
      return byName || byAuthor;
    });

    if (selectedFilter.year.length > 0) {
      const sortOrder = selectedFilter.year[0];
      if (sortOrder === 'новые' || sortOrder === 'старые') {
        filtered = [...filtered].sort((a, b) => {
          const yearA = parseInt(a.release_date.slice(0, 4));
          const yearB = parseInt(b.release_date.slice(0, 4));
          return sortOrder === 'новые' ? yearB - yearA : yearA - yearB;
        });
      }
    }

    return filtered;
  }, [tracks, selectedFilter, search]);

  const hasActiveFilters = useMemo(() => {
    return (
      selectedFilter.author.length > 0 ||
      selectedFilter.genre.length > 0 ||
      selectedFilter.year.length > 0 ||
      search.trim().length > 0
    );
  }, [search, selectedFilter]);

  const onResetFilters = useCallback(() => {
    dispatch(resetFilters());
    dispatch(setSearchAction(''));
  }, [dispatch]);

  return (
    <div className={styles.centerblock}>
      <Search value={search} onChange={setSearch} />
      <h2 className={styles.centerblock__h2}>{title}</h2>
      <Filter
        filters={filters}
        selectedFilter={selectedFilter}
        onChange={onSelectFilter}
      />

      <div className={styles.content__playlist}>
        {isLoadingTracks && <Loading />}
        {!isLoadingTracks && filteredTracks.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyState__title}>
              {hasActiveFilters ? 'Ничего не найдено' : 'Список треков пуст'}
            </p>
            <p className={styles.emptyState__subtitle}>
              {hasActiveFilters
                ? 'Попробуйте изменить фильтры или поиск.'
                : 'Проверьте подключение и попробуйте обновить страницу.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className={styles.emptyState__button}
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        )}
        {!isLoadingTracks &&
          filteredTracks.map((track: TrackType) => (
            <Track key={track._id} track={track} />
          ))}
      </div>
    </div>
  );
}
