"use client";

import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import Bar from "./components/Bar/Bar";

export default function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideBar = useMemo(() => {
    return pathname === "/login" || pathname === "/register";
  }, [pathname]);

  return (
    <>
      {children}
      {!hideBar && <Bar />}
    </>
  );
}
