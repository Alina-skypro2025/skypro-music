import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FavoritesState = {
  ids: Record<string, true>;
  error: string;
};

const initialState: FavoritesState = {
  ids: {},
  error: "",
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setLikedLocal(state, action: PayloadAction<{ trackId: string; liked: boolean }>) {
      const { trackId, liked } = action.payload;
      if (liked) state.ids[trackId] = true;
      else delete state.ids[trackId];
    },
    clearFavoritesLocal(state) {
      state.ids = {};
      state.error = "";
    },
    setFavoritesError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    clearFavoritesError(state) {
      state.error = "";
    },
  },
});

export const {
  setLikedLocal,
  clearFavoritesLocal,
  setFavoritesError,
  clearFavoritesError,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
