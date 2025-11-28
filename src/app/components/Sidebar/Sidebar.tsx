
import Link from 'next/link';
import Image from 'next/image';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>Sergey.Ivanov</p>
       <div className={styles.sidebar__icon}>
  <Image 
    src="/img/icon/logout.svg" 
    width={24}
    height={24}
    alt="logout"
  />
</div>

      </div>

      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/">
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
            <Link className={styles.sidebar__link} href="/">
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
            <Link className={styles.sidebar__link} href="/">
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
