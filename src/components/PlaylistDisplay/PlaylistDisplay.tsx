'use client';

import styles from '@/components/Centerblock/Centerblock.module.css';
import Filter from '@/components/Filter/Filter';
import Search from '@/components/Search/Search';
import Track from '@/components/Track/Track';
import { useFavoriteTracks } from '@/hooks/useFavoriteTracks';
import { useTrackFilters } from '@/hooks/useTrackFilters';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppSelector } from '@/store/store';
import Loading from '../Loading/Loading';

interface PlaylistDisplayProps {
  tracks: TrackType[];
  title: string;
}

export default function PlaylistDisplay({
  tracks,
  title,
}: PlaylistDisplayProps) {
  const isLoadingTracks = useAppSelector(
    (state) => state.tracks.isLoadingTracks,
  );
  useFavoriteTracks();
  const {
    filters,
    selectedFilter,
    onSelectFilter,
    search,
    setSearch,
    filteredTracks,
  } = useTrackFilters(tracks);

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
          <div style={{ color: 'white' }}>Нет треков для отображения</div>
        )}
        {!isLoadingTracks &&
          filteredTracks.map((track: TrackType) => (
            <Track key={track._id} track={track} />
          ))}
      </div>
    </div>
  );
}
