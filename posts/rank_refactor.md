---
title: "인기글 UI 서버 컴포넌트화로 최적화 리팩토링하기"
date: "2026-01-02 19:19:29"
category: "개발"
description: "클라이언트 컴포넌트를 서버 컴포넌트로 리팩토링할 경우 얻는 이점에 대해서 알아보자."
---

## 서론: 이렇게 될 수 있다니

React와 Next.js에 대해서 공부하면서 <b>클라이언트 컴포넌트(Client Component)</b>와 <b>서버 컴포넌트(Server Component)</b>의 차이점, 그리고 더 나아가 <b>Server Actions</b>에 대해서도 배웠다. 그러면서 내 블로그에 최적화할 수 있는 부분이 꽤 많다는 것을 알게 되었다.

당장 며칠 전에 구현했던 **인기 글 UI**는 **클라이언트 컴포넌트**로 설계되었다. 내가 해당 UI를 클라이언트 컴포넌트로 구현했던 이유는 아래와 같았다.

1.  **POST와 GET 요청의 원자적 수행**:
    *   `params`에 따라서 이 컴포넌트는 계속 Redis에 `POST` 요청(조회수 증가)을 보내야 하는 것은 사실이다.
    *   그 김에 `GET` 요청(인기글 조회)도 함께 수행함으로써 API 요청 횟수를 줄이는 것이 괜찮은 선택처럼 보였다.
2.  **`useState`와 `useEffect`를 활용한 리렌더링**:
    *   `params`가 바뀜에 따라 컴포넌트 리렌더링이 이뤄지고, API 요청도 자동으로 가게 만들기 위해 React Hook들을 사용했다.

하지만 다시 생각해보니 인기 글 UI는 굳이 클라이언트 컴포넌트로 구현할 필요가 없었다. **서버로부터 데이터를 받아서 단순히 보여주기만 하면 되는 UI**이기 때문이다.

또한 클라이언트 컴포넌트로 원자적인 요청을 할 경우, **굳이 `GET` 요청을 (캐시를 감안하더라도) 계속해야 하는 오버헤드**가 존재했다. 어차피 캐시된 데이터를 보여줄 거라면 굳이 요청을 보낼 필요 없이, 레이아웃에 포함되어 데이터를 유지하는 것이 더 낫다.

이러한 이유에서 `PostRank.js`를 **서버 컴포넌트**로 리팩토링하기로 결정했다.

## 설계 & 구현

이번 리팩토링의 핵심은 **읽기(Read)와 쓰기(Write)의 분리**였다.

*   **읽기(Read)**: 서버 컴포넌트 자체가 수행하여 렌더링 시점에 데이터를 가져온다.
*   **쓰기(Write)**: 페이지 이동 감지를 위해 별도의 클라이언트 컴포넌트가 Server Action을 호출한다.

### 1. 쓰기(Write) - SSG 환경에서의 딜레마와 해결

처음에는 단순히 페이지 컴포넌트(`page.js`) 내부에서 DB에 직접 접근하여 조회수를 올리면 된다고 생각했다. 하지만 내 블로그의 게시글 페이지는 <b>SSG(Static Site Generation)</b> 방식으로 빌드된다는 점을 간과했었다.

만약 `page.js` 내부에서 직접 DB 조회수를 올리는 함수를 실행해버리면, **사용자가 접속할 때가 아니라, 빌드 타임에 딱 한 번만 실행**되고 만다. 즉, 실제 조회수는 전혀 집계되지 않는 것이다.

이 문제를 해결하기 위해 <b>"서버 로직을 실행할 인터페이스(Server Action)"</b>와 <b>"그것을 호출할 트리거(Client Component)"</b>를 분리하여 구현했다.

#### Step 1: 순수 서버 로직 구현 (incrementView)
먼저 Redis에 접근하여 점수를 올리는 순수 로직을 작성했다.

```javascript
// lib/ranks.js
export async function incrementView(id) {
    try {        
        if (!id || id === '/') return; // 루트 경로는 제외
        
        // Vercel KV(Redis)에 조회수 증가 요청
        // await를 사용하여 확실하게 처리 (Serverless 환경 고려)
        await redis.zincrby('popular_posts', 1, id);
    } catch (err) {
        console.error(`Redis Error:`, err);
    }
}
```

#### Step 2: 인터페이스 역할의 Server Action 생성
클라이언트 컴포넌트에서 직접 `lib/ranks.js`를 임포트하면 보안 및 번들링 문제가 발생할 수 있다. 따라서 클라이언트가 안전하게 호출할 수 있도록 **Server Action**을 중간 다리로 만들었다.

```javascript
// app/actions.ts
'use server' // 서버 액션 선언

import { incrementView } from "@/lib/ranks";

export async function viewCountAction(id) {
    // 클라이언트에서 호출 가능한 형태의 비동기 함수
    await incrementView(id);
}
```

#### Step 3: 트리거 역할의 Client Component (ViewCounter)
이제 페이지가 마운트될 때, 위에서 만든 액션을 호출해 줄 **작고 가벼운 클라이언트 컴포넌트**가 필요하다. 이 컴포넌트는 UI를 그리지 않고 오직 <b>"조회수 증가 요청"</b>이라는 사이드 이펙트만 담당한다.

```javascript
// components/ViewCounter.js
'use client'

import { useEffect } from "react";
import { viewCountAction } from "@/app/actions";

export default function ViewCounter({ id }) {
    useEffect(() => {
        // 컴포넌트가 마운트되면(사용자가 페이지를 보면) 서버 액션 호출
        viewCountAction(id);
    }, [id]);

    return null; // 화면에는 아무것도 그리지 않음
}
```

마지막으로 `[id]/page.js`에 이 컴포넌트를 심어주면 끝이다.

```javascript
// app/posts/[id]/page.js
export default function Post({ params }) {
    return (
        <article>
            {/* 화면에 보이지 않는 조회수 카운터 삽입 */}
            <ViewCounter id={params.id} />
            
            {/* ... 나머지 게시글 내용 ... */}
        </article>
    )
}
```

### 2. 읽기(Read) - PostRank.js (RSC)

쓰기 로직을 분리해낸 덕분에, 이제 순위표를 보여주는 `PostRank.js`는 순수한 <b>서버 컴포넌트(Async Server Component)</b>로 남을 수 있게 되었다.

더 이상 `useState`, `useEffect` 같은 클라이언트 훅을 사용하지 않는다. 단순히 데이터를 가져와서(`await`) 그리기만 하면 된다. 브라우저는 더 이상 자바스크립트 번들 다운로드와 실행을 기다릴 필요가 없어졌고, **HTML에 이미 데이터가 포함된 상태**로 오기 때문에 렌더링 속도가 훨씬 빨라졌다.

```javascript
// components/PostRank.js
import Link from "next/link";
import { getRank } from "@/lib/ranks"; // DB 직접 접근 함수

export default async function PostRank() {
    // 서버에서 직접 DB 조회
    const data = await getRank() || [];

    return (
        <div className="...">
            {data.length > 0 ? (
                // 데이터가 있을 때 UI 렌더링
                <ul>
                    {data.map((post) => (
                        <li key={post.id}>...</li>
                    ))}
                </ul>
            ) : (
                <div>데이터가 없습니다.</div>
            )}
        </div>
    )
}
```

## 정리 & 비교 분석

클라이언트 컴포넌트(AS-IS)와 서버 컴포넌트(TO-BE)의 차이를 표로 정리해보았다.

<table class="w-full text-left border-collapse border border-gray-300">
    <thead>
        <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2 w-1/4">비교 항목</th>
            <th class="border border-gray-300 px-4 py-2 w-1/3 text-gray-500">AS-IS (기존)</th>
            <th class="border border-gray-300 px-4 py-2 w-1/3 text-blue-600">TO-BE (개선 후)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="border border-gray-300 px-4 py-2 font-semibold">구현 방식</td>
            <td class="border border-gray-300 px-4 py-2">
                Client Component<br/>
                (useEffect + fetch)
            </td>
            <td class="border border-gray-300 px-4 py-2">
                Server Component<br/>
                (Direct DB Access)
            </td>
        </tr>
        <tr>
            <td class="border border-gray-300 px-4 py-2 font-semibold">데이터 요청 시점</td>
            <td class="border border-gray-300 px-4 py-2">
                1. HTML 로드<br/>
                2. JS 로드 (Hydration)<br/>
                3. <b>그 후에 API 요청 시작</b> (느림)
            </td>
            <td class="border border-gray-300 px-4 py-2">
                <b>HTML 생성 시점 (서버)</b><br/>
                브라우저 도달 전 이미 데이터 확보 (빠름)
            </td>
        </tr>
        <tr>
            <td class="border border-gray-300 px-4 py-2 font-semibold">조회수 집계 방식</td>
            <td class="border border-gray-300 px-4 py-2 text-red-500">
                컴포넌트 로딩 시 API 호출<br/>(불필요한 GET/POST 혼재)
            </td>
            <td class="border border-gray-300 px-4 py-2 text-blue-600">
                <b>전용 Client Trigger 분리</b><br/>(읽기/쓰기의 명확한 역할 분리)
            </td>
        </tr>
        <tr>
            <td class="border border-gray-300 px-4 py-2 font-semibold">사용자 경험 (UX)</td>
            <td class="border border-gray-300 px-4 py-2">
                로딩 스피너 깜빡임 발생<br/>
                (Layout Shift 가능성 있음)
            </td>
            <td class="border border-gray-300 px-4 py-2">
                <b>초기 화면에 즉시 데이터 표시</b><br/>
                (깜빡임 없음)
            </td>
        </tr>
        <tr>
            <td class="border border-gray-300 px-4 py-2 font-semibold">SEO (검색 최적화)</td>
            <td class="border border-gray-300 px-4 py-2">
                크롤러가 JS 실행 전엔 빈 목록을 볼 수 있음
            </td>
            <td class="border border-gray-300 px-4 py-2">
                <b>HTML에 데이터가 포함</b>되어<br/>완벽한 수집 가능
            </td>
        </tr>
    </tbody>
</table>

### 성능 변화 (Network Tab)

개발자 도구의 네트워크 탭을 보면 그 차이를 확연히 알 수 있다.

이전(Client Component)에는 HTML 문서가 도착한 뒤에 `post_rank`라는 API 요청이 추가로 발생했었다.

<figure>
    <img src="/images/rank_ex.png" alt="클라이언트 컴포넌트 시절 273ms로 네트워크 요청이 간 모습">
    <figcaption>이때 <b>273ms</b>라는 추가 시간이 소요되었다.</figcaption>
</figure>

하지만 지금(Server Component)은 아예 `post_rank`라는 요청 자체가 보이지 않는다. 데이터를 포함한 완성된 HTML을 한 번에 받아오기 때문이다.

<figure>
    <img src="/images/rank_cur.png" alt="서버 컴포넌트로서 네트워크 요청 자체가 사라진 모습">
    <figcaption>네트워크 요청 자체가 사라지고 HTML에 통합되었다.</figcaption>
</figure>

새로고침을 해봐도 클라이언트 컴포넌트 시절에는 가끔 `isLoading` 상태로 등록해놓은 로딩 UI가 깜빡였지만, 서버 컴포넌트로 리팩토링한 후에는 그런 현상 자체가 사라졌다.

이번 리팩토링 작업을 통해 **서버/클라이언트 컴포넌트의 명확한 역할 구분**을 체감할 수 있었고, 가능한 한 서버 컴포넌트로 구현하여 **최대한 빠른 정적 HTML을 제공하는 것이 UX 향상의 지름길**임을 깨닫게 되었다.