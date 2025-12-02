---
title: "나만의 픽셀 로딩바 구현하기 (feat. Router Interception)"
date: "2025-12-02 12:49:40"
category: "개발"
description: "loading.js가 아닌 router interception을 활용한 커스텀 로딩창을 만들어보자."
---

## 레트로 감성을 더하고, 다양한 기능을 구현해보기 위한 로딩바 구현
내 블로그의 컨셉은 <strong>레트로(Retro)와 픽셀 아트(Pixel Art)</strong>이다.  
이전에 한 번 타인의 개발 블로그를 보다가 커스텀 로딩창을 봤던 게 인상이 깊었는데, 직접 개발해보면서 원리와 과정을 깨우치면
좋을 거 같다고 생각이 들어서 커스터 로딩창의 설계 및 구현을 해보기로 결심했다.
글을 읽고 페이지를 이동할 때, 요즘 웹사이트들은 **앱**처럼 매끄러운 이동을 지향하기 때문에 사실 이런 커스텀 로딩창을 만드는 것은
성능적으로는 좋지 않으나, 이 블로그는 내가 하고 싶은 것들을 직접 구현할 수 있는 무한한 자유가 보장된다는 점 그리고 반대로 로딩창이 존재한다는 것은
**즉각적인 피드백**을 줄 수 있다는 점에서 마냥 손해라고는 생각하지 않았다.

이 글은 **Next.js**에서 지원하는 단순히 성능만을 고려한 순수한 로딩화면인 `loading.js`를 넘어, Next.js의 라우팅 시스템을 커스텀해 **전역 로딩 시스템**을 구축한 과정을 다룬다.

### 1. 문제의 정의: Next.js는 너무 똑똑하다
내 블로그는 Next.js 13+ App Router로 동작하는데, 이 프레임워크는 UX(사용자 경험)을 **Soft Navigation**을 지향한다.
- **Next.js의 기본동작**: 링크를 클릭하면, 다음 페이지의 데이터가 준비될 때까지 **현재 페이지를 그대로 유지**한다. 사용자는 화면이 멈춘 것처럼 느끼다가 데이터가 다 올 경우 한 순간에 화면이 모두 바뀐다.
- **내가 원하는 동작**: 링크를 클릭하는 순간 **즉시** 로딩창으로 덮고(Blocking), 게이지가 차오르는 애니메이션을 보여주고 싶음.

Next.js가 기본으로 제공하는 `loading.js`는 초기 접속이나 새로 고침과 같이 **DOM**이 새로 그려지는 순간에는 잘 동작하나, 페이지 간의 이동(transition)에는 **현재 화면 유지**전략 때문에 내가 원하는 **Full Screen Blocking Loading**을 구현하기엔 어려웠다.

### 2. 설계: 라우팅 가로채기(Interception)
이를 해결하기 위해선 Next.js의 기본 `<Link>` 동작을 잠시 멈추고, 내가 원하는 작업을 중간에 끼워넣어야 했다.  
전체적으로 필요한 구성은 아래와 같이 정리할 수 있었다.  
- **1. GlobalState**: 앱 전체에서 로딩 중인지를 관리하는 ContextAPI
- **2. UI**: 화면 최상단(`z-[9999]`)을 덮는 픽셀 스타일 로딩 컴포넌트
- **3. Trigger**: 링크 클릭 시 이동을 잠시 막고, 로딩 스위치를 켜는 커스텀 링크(`LoadingLink`)

### 3. 구현 과정
#### 3-1. 상태 관리소 만들기 (Context)
먼저 로딩 상태(`true/false`)를 전역적으로 관리할 `Context`를 만들었다. 페이지 이동이 완료되면(`pathName` 변경 감지) 자동으로 로딩을 꺼주는 것이 핵심이다.
```javascript
// src/context/LoadingContext.js
"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // 페이지 이동이 완료(URL 변경)되면 로딩을 끈다.
    useEffect(() => {
        setIsLoading(false)
    }, [pathname, searchParams])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}
```

#### 3-2. Pixel Art Loader 구현(UI)
블로그 컨셉에 맞춰 CSS(`Tailwind`)로 픽셀느낌을 냈다. 실제 데이터 로딩을 알 수는 없어서, `Math.random()`을 사용해 그럴듯하게 차오르는
**가짜 진행률** 로직을 구현했다.