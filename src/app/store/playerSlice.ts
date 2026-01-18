import { createSlice } from "@reduxjs/toolkit";
import { tracks as allTracks } from "@/app/data/tracks";

function normalizeSrc(raw: any): string {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;
  return `/${s}`;
}

function normalizeTrack(t: any) {
  const id = Number(t.id ?? t._id);

  const srcRaw = t.src ?? t.track_file ?? "";
  const src = normalizeSrc(srcRaw);

  return {
    id,
    title: t.title ?? t.name ?? "",
    author: t.author ?? "",
    album: t.album ?? "",
    duration: t.duration ?? t.duration_in_seconds ?? 0,
    src,

    
    track_file: src,
  };
}

const normalized = (allTracks ?? [])
  .map(normalizeTrack)
  .filter((t) => Number.isFinite(t.id) && t.id > 0 && t.src);

const initialState = {
  tracks: normalized,
  currentPlaylist: normalized,
  currentTrack: normalized[0] ?? null,
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
    setPlaylist(state, action) {
      const list = (action.payload ?? [])
        .map(normalizeTrack)
        .filter((t: any) => Number.isFinite(t.id) && t.id > 0 && t.src);

      if (list.length === 0) return;

      state.currentPlaylist = list;

      const idx = state.currentTrack
        ? list.findIndex((t: any) => t.id === state.currentTrack.id)
        : -1;

      if (idx === -1) {
        state.currentIndex = 0;
        state.currentTrack = list[0];
      } else {
        state.currentIndex = idx;
        state.currentTrack = list[idx];
      }
    },

    playTrack(state, action) {
      const track = normalizeTrack(action.payload);

      const index = state.currentPlaylist.findIndex((t: any) => t.id === track.id);

      state.currentTrack = track;
      state.currentIndex = index !== -1 ? index : state.currentIndex;
      state.isPlaying = true;
    },

    togglePlay(state) {
      state.isPlaying = !state.isPlaying;
    },

    nextTrack(state) {
      if (!state.currentPlaylist.length) return;

      if (state.isShuffle && state.currentPlaylist.length > 1) {
        let nextIndex = state.currentIndex;
        while (nextIndex === state.currentIndex) {
          nextIndex = Math.floor(Math.random() * state.currentPlaylist.length);
        }
        state.currentIndex = nextIndex;
      } else {
        state.currentIndex =
          state.currentIndex < state.currentPlaylist.length - 1
            ? state.currentIndex + 1
            : 0;
      }

      state.currentTrack = state.currentPlaylist[state.currentIndex];
      state.isPlaying = true;
    },

    prevTrack(state) {
      if (!state.currentPlaylist.length) return;

      if (state.isShuffle && state.currentPlaylist.length > 1) {
        let prevIndex = state.currentIndex;
        while (prevIndex === state.currentIndex) {
          prevIndex = Math.floor(Math.random() * state.currentPlaylist.length);
        }
        state.currentIndex = prevIndex;
      } else {
        state.currentIndex =
          state.currentIndex > 0
            ? state.currentIndex - 1
            : state.currentPlaylist.length - 1;
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
  setPlaylist,
  playTrack,
  togglePlay,
  nextTrack,
  prevTrack,
  setVolume,
  toggleShuffle,
  toggleLoop,
} = playerSlice.actions;

export default playerSlice.reducer;
