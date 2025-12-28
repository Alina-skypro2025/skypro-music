"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";
import { apiGetTokens, apiLogin, saveTokens } from "@/app/api";

export default function Signin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText("");

    if (!email.trim() || !password.trim()) {
      setErrorText("Заполни почту и пароль");
      return;
    }

    try {
      setIsLoading(true);

      
      await apiLogin(email.trim(), password);

      
      const tokens = await apiGetTokens(email.trim(), password);
      saveTokens(tokens);

     
      router.push("/");
    } catch (err: any) {
      setErrorText(err?.message || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form} onSubmit={onSubmit}>
            <div className={styles.modal__logo}>
              <img src="/img/logo_modal.png" alt="logo" />
            </div>

            <input
              className={`${styles.modal__input} ${styles.login}`}
              type="text"
              name="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <input
              className={styles.modal__input}
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <div className={styles.errorContainer}>
              {errorText ? <span>{errorText}</span> : null}
            </div>

            <button className={styles.modal__btnEnter} type="submit" disabled={isLoading}>
              {isLoading ? "Входим..." : "Войти"}
            </button>

            <Link href="/register" className={styles.modal__btnSignup}>
              Зарегистрироваться
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
