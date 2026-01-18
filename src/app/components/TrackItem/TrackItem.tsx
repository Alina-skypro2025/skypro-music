"use client";

import styles from "./TrackItem.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { playTrack } from "@/app/store/playerSlice";

export default function TrackItem({ track }: any) {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state: any) => state.player);

  const isCurrent = currentTrack?.id === track.id;

  const onPlay = () => {
    dispatch(playTrack(track));
  };

  return (
    <div className={styles.playlist__item} onClick={onPlay}>
      <div className={styles.playlist__track}>
        <div className={styles.track__iconWrapper}>
          <div className={styles.track__icon} onClick={onPlay}>
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

          <span>{track.title}</span>
        </div>

        <span>{track.author}</span>
        <span>{track.album}</span>
        <span>{track.duration}</span>
      </div>
    </div>
  );
}
