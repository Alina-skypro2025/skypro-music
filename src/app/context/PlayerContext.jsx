"use client";

import { createContext, useContext, useRef, useState } from "react";
import { tracks } from "../data/tracks";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  
  const nextTrack = () => {
    const index = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (index + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };

  
  const prevTrack = () => {
    const index = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (index - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };


  const changeVolume = (value) => {
    const vol = Number(value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        tracks,
        currentTrack,
        isPlaying,
        volume,
        togglePlay,
        nextTrack,
        prevTrack,
        changeVolume,
        setCurrentTrack, 
        setIsPlaying,    
      }}
    >
      {children}
      <audio ref={audioRef} src={currentTrack.src} />
    </PlayerContext.Provider>
  );
}


export const usePlayer = () => useContext(PlayerContext);
