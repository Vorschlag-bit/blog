import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Image from "next/image";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import "./globals.css";
import "highlight.js/styles/github-dark.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: '%s | DevLog',
    default: "Vorschlag's DevLog",
  },
  description: "Next.js와 Tailwind CSS로 바닥부터 만든 레트로 감성 기술 블로그",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/** 갈무리 폰트 불러오기 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css"
        />
      </head>
      <body className="dark:bg-gray-900 dark:text-gray-100 font-[Galmuri11]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* 여기에 헤더 추가 */}
          <header className="max-w-4xl mx-auto px-4 border-b py-4 mb-8 flex justify-between items-center">
            {/** 마스코트 추가 */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:-rotate-12">
                <Image
                  src="/images/icon.png"
                  alt="Mascot"
                  fill
                  className="object-contain" /** 비율 유지 */
                  style={{ imageRendering: "pixellated" }}
                />
              </div>
              <h1 className="text-xl font-bold cursor-pointer text-black dark:text-white">
                DevLog
              </h1>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="https://github.com/Vorschlag-bit">
              <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path fill="currentColor" d="M5 2h4v2H7v2H5V2Zm0 10H3V6h2v6Zm2 2H5v-2h2v2Zm2 2v-2H7v2H3v-2H1v2h2v2h4v4h2v-4h2v-2H9Zm0 0v2H7v-2h2Zm6-12v2H9V4h6Zm4 2h-2V4h-2V2h4v4Zm0 6V6h2v6h-2Zm-2 2v-2h2v2h-2Zm-2 2v-2h2v2h-2Zm0 2h-2v-2h2v2Zm0 0h2v4h-2v-4Z"/> </svg>
              </Link>
              <ThemeToggle/>
            </nav>
          </header>
          {/* children = 내가 만들 main 페이지 들어가는 곳 */}
          <main className="max-w-5xl mx-auto px-4">
            {children}
          </main>
          {/** footer 추가 */}
          <footer className="max-w-4xl mx-auto px-4 border-t py-4 mt-10 text-center text-gray-500 text-sm">
            © 2025 Vorschlag Tech Blog
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
