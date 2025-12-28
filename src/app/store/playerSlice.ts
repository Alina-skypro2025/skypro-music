import { createSlice } from "@reduxjs/toolkit";
import { tracks } from "@/app/data/tracks";

const initialState = {
  tracks,
  currentPlaylist: tracks,
  currentTrack: tracks[0],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.5,
  isShuffle: false,
  isLoop: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playTrack(state, action) {
      const index = state.currentPlaylist.findIndex(
        (t) => t.id === action.payload.id
      );

      if (index !== -1) {
        state.currentTrack = action.payload;
        state.currentIndex = index;
        state.isPlaying = true;
      }
    },

    togglePlay(state) {
      state.isPlaying = !state.isPlaying;
    },

    nextTrack(state) {
      if (state.currentIndex < state.currentPlaylist.length - 1) {
        state.currentIndex += 1;
      } else {
        state.currentIndex = 0;
      }
      state.currentTrack = state.currentPlaylist[state.currentIndex];
      state.isPlaying = true;
    },

    prevTrack(state) {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      } else {
        state.currentIndex = state.currentPlaylist.length - 1;
      }
      state.currentTrack = state.currentPlaylist[state.currentIndex];
      state.isPlaying = true;
    },

    setVolume(state, action) {
      state.volume = action.payload;
    },

    toggleShuffle(state) {
      state.isShuffle = !state.isShuffle;
    },

    toggleLoop(state) {
      state.isLoop = !state.isLoop;
    },
  },
});

export const {
  playTrack,
  togglePlay,
  nextTrack,
  prevTrack,
  setVolume,
  toggleShuffle,
  toggleLoop,
} = playerSlice.actions;

export default playerSlice.reducer;
