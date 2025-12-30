---
title: "로직의 분리(Custom Hooks)와 데이터의 흐름(Composition)"
date: "2025-12-25 15:41:11"
category: "React"
description: "React에서 로직의 재사용(Custom Hooks)과 데이터 전달법(Composition)에 대해 알아보자."
---
<img src="/images/react_icon.svg" alt="React 로고" width="400" height="400" />

## 1. 커스텀 훅(Custom Hooks): 로직을 조립하는 레고 블록
React가 함수형 컴포넌트 시대로 넘어오면서 가장 강력해진 기능 중 하나다.

### 1-1. 개념: `use`로 시작하는 자바스크립트 함수
커스텀 훅은 거창한 것이 아니다. 컴포넌트 안에서 반복되는 로직(State + Effect)을 뽑아서 함수로 만들면 그게 바로 커스텀 훅이다.
단, 한 가지 규칙을 준수해야 한다. 반드시 **함수 이름이 `use`로 시작해야 한다.** 그래야 React가 이를 훅으로 인식하고 Lint 규칙을 적용해준다.

### 1-2. 왜 필요한가? (내 블로그)
내 블로그에는 페이지 이동 시 이미지 로딩을 기다려주는 <b>전역 로딩 시스템(`isLoading`)</b>이 있다.
이 상태는 앱 전체에서 공유되어야 한다.

1.  **링크 클릭 (`<LoadingLink>`)**: 로딩 시작 (`true`)
2.  **화면 가리기 (`<GlobalLoader>`)**: 로딩 바 표시
3.  **이미지 다운로드 완료 (`<PostImageLoader>`)**: 로딩 종료 (`false`)

이 3가지 컴포넌트는 서로 다른 위치에 흩어져 있다. 만약 Props로 `setIsLoading`을 전달하려 했다면 끔찍한 **Props Drilling**을 겪었을 것이다.
그래서 나는 `Context API`와 `Custom Hook`을 조합해 해결했다.

```javascript
// hooks/useLoading.js
export function useLoading() {
    return useContext(LoadingContext)
}
```

이제 어떤 컴포넌트에서든 `import { useLoading } ...` 한 줄이면 전역 로딩 상태를 조작할 수 있는 <b>리모컨(Hook)</b>을 손에 넣게 된 것이다.

### 전역 로딩 상태의 흐름 (Timeline)
혹시 "링크에서 `true`로 켰는데, 다음 페이지에서 `false`로 끄면 꼬이지 않을까?" 걱정할 수 있다. 하지만 순서는 명확하다.

1.  **이전 페이지:** `<LoadingLink>` 클릭 -> `setIsLoading(true)` (로딩 시작)
2.  **페이지 이동 중:** `<GlobalLoader>`가 화면을 가림.
3.  **다음 페이지 마운트:** `<PostImageLoader>` 실행 -> 이미지 다운로드 체크.
4.  **로딩 완료:** `setIsLoading(false)` (로딩 종료)

---

### 1-3. 주의사항: 훅은 '로직'을 공유하지 '상태'를 공유하지 않는다
가장 많이 하는 오해다. A 컴포넌트와 B 컴포넌트가 같은 커스텀 훅을 쓴다고 해서 상태가 공유될까?

**NO.** 커스텀 훅은 <b>로직(틀)</b>을 공유하는 것이지, <b>데이터(상태)</b>를 공유하는 게 아니다. 훅을 호출할 때마다 `useState` 저장소는 **각각 독립적으로 생성**된다.

(단, 내 사례처럼 `useContext`를 감싼 커스텀 훅이라면, 그 훅이 바라보는 곳이 '전역 Context'이므로 상태가 공유되는 효과를 낸다.)

---

## 2. Props Drilling과 합성(Composition)
React의 데이터 흐름은 <b>위에서 아래(Top-down)</b>다. 이 원칙 때문에 발생하는 고질적인 문제가 있다.

### 2-1. Props Drilling
데이터를 저~ 밑에 있는 손자 컴포넌트에게 주고 싶은데, 중간에 낀 부모 컴포넌트들이 억지로 Props를 받아서 전달만 해주는 상황이다.

> `App` (데이터 있음) -> `Layout` (관심 없음) -> `Header` (관심 없음) -> `UserAvatar` (필요함!)

이러면 중간 컴포넌트들이 불필요하게 복잡해지고, 유지보수가 어려워진다.

### 2-2. 해결책: 컴포넌트 합성(Composition)
많은 사람이 Drilling을 피하기 위해 무조건 Context를 쓰려고 하지만, 다른 방법이 있다. 바로 <b>"컴포넌트 자체를 Props로 넘겨버리는 것"</b>이다.

쉽게 말해 <b>"빈칸 채우기"</b> 혹은 <b>"액자 끼우기"</b>라고 생각하면 된다.

**Next.js의 `layout.js` 예시**  
`RootLayout` 컴포넌트를 살펴보자.

```javascript
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />  {/* 항상 고정된 액자 틀 1 */}
        
        <div className="content">
            {children} {/* 여기가 바로 '빈칸(Slot)'! */}
        </div>

        <Footer />  {/* 항상 고정된 액자 틀 2 */}
      </body>
    </html>
  );
}
```

여기서 `children` prop이 바로 컴포넌트 합성을 활용한 것이다.
*   `/about` 페이지에 가면 Next.js는 `children` 자리에 `<AboutPage />`를 끼워 넣는다.
*   `/post` 페이지에 가면 `children` 자리에 `<PostPage />`를 끼워 넣는다.

`RootLayout` 입장에선 자기 내부에 어떤 게 오던지 상관이 없고, 그냥 자리만 비워두는 셈이다. 덕분에 `RootLayout`은 하위 페이지에게 불필요한 Props를 전달할 필요가 없어진다. 이것이 바로 <b>합성(Composition)</b>의 힘이다.