"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Navigation.module.css";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  
  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuth(!!token);
  }, []);

  
  const handleLogout = () => {
    localStorage.removeItem("access");
    setIsAuth(false);
  };

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

          {!isAuth ? (
            <li className={styles.menu__item}>
              <Link href="/login" className={styles.menu__link}>
                Войти
              </Link>
            </li>
          ) : (
            <li className={styles.menu__item}>
              <button
                onClick={handleLogout}
                className={styles.menu__link}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Выйти
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
