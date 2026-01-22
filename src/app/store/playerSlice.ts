import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { tracks as allTracks } from "@/app/data/tracks";

type TrackNormalized = {
  id: number;
  title: string;
  author: string;
  album: string;
  duration: number;
  src: string;
  
  track_file: string;
};

type PlayerState = {
  tracks: TrackNormalized[];
  currentPlaylist: TrackNormalized[];
  currentTrack: TrackNormalized | null;
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  isShuffle: boolean;
  isLoop: boolean;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizeSrc(raw: unknown): string {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;
  return `/${s}`;
}

function normalizeTrack(t: unknown): TrackNormalized {
  const obj: Record<string, unknown> = isRecord(t) ? t : {};

  const id = Number(obj.id ?? obj._id);

  const srcRaw = obj.src ?? obj.track_file ?? "";
  const src = normalizeSrc(srcRaw);

  return {
    id,
    title: String(obj.title ?? obj.name ?? ""),
    author: String(obj.author ?? ""),
    album: String(obj.album ?? ""),
    duration: Number(obj.duration ?? obj.duration_in_seconds ?? 0),
    src,

    
    track_file: src,
  };
}

const normalized: TrackNormalized[] = (Array.isArray(allTracks) ? allTracks : [])
  .map((t) => normalizeTrack(t))
  .filter((t) => Number.isFinite(t.id) && t.id > 0 && Boolean(t.src));

const initialState: PlayerState = {
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
    setPlaylist(state, action: PayloadAction<unknown>) {
      const payload = action.payload;

      const list = (Array.isArray(payload) ? payload : [])
        .map((t) => normalizeTrack(t))
        .filter((t) => Number.isFinite(t.id) && t.id > 0 && Boolean(t.src));

      if (list.length === 0) return;

      state.currentPlaylist = list;

      const idx = state.currentTrack
        ? list.findIndex((t) => t.id === state.currentTrack?.id)
        : -1;

      if (idx === -1) {
        state.currentIndex = 0;
        state.currentTrack = list[0];
      } else {
        state.currentIndex = idx;
        state.currentTrack = list[idx];
      }
    },

    playTrack(state, action: PayloadAction<unknown>) {
      const track = normalizeTrack(action.payload);

      const index = state.currentPlaylist.findIndex((t) => t.id === track.id);

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

    setVolume(state, action: PayloadAction<number>) {
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
