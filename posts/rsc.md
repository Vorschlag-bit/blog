---
title: "서버 컴포넌트(RSC)와 서스펜스(Suspense)"
date: "2025-12-29 14:45:56"
category: "React"
description: "Next.js 등장 이후 React의 변화에 대해서 알아보자."
---

## 1. React가 서버로 갔다. (RSC: React Server Component)
원래 React는 브라우저(Client)에서만 실행되는 라이브러리이다. 하지만 <b>Next.js App Router</b>부터는 기본적으로 <b>
모든 컴포넌트가 서버(Server)에서 먼저 실행</b>된다.

### 1-1. Client Component VS Server Component
이 둘을 구분할 줄 알아야 모든 걸 설명할 수 있다. 표로 요약해 보았다.

<table>
    <thead>
        <tr>
            <th>구분</th>
            <th>서버 컴포넌트(Server Component)</th>
            <th>클라이언트 컴포넌트(Client Component)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>기본값</b></td>
            <td>Default(아무것도 안 적기)</td>
            <td>파일 맨 위에 <code>use client</code> 선언</td>
        </tr>
        <tr>
            <td><b>실행 위치</b></td>
            <td>서버 (Node.js)</td>
            <td>브라우저 (사용자 컴퓨터)</td>
        </tr>
        <tr>
            <td><b>가능한 것</b></td>
            <td>DB 직접 접속, 비밀번호(API KEY) 사용, 파일 시스템 접근(<code>fs</code>)</td>
            <td><code>useEffect</code>,<code>useState</code>,<code>onClick</code>,브라우저 API(<code>window</code>)</td>
        </tr>
        <tr>
            <td><b>불가능한 것</b></td>
            <td><code>useState</code>,<code>useEffect</code> 같은 상호작용</td>
            <td>DB 직접 접속, <code>fs</code> 모듈</td>
        </tr>
        <tr>
            <td><b>전송되는 것</b></td>
            <td>HTML + JSON (JS 코드 X)</td>
            <td>HTML + JS 번들 (JS 코드 O)</td>
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