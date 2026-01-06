import { TrackType } from '@/sharedTypes/sharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialTrackStateType = {
  currentTrack: null | TrackType;
  isPlay: boolean;
  allTracks?: TrackType[];
  isLike?: boolean;
};

const initialState: initialTrackStateType = {
  currentTrack: null,
  isPlay: false,
  allTracks: [],
  isLike: false,
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
    setAllTracks(state, action: PayloadAction<TrackType[]>) {
      state.allTracks = action.payload;
    },
    setIsLike(state, action: PayloadAction<boolean>) {
      state.isLike = action.payload;
    },
  },
});

export const { setCurrentTrack, setIsPlay, setAllTracks, setIsLike } =
  trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
