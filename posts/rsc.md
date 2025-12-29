---
title: "서버 컴포넌트(RSC)와 서스펜스(Suspense)"
date: "2025-12-29 14:45:56"
category: "React"
description: "Next.js 등장 이후 React의 변화에 대해서 알아보자."
---

## 1. React가 서버로 갔다. (RSC: React Server Component)
원래 React는 브라우저(Client)에서만 실행되는 라이브러리이다. 하지만 <b>Next.js App Router</b>부터는 기본적으로 <b>
모든 컴포넌트가 서버(Server)에서 먼저 실행</b>된다.

이게 무슨 소리나면, 말 그대로다. 클라이언트 컴포넌트(`use client`로 선언된)조차 <b>서버에서 한 번 더 실행(렌더링)된다</b>.
이를 초기 HTML Pre-rendering이라고 부른다. 클라이언트 컴포넌트의 완성은 3단계에 거쳐서 발생한다.  

<b>1. 서버에서 1차 실행 (정적 HTML 생성)</b>  
사용자가 내 블로그에 접속했다고 가정하자, 내 페이지에 버튼을 누르면 1을 증가시키는 `Counter`라는 컴포넌트 버튼이 있다고 치자.  
```Jsx
'use client'
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      현재 숫자: {count}
    </button>
  );
}
```
코드는 이런 식으로 구현되어 있을 것이다.

서버가 이 코드를 실행할 경우 `use client`가 붙어있지만 <b>일단 실행한다</b>. `useState(0)`가 붙어있지만 초기값인 $0$을 가지고 HTML을 만든다.

생성된 HTML은 `<button>현재 숫자: 0</button>`와 같을 것이다. 하지만 서버는 `onClick` 함수나 `useEffect`와 훅을 실행할 수는 없다.
(브라우저 API도 없고, 마우스도 없으니까) 완성된 껍데기 HTML(정적 프리뷰)를 브라우저로 보낸다.

이 과정이 반드시 필요한 이유는 <b>UX와 SEO 최적화</b> 때문이다. 만약 서버에서 실행하지 않는다면 브라우저가 이걸 모두 완성할 때까지 사용자는 흰 화면을
보고 있어야 한다.

Next.js는 초기 로딩 속도를 위해서 이러한 클라이언트 컴포넌트조차 서버에서 미리 HTML로 굽는 셈이다.

<b>2. 브라우저 도착 (기능 X, 보이기만 함)</b>  
사용자의 브라우저에 서버가 보낸 HTML이 도착한다. 이 시점에서 사용자의 화면에는 `<button>현재 숫자: 0</button>`라는 버튼이 보일 것이다.  
하지만 이 버튼은 눌러서 전혀 반응이 없는 죽은 버튼이다. 자바스크립트 함수와 연결되지 않았기 때문이다.

<b>3. Hydration</b>  
이제 뒤따라오던 자바스크립트 함수가 도착한다. (JS Bundle)  

이 시점에서 브라우저에서 React가 깨어난다. React는 일전에 서버가 보낸 HTML(`<button>`)과 이벤트 리스너(`onClick`)와 상태(`useState`)를 연결시킨다.
(Hydration)

이로써 버튼은 숫자가 올라가는 살아있는 컴포넌트가 될 수 있다.

### 1-1. Client Component VS Server Component
이 둘을 구분할 줄 알아야 모든 걸 설명할 수 있다. 표로 요약해 보았다.

<table>
    <thead>
        <tr>
            <th width="20%">구분</th>
            <th width="40%">서버 컴포넌트(RSC)</th>
            <th width="40%">클라이언트 컴포넌트(Client Component)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>기본값</b></td>
            <td>Default (아무것도 안 적기)</td>
            <td>파일 맨 위에 <code>"use client"</code> 선언</td>
        </tr>
        <tr>
            <td><b>렌더링 & 실행 위치</b><br/>(Lifecycle)</td>
            <td><b>Only Server</b><br/>서버에서 실행되고 끝난다.</td>
            <td><b>Server + Client</b><br/>1. 서버에서 <b>HTML 미리 생성</b> (Pre-rendering)<br/>2. 브라우저에서 <b>하이드레이션</b> (Hydration)</td>
        </tr>
        <tr>
            <td><b>전송되는 것</b><br/>(Network)</td>
            <td>결과물 HTML + 데이터(JSON)<br/>= <b>JS 번들 크기 0 (Zero Bundle Size)</b></td>
            <td>초기 HTML + <b>인터랙션을 위한 JS 번들</b><br/>= <b>다운로드 받아야 할 JS 크기 증가</b></td>
        </tr>
        <tr>
            <td><b>하이드레이션</b><br/>(Hydration)</td>
            <td><b>불필요 (X)</b><br/>그냥 보여주기만 하는 정적 콘텐츠임.</td>
            <td><b>필수 (O)</b><br/>JS가 로드되어 HTML에 <b>이벤트를 연결</b>해야 함.</td>
        </tr>
        <tr>
            <td><b>가능한 것</b></td>
            <td>DB/파일시스템(fs) 직접 접근,<br/>보안 키(API Key) 사용</td>
            <td><code>useState</code>, <code>useEffect</code>, <code>onClick</code>,<br/>브라우저 API (<code>window</code>, <code>localStorage</code>)</td>
        </tr>
    </tbody>
</table>

### 1-2. 왜 서버 컴포넌트를 사용하는 걸까? (Zero Bundle Size)
지금 내 블로그처럼 블로그 글(markdown 파일)을 보여주기 위해서 마크다운 파서(`marked` 라이브러리, 무거움)를 쓴다고 생각해보자.

Client Component만 있던 시절에는 사용자가 블로그에 접속하면 `marked` 라이브러리를 다운받아야 했어서 매우 느렸다,하지만
Server Component로 구현한다면 서버에서 `marked`를 돌려서 <b>이미 변환된 HTML</b>만 사용자에게 보내면 그만이다.  
사용자가 라이브러리를 다운 받을 일이 일절없으므로 압도적으로 빠르다.

### 1-3. 경계선 긋기 (Boundary)
이제 개발자의 역할은 <b>어디까지가 서버이고, 어디부터가 클라이언트인가?</b>하고 선을 긋는 것이다.

블로그 글을 다시 예시로 보면, 블로그 글 내용 자체(`page.js`)는 단순히 그냥 읽기만 하면 된다. 따라서 Server Component라고 볼 수 있다.

반면, 일전에 개발한 검색창(`SearchModal`) 같은 UI는 타자를 치고(`onChange`) 검색된 내용을 클릭해야 한다(`onClick`).  
즉, Client Component이므로 `use client`를 선언해야 할 것이다.

## 2. Suspense: "기다림"을 선언적으로 처리
Next.js에서 `useSearchParams`를 사용할 경우엔 해당 컴포넌트를 `<Suspense>` 태그로 꼭 감싸줘야만 한다.
`<Suspense>`의 본질은 <b>비동기 상태(Loading)를 UI의 일부로 만드는 것</b>이다.

### 2-1. 명령형 VS 선언형 로딩 처리
명령형 컴포넌트 안에서 로딩을 처리하려면 `if(isLoading) return <Spinner />`와 같이 일일히 컴포넌트에 로딩에 대한 핸들링 처리를 넣어줘야 했다.  
하지만 선언형 컴포넌트에선 `<Suspense>` 태그의 `fallback` 속성을 통해서 아주 간단하게 설정할 수 있다.

```Jsx
<Suspense fallback={<LoadingSkeleton />}>
  <PostList /> {/* 안에서 DB 조회하느라 3초 걸림 */}
</Suspense>
```

### 2-2. 동작원리: Promise 던지기
React는 어떻게 자식 컴포넌트가 로딩 중인 걸 알 수 있을까? 아래와 같은 흐름을 통해 React는 자식 컴포넌트가 로딩 상태라는 걸 파악한다.  
1. `PostList`가 실행되면서 데이터를 요청한다. (`await`)  
2. 데이터가 아직 도착하지 않았다면 React에게 <b>아직 준비되지 않았다는 의미로</b> `Promise`를 던진다. (Throw)  
3. 부모인 `<Suspense>`는 그 Promise를 catch한다.  
4. 이를 통해 `<Suspense>`는 자식 컴포넌트가 로딩 중인 걸 파악하고, `fallback`을 대신 보여준다.  
5. 데이터가 도착하면(resolve), 다시 자식 컴포넌트(`PostList`)를 보여준다.

### 2-3. 스트리밍 (Streaming)
이게 Next.js와 만날 경우 <b>HTML Streaming</b>이 된다.  
서버는 더이상 페이지 전체가 완성될 때까지 기다리지 않는다.

1. `header`, `footer` 등 준비된 HTML을 먼저 사용.  
2. `<Suspense>` 자리에는 `loading.js`로 HTML을 보냄.  
3. 데이터가 준비되면 <b>그 부분만 갈아끼우는 스크립트</b>를 추가로 보냄.

결과적으로 사용자가 완전히 빈 화면을 보는 것이 아니라, 차례대로 준비된 것부터 화면을 보면서 그래도 뭔가 되고 있구나라는 걸
확실히 알 수 있게 된다.

## 3. 예외 처리 (Error Boundaries)
로딩 중 에러가 나면 어떻게 될까? 서버 컴포넌트는 `try-catch`로 감싸기 애매한 부분이 존재한다.  
이때 사용하는 것이 `error.js` (Next.js 기준) 혹은 `<ErrorBoundary>` (React 기준) 태그이다. 

`<Suspense>` 태그가 로딩 상태에 대한 책임을 진다면, `<ErrorBoundary>` 태그는 <b>에러 상태에 대한 책임</b>을 진다.

```Jsx
// app/post/[id]/error.js
'use client' // 에러 컴포넌트는 반드시 클라이언트여야 함 (복구 버튼 때문에)

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>문제가 발생했습니다!</h2>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  )
}
```

이제 `page.js`에서 DB 에러가 발생할 경우, Next.js는 알아서 이 `error.js` 화면을 보여준다. 전체 앱이 멈추는 경험은 사라지게 된다.

## 4. 결론: 어떻게 섞어 써야 하나?
경계선을 긋는 건 말처럼 쉽지 않을 수도 있다. 그럴 땐 최대한 보수적인 접근 방법을 택하는 게 좋을 수도 있다.  
<b>최대한 서버 컴포넌트로 남겨놓되, 상호작용이 필요한 말단(Leaf) 컴포넌트만 클라이언트로 바꾸는</b> 것이다.

`page.js`와 같은 데이터 fetch 로직은 당연히 서버 컴포넌트로서 구현하여 기본 글의 뼈대를 만들어주고, 사용자와 상호작용이 있는 부분에 있어서
클라이언 컴포넌트를 최소한으로 적용시키자.

이렇게 함으로써 초기 로딩 속도(Server)와 필요한 사용자 인터랙션(Client)를 모두 챙기는 것이 가장 좋은 패턴이라고 생각한다.