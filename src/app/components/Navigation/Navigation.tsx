"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Navigation.module.css";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clearAuthStorage } from "@/app/api/authApi";
import { useDispatch } from "react-redux";
import { clearFavoritesLocal } from "@/app/store/favoritesSlice";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  useEffect(() => {
    const token = localStorage.getItem("skypro_access");
    setIsAuth(Boolean(token));
  }, []);

  const handleLogout = useCallback(() => {
    clearAuthStorage();
    dispatch(clearFavoritesLocal());
    setIsAuth(false);
    setIsMenuOpen(false);

    
    if (pathname === "/favorites") {
      router.replace("/");
      return;
    }

    router.replace("/");
  }, [dispatch, pathname, router]);

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

      <button
        type="button"
        className={styles.nav__burger}
        onClick={toggleMenu}
        aria-label="Меню"
        aria-expanded={isMenuOpen}
      >
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </button>

      <div className={isMenuOpen ? styles.nav__menu_open : styles.nav__menu}>
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="/" className={styles.menu__link} onClick={() => setIsMenuOpen(false)}>
              Главное
            </Link>
          </li>

          
          <li className={styles.menu__item}>
            <Link
              href="/favorites"
              className={styles.menu__link}
              onClick={() => setIsMenuOpen(false)}
            >
              Мой плейлист
            </Link>
          </li>

          {!isAuth ? (
            <li className={styles.menu__item}>
              <Link
                href="/login"
                className={styles.menu__link}
                onClick={() => setIsMenuOpen(false)}
              >
                Войти
              </Link>
            </li>
          ) : (
            <li className={styles.menu__item}>
              <button onClick={handleLogout} className={styles.menu__linkButton}>
                Выйти
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
