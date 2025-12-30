---
title: "효율적 데이터 요청과 캐싱"
date: "2025-12-30 14:32:58"
category: "React"
description: "성능에서 가장 중요한 데이터 fetching 전략과 캐싱 방법에 대해서 알아보자."
---

## 1. 폭포수(Waterfall) 현상 막기
서버 컴포넌트에서 `await`를 쓸 수 있게 되면서 흔하게 저지르는 실수가 있다. 바로 요청을 <b>순차적으로(Sequential)</b> 보내는 것이다.  

### 1-1. 직렬 요청 예시 (Waterfall)
블로그의 상세 페이지에서 <b>글 내용</b>과 <b>작성자 정보</b>를 가져온다고 가정해보자.
```Jsx
// RSC
export default async function Page({ params }) {
    // 1. 글 내용 가져오기 (1초)
    const post = await getPost(params.id)

    // 2. 작성자 정보 가져오기 (1초), 위 작업이 끝날 때까지 기다려야 함(동기적)
    const author = await getAuthor(post.id)

    // 총 요소 시간 = 2초
    return <PostView post={post} author={author} />>
}
```
위와 같은 코드로 데이터를 가져오는 걸 <b>폭포수 현상(Waterfall)</b>이라고 한다. 앞의 일이 끝나야 뒤의 일이 끝날 수 있는 동기적인 작업을 의미한다.

### 1-2. 병렬 요청 예시 (Parallel)
두 데이터가 서로 의존성(작성자 ID를 알아야만 작성자 요청 가능)이 없다면 병렬적으로 요청을 하는 것이 맞다.
```Jsx
export default async function Page({ params }) {
    // 두 요청을 동시에 시작 (Promise.all)
    const postData = getPost(params.id)
    const authorData = getAuthor(params.id)
    // 둘 다 끝날 때까지 기다리기 (병렬)
    const [post, author] = await Promise.all([postData,authorData]);

    // 총 소요 시간: MAX(1초, 1초) = 약 1초
    return <PostView post={post} author={author} />;
}
```
`Promise.all`을 사용하면 여러 비동기 작업을 동시에 처리해 로딩 시간을 획기적으로 줄일 수 있다.

---

## 2. Next.js의 요청 중복 제거 (Request Memoization)
만약 커뮤니티를 개발하는 중이라고 생각해보자. 로그인한 후에 헤더에 로그인한 유저의 이름을 보여주고, 글의 본문에도 로그인한 유저의 이름을 보여줘야하는
기능이 있을 것이다.

즉, `layout.js` (header)에서 로그인한 유저의 이름(`getUser()`)과 `page.js` (body)에서 유저의 이름(`getUser()`)이나 프로필 사진이
필요한 상황이다.

과거의 React만 존재했을 때는 저번에 말한 <b>Context API</b>나 <b>Props Drilling</b> 따위로 데이터를 내려줬다.  

하지만 Next.js의 App Router 방식에선 <b>그냥 필요한 곳에서 각각 호출</b>하기만 하면 된다.

```Jsx
// app/layout.js
export default async function Layout({ children }) {
  const user = await getUser(); // 첫 번째 호출 (실제 API 요청 나감)
  return <html><Header user={user} />{children}</html>;
}

// app/page.js
export default async function Page() {
  const user = await getUser(); // 두 번째 호출 (API 요청 안 나감! 캐시된 값 재사용)
  return <main><Profile user={user} /></main>;
}
```

### 2-1. 원리: `fetch` 함수의 확장
Next.js는 기본 `fetch()` 함수를 확장했다. (Overriding) <b>하나의 페이지를 그리는 동안(Per Request)</b> 동일한 URL과 옵션으로 `fetch` 요청이 들어오면, 실제 네트워크 요청은 딱 한 번만 보내고 나머지는 메모리에 저장된 값을 return한다.

따라서 이제 데이터를 Props로 일일히 넘겨줄 필요가 없게되었다. <b>필요한 컴포넌트에서 직접 fetch하는 것</b>이 새로운 패턴이다.  
물론 `fetch()`가 아닌 DB와 직접 연결하는 `prisma` 같은 기능은 React의 `cache`로 감싸줘야 작동한다.

### 2-2. 캐싱 전략: 정적 VS 동적
Next.js에선 `fetch()` 함수에 다양한 캐싱 옵션을 달 수 있다. 이를 통해 해당 데이터를 정적으로 캐싱할지 동적으로 캐싱할지 정할 수 있다.

<b>1. `force-cache` (정적, 기본값)</b>

```Jsx
// 빌드 타임에 데이터를 가져오고, 그 결과를 영원히 저장함.
fetch('https://...', { cache: 'force-cache' });
```
블로그 글처럼 좀처럼 내용이 잘 바뀌지 않는 데이터에 매우 적합한 옵션이다.

<b>2. `no-store` (동적)</b>

```Jsx
// 요청이 올 때마다 매번 새로 가져옴.
fetch('https://...', { cache: 'no-store' });
```
주식 가격이나 실시간 댓글과 같이 계속 변하는 데이터에 사용하는 옵션이다.

<b>3. `revalidate` (ISR - 주기적 갱신)</b>

```Jsx
// 일단 캐시를 쓰되, 3600초(1시간)가 지나면 새로 가져와서 업데이트함.
fetch('https://...', { next: { revalidate: 3600 } });
```

빠른 속도(정적)와 최신 데이터(동적)의 장점을 합친 하이브리드이다. 내가 날씨 UI를 개발할 때도 이 옵션을 사용해서 10분의 TTL을 부여했다.

---

## 3. 에러 처리 (error.js)
로딩 중엔 `<Suspense>`가 있다면, 에러가 났을 땐 `error.js`가 있다.  
`error.js`는 반드시 <b>클라이언트 컴포넌트</b>(`use client`)여야 한다. 에러가 났을 때 다시 시도하는 버튼을 눌러서 복구하는 기능이
브라우저에서 동작해야 하기 때문이다.

만드는 법은 매우 간단하다, 보여주려는 `page.js`와 같은 레벨에서 `error.js`를 만들면 해당 `page.js`의 에러 화면으로 등록된다.

```Jsx
// app/post/[id]/error.js
'use client' // 필수!

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error); // 에러 로깅 서비스로 전송 가능
  }, [error]);

  return (
    <div>
      <h2>오류가 발생했습니다! 😱</h2>
      <button onClick={() => reset()}>다시 시도하기</button>
    </div>
  );
}
```

---
## 4. Deep Dive: 헷갈리기 쉬운 캐시의 두 얼굴
Next.js의 캐싱을 공부하다 보면 **Request Memoization**과 **Data Cache**가 헷갈릴 수 있다. 둘 다 "중복을 막는다"는 점은 같지만, <b>수명(Lifetime)</b>이 완전히 다르다.

### 4-1. Request Memoization (요청 메모이제이션)
*   **목적:** 함수 간에 데이터를 전달하는 Props Drilling을 없애기 위함.
*   **수명:** **단 하나의 요청(One Request)이 처리되는 동안만** 살아있다.
*   **비유:** 함수 내의 `지역 변수`. 페이지 렌더링이 끝나면 즉시 사라진다. (휘발성)
*   **작동:** 우리가 위에서 배운 `getUser()` 중복 호출 방지가 바로 이것이다.

### 4-2. Data Cache (데이터 캐시)
*   **목적:** 서버 부하를 줄이고 응답 속도를 높이기 위함.
*   **수명:** **서버가 재배포되거나 캐시를 강제로 지우기 전까지** 계속 살아있다.
*   **비유:** 여러 사용자가 공유하는 `공용 사물함`. (영속성)
*   **작동:** `fetch(url, { cache: 'force-cache' })` 옵션이 관여하는 곳이다.

<b>요약</b>

우리가 `app/layout.js`와 `app/page.js`에서 동시에 `fetch`를 호출했을 때,
1. **Data Cache**를 먼저 확인해서 저장된 데이터가 있는지 본다. (서버 부하 감소)
2. 가져온 데이터를 **Request Memoization**에 저장해서 컴포넌트끼리 돌려 쓴다. (Props Drilling 제거)

이 두 가지 레이어가 협력하기 때문에 Next.js가 빠른 것이다.

---

## 5. 결론: "어떻게(How)"에서 "무엇을(What)"으로
과거의 React 개발은 데이터를 <b>"어떻게 저 아래까지 전달할까?"</b>를 고민하는 시간이 많았다. (Redux, Context, Props Drilling...)

하지만 서버 컴포넌트와 똑똑한 캐싱 전략이 도입된 지금, 우리는 <b>"무엇을 보여줄 것인가?"</b>에만 집중하면 된다.
데이터가 필요한 컴포넌트가 있다면, 부모에게 손 벌리지 말고 **그냥 그 자리에서 요청하자.**

나머지 최적화는 프레임워크가 알아서 해줄 것이다. 이것이 React Server Component가 가져온 진정한 패러다임의 변화다.