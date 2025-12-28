"use client";

import styles from "./TrackItem.module.css";
import { useDispatch, useSelector } from "react-redux";
import { playTrack } from "@/app/store/playerSlice";

export default function TrackItem({ track }: any) {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector(
    (state: any) => state.player
  );

  const isCurrent = currentTrack?.id === track.id;

  return (
    <div
      className={styles.playlist__item}
      onClick={() => dispatch(playTrack(track))}
    >
      <div className={styles.playlist__track}>
        <div className={styles.track__iconWrapper}>
          <div className={styles.track__icon}>
            {isCurrent && (
              <div
                className={`${styles.track__indicator} ${
                  isPlaying ? styles.track__indicator_pulse : ""
                }`}
              />
            )}
          </div>
          <span>{track.title}</span>
        </div>

        <span>{track.author}</span>
        <span>{track.album}</span>
        <span>{track.duration}</span>
      </div>
    </div>
  );
}
