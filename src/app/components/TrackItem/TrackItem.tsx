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
    <div
      className={styles.playlist__item}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          {/* Фиолетовая точка слева от иконки, если трек текущий */}
          {isCurrent && (
            <div
              className={`${styles.track__indicator} ${
                isPlaying ? styles.track__indicator_pulse : ""
              }`}
            />
          )}

          <div className={styles.track__titleImage}>
            <svg className={styles.track__titleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
          </div>

          <span className={styles.track__titleLink}>{track.title}</span>
        </div>

        <div className={styles.track__author}>
          <span className={styles.track__authorLink}>{track.author}</span>
        </div>

        <div className={styles.track__album}>
          <span className={styles.track__albumLink}>{track.album}</span>
        </div>

        <div className={styles.track__time}>
          <span className={styles.track__timeText}>{track.duration}</span>
        </div>
      </div>
    </div>
  );
}
