import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice";
import favoritesReducer from "./favoritesSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
