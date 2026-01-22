"use client";

import { useEffect, useMemo, useRef, useState, MouseEvent, useCallback } from "react";
import Image from "next/image";
import styles from "./Bar.module.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store/store";

import {
  togglePlay,
  setVolume,
  nextTrack,
  prevTrack,
  toggleShuffle,
  toggleLoop,
} from "@/app/store/playerSlice";

import { addToFavorite, removeFromFavorite } from "@/app/api/favoritesApi";
import { setLikedLocal, clearFavoritesError } from "@/app/store/favoritesSlice";
import { useRouter } from "next/navigation";

function formatTime(seconds: number) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}

function normalizeSrc(raw: unknown): string {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;
  return `/${s}`;
}

export default function Bar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { currentTrack, isPlaying, volume, isShuffle, isLoop } = useSelector(
    (state: RootState) => state.player
  );
  const likedMap = useSelector((state: RootState) => state.favorites?.ids || {});
  const favError = useSelector((state: RootState) => state.favorites?.error || "");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const trackId = useMemo(() => String(currentTrack?.id ?? ""), [currentTrack?.id]);
  const isLiked = useMemo(
    () => (trackId ? Boolean(likedMap?.[trackId]) : false),
    [likedMap, trackId]
  );

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const src = normalizeSrc((currentTrack as unknown as { src?: unknown; track_file?: unknown }).src ??
      (currentTrack as unknown as { track_file?: unknown }).track_file);

    if (!src) return;

    audioRef.current.src = src;
    audioRef.current.load();
    setCurrentTime(0);

    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
  }, [isPlaying]);

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const onToggleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(clearFavoritesError());

      const token =
        typeof window !== "undefined" ? localStorage.getItem("skypro_access") : null;
      if (!token) {
        router.replace("/login");
        return;
      }

      if (!trackId) return;

      try {
        setIsLikeLoading(true);

        
        dispatch(setLikedLocal({ trackId, liked: !isLiked }));

        if (!isLiked) await addToFavorite(trackId);
        else await removeFromFavorite(trackId);
      } catch {
        
        dispatch(setLikedLocal({ trackId, liked: isLiked }));
      } finally {
        setIsLikeLoading(false);
      }
    },
    [dispatch, isLiked, router, trackId]
  );

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.bar__content}>
          <div className={styles.bar__playerProgress} onClick={handleProgressClick}>
            <div
              className={styles.bar__playerProgressFilled}
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>

          <div className={styles.bar__time}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className={styles.bar__playerBlock}>
            <div className={styles.bar__player}>
              <div className={styles.player__controls}>
                <button type="button" className={styles.iconBtn} onClick={() => dispatch(prevTrack())}>
                  <Image src="/img/icon/prev.svg" width={15} height={14} alt="prev" />
                </button>

                <button type="button" className={styles.iconBtn} onClick={() => dispatch(togglePlay())}>
                  <Image
                    src={isPlaying ? "/img/icon/pause.svg" : "/img/icon/play.svg"}
                    width={22}
                    height={20}
                    alt={isPlaying ? "pause" : "play"}
                  />
                </button>

                <button type="button" className={styles.iconBtn} onClick={() => dispatch(nextTrack())}>
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
  {typeof (currentTrack as unknown as { author?: unknown })?.author === "string"
    ? (currentTrack as unknown as { author?: string }).author
    : ""}
</div>
<div className={styles.trackPlay__album}>
  {typeof (currentTrack as unknown as { title?: unknown })?.title === "string"
    ? (currentTrack as unknown as { title?: string }).title
    : ""}
</div>

                </div>

                <button
                  type="button"
                  className={`${styles.iconBtn} ${isLiked ? styles.likeBtn_active : ""}`}
                  onClick={onToggleLike}
                  disabled={isLikeLoading || !trackId}
                  aria-label={isLiked ? "Убрать из избранного" : "Добавить в избранное"}
                  style={{ marginLeft: 16 }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={isLiked ? "#AD61FF" : "none"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 21s-7.5-4.6-10-9.4C.4 8 2.2 4.8 5.6 4.1 7.7 3.7 9.6 4.7 12 7c2.4-2.3 4.3-3.3 6.4-2.9C21.8 4.8 23.6 8 22 11.6 19.5 16.4 12 21 12 21z"
                      stroke={isLiked ? "#AD61FF" : "#B1B1B1"}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {favError ? (
                <div style={{ color: "#ff4d4f", fontSize: 12, marginLeft: 12 }}>{favError}</div>
              ) : null}
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
