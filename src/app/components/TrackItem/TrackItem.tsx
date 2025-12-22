"use client";

import styles from "./TrackItem.module.css";
import { useDispatch, useSelector } from "react-redux";
import { playTrack } from "@/app/store/playerSlice";

export default function TrackItem({ track }: any) {
  const dispatch = useDispatch();

  const { currentTrack, isPlaying } = useSelector(
    (state: any) => state.player
  );

  const isCurrent = currentTrack && currentTrack.id === track.id;

  const handleClick = () => {
    dispatch(playTrack(track));
  };

  return (
    <div className={styles.playlist__item} onClick={handleClick}>
      <div className={styles.playlist__track}>

        {/* Иконка трека + фиолетовая точка + название */}
        <div className={styles.track__iconWrapper}>
          <div className={styles.track__icon}>
            {isCurrent && (
              <div
                className={`${styles.track__indicator} ${
                  isPlaying ? styles.track__indicator_pulse : ""
                }`}
              />
            )}

            <svg className={styles.track__iconSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
          </div>

          <span className={styles.track__titleLink}>{track.title}</span>
        </div>

        {/* Автор */}
        <div className={styles.track__author}>
          <span className={styles.track__authorLink}>{track.author}</span>
        </div>

        {/* Альбом */}
        <div className={styles.track__album}>
          <span className={styles.track__albumLink}>{track.album}</span>
        </div>

        {/* Время */}
        <div className={styles.track__time}>
          <span className={styles.track__timeText}>{track.duration}</span>
        </div>

      </div>
    </div>
  );
}
