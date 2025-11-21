---
title: "다크 모드 만들기"
date: "2025-11-21"
description: "블로그의 다크 모드를 시스템 설정 및 사용자 설정이 가능하게 구현해보기"
---

## 다크 모드를 만들어보자

Tailwind CSS와 Next.js 조합에서 다크모드는 **`next-themes`** 라는 라이브러리를 쓰는 게 국룰이란다. 시스템 설정(OS)을 따라가기도 하고, 버튼으로 끄고 켤 수도 있게 해준다.

#### 1단계: 라이브러리 설치
터미널에 아래의 명령어를 입력한다.

```bash
npm install next-themes react-icons
```
*(아이콘을 쉽게 쓰려고 `react-icons`도 같이 설치)*

#### 2단계: Provider 만들기 (중요 ⭐)
Next.js 13+ (App Router)에서는 `layout.js`가 서버에서 동작한다. 하지만 테마 변경은 브라우저(클라이언트)에서 일어나는 일이라, **별도의 컴포넌트로 감싸줘야 한다.**

`src/components` 폴더를 만들고, 그 안에 `ThemeProvider.js` 파일을 생성.

```javascript
// src/components/ThemeProvider.js
"use client"; // 이거 필수! (클라이언트 컴포넌트 선언)

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

#### 3단계: 레이아웃에 적용하기 (`layout.js`)
이제 방금 만든 Provider로 우리 블로그 전체를 감싸준다.

```javascript
// 1. import 추가
import { ThemeProvider } from "@/components/ThemeProvider"; 
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning> 
      {/* suppressHydrationWarning: 테마 적용 시 깜빡임 경고 무시용 */}
      
      <body className="max-w-3xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
        {/* 2. ThemeProvider로 감싸기 (attribute="class" 필수) */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="...">
             {/* ... 기존 헤더 내용 ... */}
          </header>
          
          <main>{children}</main>
          
          <footer className="...">
             {/* ... 기존 푸터 내용 ... */}
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
```
> **💡 포인트:** `body` 태그의 클래스를 봐보면
> `dark:bg-gray-900 dark:text-gray-100`
> "다크모드일 땐(`dark:`) 배경을 어둡게, 글자는 밝게 해라"라는 의미이다.

#### 4단계: 토글 버튼 만들기 🔘
이제 사용자가 누를 버튼을 생성해보자.
`src/components/ThemeToggle.js` 파일을 만든 후

```javascript
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa"; // 아이콘

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect를 쓰는 이유: 서버와 클라이언트의 HTML 불일치 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
    </button>
  );
}
```

#### 5단계: 헤더에 버튼 달기
마지막으로 `src/app/layout.js`의 헤더 부분에 버튼을 넣어주자.

```javascript
// layout.js 상단에 import
import ThemeToggle from "@/components/ThemeToggle";

// ... (중략) ...

<header className="border-b py-4 mb-8 flex justify-between items-center">
  <h1 className="text-xl font-bold">DevLog</h1>
  <nav className="flex items-center gap-4"> {/* flex로 묶어주세요 */}
    <a href="/" className="hover:text-blue-500">Home</a>
    <a href="/about" className="hover:text-blue-500">About</a>
    
    {/* 버튼 추가! */}
    <ThemeToggle />
  </nav>
</header>
```

#### 다크모드 적용 시
![dark예시](/images/darkmode-ex.png)
#### 라이트모드 적용 시
![light예시](/images/lightmode-ex.png)
