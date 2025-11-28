"use client";

import styles from "./TrackItem.module.css";
import { usePlayer } from "@/app/context/PlayerContext";

export default function TrackItem({ track }) {
  const { setCurrentTrack, setIsPlaying, audioRef } = usePlayer() as any;

  const playTrack = () => {
    setCurrentTrack(track);
    setIsPlaying(true);

    setTimeout(() => {
      audioRef?.current?.play();
    }, 100);
  };

  return (
    <div
      className={styles.playlist__item}
      onClick={playTrack}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.playlist__track}>
        
        <div className={styles.track__title}>
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
