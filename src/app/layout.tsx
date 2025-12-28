import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./Providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skypro.Music",
  description: "Учебный музыкальный плеер",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        <ReduxProvider>
          {/* Контейнер контента со встроенным отступом под плеер */}
          <main className="page-content">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
