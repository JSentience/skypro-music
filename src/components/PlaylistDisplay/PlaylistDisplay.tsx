'use client';

import Filter from '@/components/Filter/Filter';
import Search from '@/components/Search/Search';
import Track from '@/components/Track/Track';
import { TrackType } from '@/sharedTypes/sharedTypes';
import styles from '@/components/Centerblock/Centerblock.module.css';

interface PlaylistDisplayProps {
  tracks: TrackType[];
  title: string;
}

export default function PlaylistDisplay({
  tracks,
  title,
}: PlaylistDisplayProps) {
  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>{title}</h2>
      <Filter />

      <div className={styles.content__playlist}>
        {tracks.map((track: TrackType) => (
          <Track key={track._id} track={track} />
        ))}
      </div>
    </div>
  );
}
