// /src/store/features/trackSlice.ts
import { SelectionType, TrackType } from '@/sharedTypes/sharedTypes';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialTrackStateType = {
  currentTrack: null | TrackType;
  isPlay: boolean;
  isLoadingTracks: boolean;
  playlist?: TrackType[];
  isLike?: boolean;
  isLoop?: boolean;
  isShuffle?: boolean;
  shuffledPlaylist?: TrackType[];
  selections: SelectionType[];
  favoriteTracks: TrackType[];
  currentSelection: number | null;
};

const initialState: initialTrackStateType = {
  currentTrack: null,
  isPlay: false,
  isLoadingTracks: false,
  playlist: [],
  isLike: false,
  isLoop: false,
  isShuffle: false,
  shuffledPlaylist: [],
  selections: [],
  favoriteTracks: [],
  currentSelection: null,
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack(state, action: PayloadAction<TrackType>) {
      state.currentTrack = action.payload;
    },
    setIsPlay(state, action: PayloadAction<boolean>) {
      state.isPlay = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoadingTracks = action.payload;
    },
    setPlaylist(state, action: PayloadAction<TrackType[]>) {
      state.playlist = action.payload;
      state.shuffledPlaylist = [...state.playlist].sort(
        () => Math.random() - 0.5,
      );
    },
    setIsLike(state, action: PayloadAction<boolean>) {
      state.isLike = action.payload;
    },
    setIsLoop(state, action: PayloadAction<boolean>) {
      state.isLoop = action.payload;
    },

    setNextTrack(state) {
      const playlist = state.isShuffle
        ? state.shuffledPlaylist
        : state.playlist;

      if (!state.currentTrack || !playlist || playlist.length === 0) return;

      const curIndex = playlist.findIndex(
        (el) => el._id === state.currentTrack?._id,
      );
      if (curIndex === -1) return;

      if (state.isShuffle) {
        const nextIndex = (curIndex + 1) % playlist.length;
        state.currentTrack = playlist[nextIndex];
        return;
      }

      if (curIndex >= playlist.length - 1) return;

      state.currentTrack = playlist[curIndex + 1];
    },

    setPrevTrack(state) {
      const playlist = state.isShuffle
        ? state.shuffledPlaylist
        : state.playlist;

      if (!state.currentTrack || !playlist || playlist.length === 0) return;

      const curIndex = playlist.findIndex(
        (el) => el._id === state.currentTrack?._id,
      );
      if (curIndex === -1) return;

      if (state.isShuffle) {
        const prevIndex = (curIndex - 1 + playlist.length) % playlist.length;
        state.currentTrack = playlist[prevIndex];
        return;
      }

      if (curIndex <= 0) return;

      state.currentTrack = playlist[curIndex - 1];
    },

    setIsShuffle(state) {
      state.isShuffle = !state.isShuffle;
    },
    setSelections(state, action: PayloadAction<SelectionType[]>) {
      state.selections = action.payload;
    },
    setFavoritesTracks(state, action: PayloadAction<TrackType[]>) {
      state.favoriteTracks = action.payload;
      state.isLike = action.payload.length > 0;
    },
    addFavoriteTrack(state, action: PayloadAction<TrackType>) {
      state.favoriteTracks = [...state.favoriteTracks, action.payload];
      state.isLike = true;
    },
    removeFavoriteTrack(state, action: PayloadAction<number>) {
      state.favoriteTracks = state.favoriteTracks.filter(
        (track) => track._id !== action.payload,
      );
      state.isLike = state.favoriteTracks.length > 0;
    },
  },
});

export const {
  setCurrentTrack,
  setIsPlay,
  setLoading,
  setPlaylist,
  setIsLike,
  setIsLoop,
  setNextTrack,
  setPrevTrack,
  setIsShuffle,
  setSelections,
  addFavoriteTrack,
  removeFavoriteTrack,
  setFavoritesTracks,
} = trackSlice.actions;

export const trackSliceReducer = trackSlice.reducer;

// селекторы
type RootState = { tracks: initialTrackStateType };

const selectTrackState = (state: RootState) => state.tracks;

export const selectActivePlaylist = createSelector(
  [selectTrackState],
  (track) =>
    track.isShuffle ? (track.shuffledPlaylist ?? []) : (track.playlist ?? []),
);

export const selectCurrentIndex = createSelector(
  [selectTrackState, selectActivePlaylist],
  (track, playlist) => {
    if (!track.currentTrack || playlist.length === 0) return -1;
    return playlist.findIndex((el) => el._id === track.currentTrack?._id);
  },
);

export const selectCanNext = createSelector(
  [selectTrackState, selectActivePlaylist, selectCurrentIndex],
  (track, playlist, curIndex) => {
    if (!track.currentTrack || playlist.length === 0 || curIndex === -1)
      return false;
    if (track.isShuffle) return true;
    return curIndex < playlist.length - 1;
  },
);

export const selectCanPrev = createSelector(
  [selectTrackState, selectActivePlaylist, selectCurrentIndex],
  (track, playlist, curIndex) => {
    if (!track.currentTrack || playlist.length === 0 || curIndex === -1)
      return false;
    if (track.isShuffle) return true;
    return curIndex > 0;
  },
);
