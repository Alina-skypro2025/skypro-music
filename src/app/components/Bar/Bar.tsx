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

    audioRef.current.src = currentTrack.src;
    audioRef.current.load();
    setCurrentTime(0);

    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (currentTrack) dispatch(togglePlay());
  };

  const handlePrevClick = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch(prevTrack());
  };

  const handleNextClick = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch(nextTrack());
  };

  const handleShuffleClick = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleShuffle());
  };

  const handleLoopClick = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleLoop());
  };

  const handleVolumeChange = (e: any) => {
    dispatch(setVolume(Number(e.target.value)));
  };

  const handleTimeUpdate = () => {
    if (audioRef.current)
      setCurrentTime(audioRef.current.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current)
      setDuration(audioRef.current.duration || 0);
  };

  const handleEnded = () => {
    if (isLoop && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      dispatch(nextTrack());
    }
  };

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

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
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className={styles.bar__time}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className={styles.bar__playerBlock}>
            <div className={styles.bar__player}>
              <div className={styles.player__controls}>

                <div onClick={handlePrevClick} className={styles.player__btnPrev}>
                  <Image src="/img/icon/prev.svg" width={15} height={14} alt="prev" />
                </div>

                <div onClick={handleTogglePlay} className={styles.player__btnPlay}>
                  {isPlaying ? (
                    <Image src="/img/icon/pause.svg" width={22} height={20} alt="pause" />
                  ) : (
                    <Image src="/img/icon/play.svg" width={22} height={20} alt="play" />
                  )}
                </div>

                <div onClick={handleNextClick} className={styles.player__btnNext}>
                  <Image src="/img/icon/next.svg" width={15} height={14} alt="next" />
                </div>

                <div
                  onClick={handleLoopClick}
                  className={`${styles.player__btnRepeat} ${
                    isLoop ? styles.player__btnRepeat_active : ""
                  }`}
                >
                  <Image src="/img/icon/repeat.svg" width={18} height={12} alt="repeat" />
                </div>

                <div
                  onClick={handleShuffleClick}
                  className={`${styles.player__btnShuffle} ${
                    isShuffle ? styles.player__btnShuffle_active : ""
                  }`}
                >
                  <Image src="/img/icon/shuffle.svg" width={19} height={12} alt="shuffle" />
                </div>

              </div>

              <div className={styles.player__trackPlay}>
                <div className={styles.trackPlay__contain}>
                  <div className={styles.trackPlay__image}>
                    <Image src="/img/icon/note.svg" width={18} height={17} alt="note" />
                  </div>

                  <div className={styles.trackPlay__author}>
                    <span>{currentTrack?.author}</span>
                  </div>

                  <div className={styles.trackPlay__album}>
                    <span>{currentTrack?.title}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.bar__volumeBlock}>
              <div className={styles.volume__content}>
                <div className={styles.volume__image}>
                  <Image src="/img/icon/volume.svg" width={18} height={18} alt="volume" />
                </div>

                <div className={styles.volume__progress}>
                  <input
  type="range"
  min="0"
  max="1"
  step="0.01"
  value={volume}
  className={styles.volume__progressLine}
  onChange={handleVolumeChange}
/>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </>
  );
}
