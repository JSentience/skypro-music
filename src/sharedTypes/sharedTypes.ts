export type TrackType = {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: [string];
  duration_in_seconds: number;
  album: string;
  logo: string | null | { url: string };
  track_file: string;
  stared_user: [];
};

export type SelectionType = {
  _id: number;
  name?: string;
  items: number[];
};

export type FavoriteType = TrackType[];
