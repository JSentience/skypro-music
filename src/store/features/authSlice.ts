import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserType = {
  _id: number;
  username?: string;
  email: string;
};
type AuthState = {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken(
      state,
      action: PayloadAction<{ access: string; refresh: string }>,
    ) {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
    setLogout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setToken, setLogout } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
