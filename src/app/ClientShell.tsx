"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Bar from "./components/Bar/Bar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  
  const hasAccessToken = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("skypro_access"));
  }, []);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register");

  const shouldShowPlayer = !isAuthPage && hasAccessToken;

  return (
    <>
      {children}
      {shouldShowPlayer ? <Bar /> : null}
    </>
  );
}
