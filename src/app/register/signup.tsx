"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";
import { signUpUser } from "../api/auth";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }

  if (typeof err === "object" && err !== null && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }

  return "Ошибка регистрации";
}

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      setLoading(true);

      await signUpUser({
        email,
        password,
        username: email,
      });

      router.push("/login");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form} onSubmit={handleSubmit}>
            <div className={styles.modal__logo}>
              <img src="/img/logo_modal.png" alt="logo" />
            </div>

            <input
              className={styles.modal__input}
              type="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className={styles.modal__input}
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className={styles.modal__input}
              type="password"
              placeholder="Повторите пароль"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />

            {error && <div className={styles.errorContainer}>{error}</div>}

            <button
              type="submit"
              className={styles.modal__btnSignupEnt}
              disabled={loading}
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
