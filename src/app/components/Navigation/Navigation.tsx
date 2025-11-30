"use client";



import Link from 'next/link';
import Image from 'next/image';
import styles from './Navigation.module.css';
import { useState } from "react"; 

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const toggleMenu = () => setIsMenuOpen(prev => !prev); 
  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          className={styles.logo__image}
          src="/img/logo.png"
          alt="logo"
          width={113}
          height={17}
          priority
        />
      </div>

     <div className={styles.nav__burger} onClick={toggleMenu}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>

            <div
        className={
          isMenuOpen ? styles.nav__menu_open : styles.nav__menu
        }
      >
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="/" className={styles.menu__link}>
              Главное
            </Link>
          </li>

          <li className={styles.menu__item}>
            <Link href="/playlist" className={styles.menu__link}>
              Мой плейлист
            </Link>
          </li>

          <li className={styles.menu__item}>
            <Link href="/login" className={styles.menu__link}>
              Войти
            </Link>
          </li>
        </ul>
      </div>

    </nav>
  );
}
