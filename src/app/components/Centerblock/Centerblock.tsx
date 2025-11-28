"use client";

import styles from "./Centerblock.module.css";
import { usePlayer } from "@/app/context/PlayerContext";
import { tracks } from "@/app/data/tracks";
import TrackItem from "@/app/components/TrackItem/TrackItem";


type Track = {
  id: number;
  title: string;
  author: string;
  album: string;
  duration: string;
  src: string;
};

export default function Centerblock() {
  const { setCurrentTrack, audioRef, setIsPlaying } = usePlayer() as any;

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef?.current) {
        audioRef.current.play();
      }
    }, 100);
  };

  return (
    <div className={styles.centerblock}>
      <div className={styles.centerblock__search}>
        <svg className={styles.search__svg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
        </svg>
        <input
          className={styles.search__text}
          type="search"
          placeholder="Поиск"
        />
      </div>

      <h2 className={styles.centerblock__h2}>Треки</h2>

      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={`${styles.playlistTitle__col} ${styles.col01}`}>
            Трек
          </div>
          <div className={`${styles.playlistTitle__col} ${styles.col02}`}>
            Исполнитель
          </div>
          <div className={`${styles.playlistTitle__col} ${styles.col03}`}>
            Альбом
          </div>
          <div className={`${styles.playlistTitle__col} ${styles.col04}`}></div>
        </div>

       <div className={styles.content__playlist}>
  {tracks.map((track) => (
    <TrackItem key={track.id} track={track} />
  ))}
</div>

      </div>
    </div>
  );
}
