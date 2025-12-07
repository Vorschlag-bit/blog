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
```javascript
// src/components/GlobalLoader.js
"use client"
// ... imports

export default function GlobalLoader() {
    const { isLoading } = useLoading()
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!isLoading) {
            setCount(0); return;
        }
        // 0.1초마다 랜덤하게 게이지 증가
        const timerId = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) return 100;
                return prev + Math.floor(Math.random() * 10) + 1;
            })
        }, 30) // 체감상 0.03초마다 증가가 제일 적절함
        return () => clearInterval(timerId)
    }, [isLoading]); // isLoading이 켜질 때마다 실행

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/200 dark:bg-gray-900/200 backdrop-blur-sm">
            {/* 픽셀 스타일 박스 및 게이지 바 구현 */}
            <div className="text-2xl font-bold font-[Galmuri11 Bold]">
                NOW LOADING... {Math.floor(count)}%
            </div>
        </div>
    )
}
```
#### 3-3. 커스텀 링크 구현 (Interceptor)
가장 중요한 부분이다. `next/link` 대신 `useRouter`를 사용해 이동과정을 수동으로 제어했다.
```javascript
// src/components/LoadingLink.js
"use client"
import { useRouter } from "next/navigation"
import { useLoading } from "@/context/LoadingContext"

export default function LoadingLink({ href, children, ...props }) {
    const { setIsLoading } = useLoading()
    const router = useRouter()

    const handleClick = (e) => {
        e.preventDefault() // 1. 기본 이동 동작을 막는다.
        
        setIsLoading(true) // 2. 로딩 화면을 켠다 (State Update)

        // 3. 로딩 화면이 렌더링될 시간을 잠깐(500ms) 벌어주고 이동한다.
        setTimeout(() => {
            router.push(href)
        }, 500)
    }

    return (
        <a href={href} onClick={handleClick} {...props}>
            {children}
        </a>
    )
}
```
### 4. 동작원리 상세 분석
이 기능이 작동하는 타임라인을 분석해보면 다음과 같다.  
- 1. **Click**: 사용자가 `LoadingLink`를 클릭한다.
- 2. **Intercept**: `e.preventDefault()`로 인해 브라우저의 즉시 이동이 차단된다.
- 3. **UI Update**: `setIsLoading(true)`가 실행되고, React는 `GlobalLoader`를 최상단(`z-[9999]`)에 그린다.
- 4. **Routing**: `setTimeout`(0.5초) 이후 `router.push()`가 실행되어, Next.js가 서버에 데이터를 요청한다.
- 5. **Fetching**: 데이터를 받아오는 동안 사용자는 멈춘 화면 대신 **로딩 바**를 보게 된다.
- 6. **Navigation End**: 데이터가 준비되어 페이지가 바뀌면 URL(`pathName`)이 변경된다.
- 7. **Reset**: `LoadingProvider`의 `useEffect`가 이를 감지하고 `setIsLoading(false)`를 실행해 로딩창을 걷어낸다.

### 5. 트레이드 오프: 성능 VS 경험
이 기능은 분명 기술적으로 보면 **성능 최적화에 역행**하는 부분이 있다.  
<strong>단점(Cons)</strong>

- **Soft Navigation** 포기: Next.js가 추구하는 **앱 같은 부드러움**대신, 화면이 단절되는 경험을 주게 된다.
- **Blocking**: 로딩 중에는 사용자가 스크롤 하거나 다른 행동을 할 수 없다.

<strong>장점(Pros)</strong>

- **즉각적인 피드백**: 클릭하자마자 UI가 반응하므로, 사용자는 시스템이 동작하는구나라는 걸 확실히 인지한다.
- **브랜드 아이덴티티**: 내 블로그의 핵심 컨셉인 **레트로 OS** 느낌을 극대화할 수 있었다. 하나의 콘텐츠로서 소비하고자 했다.

### 추가 기능 개발(2025.12.07)
위에까진 시나리오가 사용자가 내가 등록한 `LoadingLink`를 클릭 시, pathName의 변경이 완료될 때까지 `setTimeOut()` 함수로 0.5초를
대기하는 로딩화면이있다.
하지만 나는 이 로딩시간을 더 유의미하게 만들어보고 싶어서 **실제 로딩 시간**과 비슷하도록 리팩토링을 진행했다.
주어진 0.5초 동안 모든 이미지들을 최대한 가져오도고, 가져온 이미지들을 한꺼번에 화면에 그리도록 수정하고 싶었다.
이를 위해선 먼저 pathName의 변경을 기준으로 load 완료 여부를 체크를 기존의 `LoadingContext.js`의 함수를 더이상 `path` 변경 감지를 하지 않도록 했다.
```javascript
"use client"
import { createContext, useContext, useState, useEffect } from "react"
// import { usePathname, useSearchParams } from "next/navigation"

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false)
    // const pathName = usePathname()
    // const searchParams = useSearchParams()

    // 더이상 path 변경으로 로딩을 감지하지 않음, 대신 상세 페이지의 모든 img 태그 다운로드를 체크하도록 수정
    // useEffect(() => {
    //     setIsLoading(false)
    // }, [pathName, searchParams])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}
```
내가 원하는 방식대로 모든 이미지들을 글과 함께 한꺼번에 보여주기 위해선 상세 조회에 있는 글의 모든 `<img>` 태그들의 load 상태를 체크할 필요가 있었다.
이를 위해서 이미지들의 로딩 상태를 체크하는 컴포넌트인 `PostImageLoader.js` 컴포넌트를 만들었다.
```javascript
"use client"
import { useRef, useState, useEffect } from "react"
import { useLoading } from "@/context/LoadingContext"

export default function PostImageLoader({ children }) {
    const { setIsLoading } = useLoading()
    const contentRef = useRef(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        if (!contentRef.current) return 

        // 1. 분문 안의 <img> 찾기
        const images = contentRef.current.querySelectorAll('img')

        // 이미지가 하나도 없다면 바로 return
        if (images.length === 0) {
            setIsLoading(false)
            setIsReady(true)
            return
        }

        let loaderCount = 0
        const total = images.length

        // 2. 이미지 로드 완료 체크
        const checkAllLoaded = () => {
            loaderCount++
            if (loaderCount >= total) {
                // 모든 이미지 업로드 완료
                setIsLoading(false)
                setIsReady(true)
            }
        }

        // 3. 각 이미지에 리스너 부착
        images.forEach((img) => {
            // 이미 캐시된 거면 pass
            if (img.complete) {
                checkAllLoaded()
            } else {
                // error, load 모두 등록
                img.addEventListener('load', checkAllLoaded)
                img.addEventListener('error', checkAllLoaded)
            }
        });

        // 4. 일정 시간 초과 시, 화면 강제로 나오도록 하기
        const timeOutId = setTimeout(() => {
            setIsLoading(false)
            setIsReady(true)
        }, 3000) // 3초

        return () => clearTimeout(timeOutId)
    }, [setIsLoading])

    return (
        // isReady가 false면 opacity = 0, 아니면 100
        <div ref={contentRef} className={`transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
            {children}
        </div>
    )
}
```
모든 이미지가 완료되지 않으면 **투명도**를 0으로 하고, 완료가 될 경우 한 번에 보여주면서 이를 `transition`을 사용해 부드럽게 연출하고자 했다.  
또한 모든 이미지를 가져오지 못하더라도 3초를 넘기면 강제로 화면을 그리도록 했으며, 이미지의 오류로 인해 로딩이 되지 않는 경우 무한 로딩이 이뤄지지 않도록
`error`와 `load` 모두에게 `addEventListener`를 붙였다.

이 기능을 적용함으로써 **진짜 로딩** 화면을 갖게 되었다. 물론 체계적으로 데이터를 계산하는 로직은 아니지만, 대기 시간 동안 모든 데이터를 준비한다는 의미에서
실제 로딩의 기능을 수행한다고 생각한다.

### 마치며
개발자는 물론 성능을 최적화하는 코드를 짜는 게 중요하지만, <strong>어떤 사용자 경험(UX)</strong>를 줄 것인지에 대해서도 고민해야 한다고 생각한다.
비록 기술적으로는 Next.js의 최적화된 라우팅을 우회하는 방식이었지만, 내 블로그를 방문하는 사람들에게 **개발자스러운 재미**를 주기 위한 설계였다.
결과적으로 밋밋했던 페이지 이동이 훨씬 생동감 있게 변한 거 같아 만족스러웠다.

또한 모든 링크 이동에 로딩을 거는 건 부정적인 경험이 될 수 있으므로, 글을 상세조회하는 링크만 로딩 링크로 변경함으로써 UX와 성능을 둘 다 고려하고 노력했다!