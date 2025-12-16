import { createSlice } from "@reduxjs/toolkit";
import { tracks } from "@/app/data/tracks";

const initialState = {
  tracks,
  currentTrack: tracks[0], // текущий трек по умолчанию
  isPlaying: false,
  volume: 0.5,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // Воспроизведение конкретного трека (по клику в списке)
    playTrack(state, action) {
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
    // Переключение Play/Pause
    togglePlay(state) {
      // если трека нет, ничего не делаем
      if (!state.currentTrack) return;
      state.isPlaying = !state.isPlaying;
    },
    // Явно задать playing/pause (если нужно)
    setPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    // Громкость
    setVolume(state, action) {
      state.volume = action.payload;
    },
  },
});

export const { playTrack, togglePlay, setPlaying, setVolume } =
  playerSlice.actions;

export default playerSlice.reducer;
