"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";
import { clearAuthStorage } from "@/app/api/authApi";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthStorage();
    router.replace("/login");
  };

  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
      

        <div className={styles.sidebar__icon} onClick={handleLogout}>
          <Image src="/img/icon/logout.svg" width={24} height={24} alt="logout" />
        </div>
      </div>

      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/playlists/1">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist01.png"
                alt="day's playlist"
                width={250}
                height={150}
              />
            </Link>
          </div>

          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/playlists/2">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist02.png"
                alt="dance playlist"
                width={250}
                height={150}
              />
            </Link>
          </div>

          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/playlists/3">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist03.png"
                alt="indie playlist"
                width={250}
                height={150}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
