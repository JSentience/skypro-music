'use client';

import { TrackType } from '@/sharedTypes/sharedTypes';
import { useMemo, useState } from 'react';

type FilterName = 'author' | 'genre' | 'year';

type FilterOption = {
  name: FilterName;
  label: string;
  options: string[];
};

type SelectedFilter = {
  author: string;
  genre: string;
  year: string;
};

export const useTrackFilters = (tracks: TrackType[]) => {
  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>({
    author: '',
    genre: '',
    year: '',
  });
  const [search, setSearch] = useState('');

  const filters = useMemo<FilterOption[]>(() => {
    const authorFilter = Array.from(
      new Set(tracks.map((track) => track.author)),
    ).filter(Boolean);
    const yearFilter = Array.from(
      new Set(tracks.map((track) => track.release_date.slice(0, 4))),
    ).filter(Boolean);
    const genreFilter = Array.from(
      new Set(tracks.flatMap((track) => track.genre)),
    ).filter(Boolean);

    return [
      { name: 'author', label: 'исполнителю', options: authorFilter },
      { name: 'genre', label: 'жанру', options: genreFilter },
      { name: 'year', label: 'году выпуска', options: yearFilter },
    ];
  }, [tracks]);

  const filteredTracks = useMemo(() => {
    const loweredSearch = search.trim().toLowerCase();

    return tracks.filter((track) => {
      if (selectedFilter.author && track.author !== selectedFilter.author) {
        return false;
      }
      if (
        selectedFilter.year &&
        track.release_date.slice(0, 4) !== selectedFilter.year
      ) {
        return false;
      }
      if (selectedFilter.genre && !track.genre.includes(selectedFilter.genre)) {
        return false;
      }
      if (!loweredSearch) return true;

      const byName = track.name.toLowerCase().includes(loweredSearch);
      const byAuthor = track.author.toLowerCase().includes(loweredSearch);
      return byName || byAuthor;
    });
  }, [tracks, selectedFilter, search]);

  const onSelectFilter = (name: FilterName, value: string) => {
    setSelectedFilter((prev) => ({
      ...prev,
      [name]: prev[name] === value ? '' : value,
    }));
  };

  return {
    filters,
    selectedFilter,
    onSelectFilter,
    search,
    setSearch,
    filteredTracks,
  };
};
