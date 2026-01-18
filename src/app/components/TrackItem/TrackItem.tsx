"use client";

import styles from "./TrackItem.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { playTrack } from "@/app/store/playerSlice";
import { addToFavorite, removeFromFavorite } from "@/app/api/favoritesApi";
import { setLikedLocal } from "@/app/store/favoritesSlice";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackItem({ track }: any) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state: any) => state.player);
  const likedMap = useSelector((state: any) => state.favorites.ids);

  const [likeError, setLikeError] = useState("");
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const isCurrent = currentTrack?.id === track.id;

  const trackId = useMemo(() => String(track.id), [track.id]);
  const isLiked = useMemo(() => Boolean(likedMap?.[trackId]), [likedMap, trackId]);

  const onPlay = useCallback(() => {
    dispatch(playTrack(track));
  }, [dispatch, track]);

  const onToggleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      setLikeError("");

      const token = localStorage.getItem("skypro_access");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        setIsLikeLoading(true);

        
        dispatch(setLikedLocal({ trackId, liked: !isLiked }));

        if (!isLiked) await addToFavorite(trackId);
        else await removeFromFavorite(trackId);
      } catch (err: any) {
        
        dispatch(setLikedLocal({ trackId, liked: isLiked }));
        setLikeError(err?.message || "Ошибка запроса к серверу");
      } finally {
        setIsLikeLoading(false);
      }
    },
    [dispatch, isLiked, router, trackId]
  );

  return (
    <div className={styles.playlist__item} onClick={onPlay}>
      <div className={styles.playlist__track}>
        <div className={styles.track__iconWrapper}>
          <div className={styles.track__icon}>
            {isCurrent ? (
              <div
                className={`${styles.track__indicator} ${
                  isPlaying ? styles.track__indicator_pulse : ""
                }`}
              />
            ) : (
              <Image
                src="/img/icon/note.svg"
                width={16}
                height={16}
                alt="note"
                className={styles.track__note}
              />
            )}
          </div>

          <span className={styles.track__title}>{track.title}</span>
        </div>

        <span>{track.author}</span>
        <span>{track.album}</span>

        <div className={styles.track__right}>
          <button
            type="button"
            className={`${styles.likeBtn} ${isLiked ? styles.likeBtn_active : ""}`}
            onClick={onToggleLike}
            disabled={isLikeLoading}
            aria-label={isLiked ? "Убрать из избранного" : "Добавить в избранное"}
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

          <span className={styles.track__duration}>{track.duration}</span>
        </div>
      </div>

      {likeError ? <div className={styles.likeError}>{likeError}</div> : null}
    </div>
  );
}
