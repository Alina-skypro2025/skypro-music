"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import Image from "next/image";
import styles from "./Bar.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  togglePlay,
  setVolume,
  nextTrack,
  prevTrack,
  toggleShuffle,
  toggleLoop,
} from "@/app/store/playerSlice";

function formatTime(seconds: number) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}

export default function Bar() {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, volume, isShuffle, isLoop } = useSelector(
    (state: any) => state.player
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    audioRef.current.src = currentTrack.src || currentTrack.track_file;
    audioRef.current.load();
    setCurrentTime(0);

    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying
      ? audioRef.current.play().catch(() => {})
      : audioRef.current.pause();
  }, [isPlaying]);

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.bar__content}>
        
          <div
            className={styles.bar__playerProgress}
            onClick={handleProgressClick}
          >
            <div
              className={styles.bar__playerProgressFilled}
              style={{
                width: `${(currentTime / duration) * 100 || 0}%`,
              }}
            />
          </div>

         
          <div className={styles.bar__time}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          
          <div className={styles.bar__playerBlock}>
            <div className={styles.bar__player}>
              <div className={styles.player__controls}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => dispatch(prevTrack())}
                >
                  <Image src="/img/icon/prev.svg" width={15} height={14} alt="prev" />
                </button>

                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => dispatch(togglePlay())}
                >
                  <Image
                    src={isPlaying ? "/img/icon/pause.svg" : "/img/icon/play.svg"}
                    width={22}
                    height={20}
                    alt={isPlaying ? "pause" : "play"}
                  />
                </button>

                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => dispatch(nextTrack())}
                >
                  <Image src="/img/icon/next.svg" width={15} height={14} alt="next" />
                </button>

                <button
                  type="button"
                  className={`${styles.iconBtn} ${isLoop ? styles.player__btnRepeat_active : ""}`}
                  onClick={() => dispatch(toggleLoop())}
                >
                  <Image src="/img/icon/repeat.svg" width={18} height={12} alt="repeat" />
                </button>

                <button
                  type="button"
                  className={`${styles.iconBtn} ${isShuffle ? styles.player__btnShuffle_active : ""}`}
                  onClick={() => dispatch(toggleShuffle())}
                >
                  <Image src="/img/icon/shuffle.svg" width={19} height={12} alt="shuffle" />
                </button>
              </div>

              <div className={styles.player__trackPlay}>
                <div className={styles.trackPlay__image} />
                <div>
                  <div className={styles.trackPlay__author}>
                    {currentTrack?.author}
                  </div>
                  <div className={styles.trackPlay__album}>
                    {currentTrack?.title}
                  </div>
                </div>
              </div>
            </div>

            
            <div className={styles.bar__volumeBlock}>
              <div className={styles.volume__content}>
                <Image
                  className={styles.volume__image}
                  src="/img/icon/volume.svg"
                  width={13}
                  height={18}
                  alt="volume"
                />

                <div className={styles.volume__progress}>
                  <input
                    className={styles.volume__progressLine}
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => dispatch(setVolume(Number(e.target.value)))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => {
          if (!audioRef.current) return;

          if (isLoop) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
            return;
          }

          dispatch(nextTrack());
        }}
      />
    </>
  );
}
