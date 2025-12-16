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

  shuffleOrder: [] as number[], 
  shuffleIndex: 0, 
};

function makeShuffleOrder(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    
    playTrack(state, action) {
      const track = action.payload;
      const index = state.currentPlaylist.findIndex((t) => t.id === track.id);

      if (index !== -1) {
        state.currentTrack = track;
        state.currentIndex = index;
        state.isPlaying = true;

        
        if (state.isShuffle) {
          const order = makeShuffleOrder(state.currentPlaylist.length);
          state.shuffleOrder = order;
          state.shuffleIndex = order.indexOf(index);
        }
      }
    },

    
    togglePlay(state) {
      if (!state.currentTrack) return;
      state.isPlaying = !state.isPlaying;
    },

    setPlaying(state, action) {
      state.isPlaying = action.payload;
    },

    setVolume(state, action) {
      state.volume = action.payload;
    },

    
    nextTrack(state) {
      const length = state.currentPlaylist.length;
      if (length === 0) return;

      if (state.isShuffle) {
        
        if (
          state.shuffleOrder.length === 0 ||
          state.shuffleOrder.length !== length
        ) {
          const order = makeShuffleOrder(length);
          state.shuffleOrder = order;
          state.shuffleIndex = order.indexOf(state.currentIndex);
        }

        if (state.shuffleIndex < state.shuffleOrder.length - 1) {
          state.shuffleIndex += 1;
          const nextIndex = state.shuffleOrder[state.shuffleIndex];
          state.currentIndex = nextIndex;
          state.currentTrack = state.currentPlaylist[nextIndex];
          state.isPlaying = true;
        } else {
          
          state.isPlaying = false;
        }
      } else {
        
        if (state.currentIndex < length - 1) {
          state.currentIndex += 1;
          state.currentTrack = state.currentPlaylist[state.currentIndex];
          state.isPlaying = true;
        } else {
         
          state.isPlaying = false;
        }
      }
    },

    
    prevTrack(state) {
      const length = state.currentPlaylist.length;
      if (length === 0) return;

      if (state.isShuffle) {
        if (
          state.shuffleOrder.length === 0 ||
          state.shuffleOrder.length !== length
        ) {
          const order = makeShuffleOrder(length);
          state.shuffleOrder = order;
          state.shuffleIndex = order.indexOf(state.currentIndex);
        }

        if (state.shuffleIndex > 0) {
          state.shuffleIndex -= 1;
          const prevIndex = state.shuffleOrder[state.shuffleIndex];
          state.currentIndex = prevIndex;
          state.currentTrack = state.currentPlaylist[prevIndex];
          state.isPlaying = true;
        } else {
         
        }
      } else {
        if (state.currentIndex > 0) {
          state.currentIndex -= 1;
          state.currentTrack = state.currentPlaylist[state.currentIndex];
          state.isPlaying = true;
        } else {
         
        }
      }
    },

   
    toggleShuffle(state) {
      state.isShuffle = !state.isShuffle;

      if (state.isShuffle) {
        const length = state.currentPlaylist.length;
        const order = makeShuffleOrder(length);
        state.shuffleOrder = order;
        state.shuffleIndex = order.indexOf(state.currentIndex);
      } else {
        state.shuffleOrder = [];
        state.shuffleIndex = 0;
      }
    },

   
    toggleLoop(state) {
      state.isLoop = !state.isLoop;
    },
  },
});

export const {
  playTrack,
  togglePlay,
  setPlaying,
  setVolume,
  nextTrack,
  prevTrack,
  toggleShuffle,
  toggleLoop,
} = playerSlice.actions;

export default playerSlice.reducer;
