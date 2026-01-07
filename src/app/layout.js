import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import Image from "next/image";
import { LoadingProvider } from "@/context/LoadingContext";
import GlobalLoader from "@/components/GlobalLoader";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { getJSONArrayForSearch } from "@/lib/posts";
import SearchModal from "@/components/SearchModal";
import Link from "next/link";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import 'katex/dist/katex.min.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  /** 도메인 주소 */
  metadataBase: new URL("https://vorschlag-blog.vercel.app/"),

  title: {
    template: '%s | DevLog',
    default: "Vorschlag's DevLog",
  },
  description: "Next.js와 Tailwind CSS로 바닥부터 만든 레트로 감성 기술 블로그",

  keywords: ["Next.js", "React", "Tech Blog", "Retro UI", "개발 블로그"],

  /** 구글 서치 콘솔 설정 */
  verification: {
    google: 'Htjlq8zQw672rHdKDBD1kI5bsP718VLw9FgsJU5pMVo',
  },

  /** OG */
  openGraph: {
    title: "DevLog | 바닥부터 파보는 기술 블로그",
    description: "개발 지식과 트러블 슈팅을 기록하는 레트로 공간입니다.",
    url: "https://vorschlag-blog.vercel.app/",
    siteName: "DevLog",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({ children }) {
  // 빌드 타임 때 실행되어 JSON 데이터 준지
  const posts = getJSONArrayForSearch()
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
          <LoadingProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {/** 전역 로딩 컴포넌트 배치 */}
              <GlobalLoader />
              {/* 여기에 헤더 추가 */}
              <header className="relative z-50 max-w-5xl mx-auto p-2 md:p-4 border-b flex justify-between items-center">
                {/** 마스코트 추가 */}
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform">
                    <Image
                      src="/images/icon.png"
                      alt="Mascot"
                      fill
                      className="object-contain" /** 비율 유지 */
                      style={{ imageRendering: "pixellated" }}
                    />
                  </div>
                  <h1 className="hover-glitch text-base md:text-xl font-bold cursor-pointer text-black dark:text-white">
                    DevLog
                  </h1>
                </Link>
                {/* 검색 모달 추가 */}
                <SearchModal posts={posts} />
                <nav className="flex items-center gap-2 lg:gap-4">
                  <Link href="/about" className="text-sm md:text-base">About</Link>
                  <Link href="https://github.com/Vorschlag-bit">
                  <svg className="w-6 h-6 md:w-7 md:h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path fill="currentColor" d="M5 2h4v2H7v2H5V2Zm0 10H3V6h2v6Zm2 2H5v-2h2v2Zm2 2v-2H7v2H3v-2H1v2h2v2h4v4h2v-4h2v-2H9Zm0 0v2H7v-2h2Zm6-12v2H9V4h6Zm4 2h-2V4h-2V2h4v4Zm0 6V6h2v6h-2Zm-2 2v-2h2v2h-2Zm-2 2v-2h2v2h-2Zm0 2h-2v-2h2v2Zm0 0h2v4h-2v-4Z"/> </svg>
                  </Link>
                  <ThemeToggle/>
                </nav>
              </header>
              {/** 일반 페이지면 main/layout.js, 404면 not-fount.js */}
              <div className="flex-1 w-full">
                {children}
                <Analytics />
                <SpeedInsights />
              </div>
              {/** footer 추가 */}
              <footer className="max-w-5xl mx-auto px-4 border-t py-4 mt-5 lg:mt-10 text-center text-gray-500 text-sm">
                © 2025 Vorschlag Tech Blog
              </footer>
            </ThemeProvider>
          </LoadingProvider>
      </body>
    </html>
  );
}
