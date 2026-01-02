---
title: "인기글 UI 서버 컴포넌트화로 최적화 리팩토링하기"
date: "2026-01-02 19:19:29"
category: "개발"
description: "클라이언트 컴포넌트를 서버 컴포넌트로 리팩토링할 경우 얻는 이점에 대해서 알아보자."
---

## 서론: 이렇게 될 수 있다니
React와 Next.js에 대해서 공부를 하면서 클라이언트 컴포넌트와 서버 컴포넌트의 차이점 그리고 더 나아가
server actions에 대해서도 배우면서 내 블로그에 최적화할 수 있는 거리가 제법있다는 걸 알게 되었다.

당장 내가 며칠 전에 구현했던 <b>인기 글 UI</b>는 <b>클라이언트 컴포넌트</b>로 설계되었다.  
내가 해당 UI를 클라이언트 컴포넌트로 구현한 이유는 아래와 같았다.

1. 이 컴포넌트는 `POST`와 `GET` 요청을 원자적으로 수행하면 좋음.
    - `params`에 따라서 이 컴포넌트는 계속 `POST` 요청을 redis에 보내야 하는 건 부정할 수 없는 사실이다.
    - 그 김에 get 요청도 수행함으로서 api 요청 횟수를 줄이는 건 괜찮은 선택으로 보였다.  
2. `useState`와 `useEffect`를 사용함으로써 `params`가 바뀜에 따라 컴포넌트 리렌더링이 이뤄지고 api 요청도 자동으로 가게 만들기.
    - 이 부분은 사실 깊게 고민하지 않았었다. 단순히 위와 같은 React Hook들을 사용하면 리렌더링을 편하게 구현할 수 있으니까
    사용하면 좋을 거라고 생각했다.

하지만 인기 글 UI는 굳이 클라이언트 컴포넌트로 구현할 이유가 없었다.  
왜냐하면 서버로부터 데이터를 받아서 단순히 보여주기만 하면 되는 UI이기 때문에 서버 컴포넌트로 구현하지 않을 이유가 없었다.

또한 클라이언트 컴포넌트로 원자적인 요청을 할 경우 굳이 GET 요청을 캐시를 감안해도 계속해야 하는 오버헤드가 존재했다.  
어차피 캐시된 데이터를 보여줄 거라면 굳이 요청을 보낼 필요없이 레이아웃으로써 데이터를 보존된 상태로 최대한 유지하는 게 더 낫다.

이러한 이유에서 `PostRank.js`를 서버 컴포넌트로 리팩로팅하기로 결정했다.

## 설계 & 구현
일단 해당 컴포넌트 리팩토링의 핵심은 <b>읽기(Read)와 쓰기(Write)의 분리</b>였다.
읽기 작업은 서버 컴포넌트 자체가 수행하고, 쓰기 작업은 <b>페이지 이동</b> 감지를 위해서 `/posts/[id]/page.js`에서 비동기 함수로써 호출시키고
`await`를 붙이지 않고 백그라운드로 수행시켜 이전보다 빠른 쓰기 작업을 수행하도록 할 생각이었다.

### 쓰기(Write) 함수 - page.js
먼저 기존에 `route.js`로 프록시 API 요청을 하던 `POST()`함수에서 읽기와 쓰기 함수를 분리시켰다.

```javascript
export async function IncrementRank(id) {
    try {        
        // Sorted Set에 넣을 id(str)    
        if (!id) {
            throw Error('wrong type [Id]: ', id)
        }
        // rootPath면 continue
        if (id !== '/') {
            // console.log(`루트 디렉토리 아니라서 zincrby 실행`);
            // severless 환경에선 await 안 쓰면 서버가 그 전에 죽을 수도
            await redis.zincrby('popular_posts',1,id)
        }

    } catch (err) {
        console.error(`post redis failed`, err);
    }
}
```
기존에는 `zincreby()` 이후에 `zrange()` 함수를 비동기로 호출하고, `zrange()`의 return값을 `NextReponse`에 담아서 돌려주는 구조였으나
이제 쓰기 작업은 `/posts/[id]/page.js`에서 비동기 처리가 되었다. 

비동기 백그라운처리(`await`까지 안 적는)까지 하고 싶었으나 Vercel 같이
severless 구조에선 비동기를 적고 `await`를 안 적으면 미처 처리되기 이전에 서버가 죽을 수도 있어서 안전하게 `await`를 적었다.

```javascript
// URL의 [id]부분이 parmas로 들어감
export default async function Post({params}) {
    const { id } = await params
    // 비동기 백그라운드로 인기글 zincrby 호출
    awiat IncrementRank(id);

    // ... 이하 생략
}
```

### 읽기(Read) 함수 - PostRank.js
순수한 함수형 컴포넌트로서 새롭게 리팩토링된 `PostRank.js`다. 읽기 작업을 요청하고 `await`로 받아서 화면에 그리기만 하면 된다.
더이상 React의 Hook들을 사용하지 않기 때문에 순수한 정적 페이지로써 브라우저는 더이상 자바스크립트 Bundle을 기다리지 않게 되었고
더 빠른 속도로 렌더링을 보장할 수 있을 것이다.

이젠 async 함수 컴포넌트로 수정했다.
```javascript
import Link from "next/link";
import { getRank } from "@/lib/ranks";

export default async function PostRank() {
    const data = await getRank() || [];

    return (
        // data.length가 1 이상일 때만 화면을 그리도록 수정
        {data.length > 0 (
            // 있을 때
        ) : (
            // 없을 때
        )}
    )
}
```

## 정리 & 비교 분석
이전의 구조와 현재 구조를 표로 정리해보았다.
<table class="">
    <thead class="">
        <tr>
            <th class="font-bold w-1/4">비교 항목</th>
            <th class="font-bold w-1/3 text-gray-500">AS-IS (기존)</th>
            <th class="font-bold w-1/3 text-blue-600">TO-BE (개선 후)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="font-semibold">구현 방식</td>
            <td class="">
                Client Component<br/>
                (useEffect + fetch)
            </td>
            <td class="">
                Server Component<br/>
                (Direct DB Access)
            </td>
        </tr>
        <tr>
            <td class="font-semibold">데이터 요청 시점</td>
            <td class="">
                1. HTML 로드<br/>
                2. JS 로드 (Hydration)<br/>
                3. <b>그 후에 API 요청 시작</b> (느림)
            </td>
            <td class="">
                <b>HTML 생성 시점 (서버)</b><br/>
                브라우저 도달 전 이미 데이터 확보 (빠름)
            </td>
        </tr>
        <tr>
            <td class="font-semibold">네트워크 요청 수</td>
            <td class="text-red-500">
                2회 (HTML + API JSON)
            </td>
            <td class="text-blue-600">
                <b>1회 (HTML 통합)</b>
            </td>
        </tr>
        <tr>
            <td class="font-semibold">사용자 경험 (UX)</td>
            <td class="">
                로딩 스피너 깜빡임 발생<br/>
                (Layout Shift 가능성 있음)
            </td>
            <td class="">
                <b>초기 화면에 즉시 데이터 표시</b><br/>
                (깜빡임 없음)
            </td>
        </tr>
        <tr>
            <td class="font-semibold">SEO (검색 최적화)</td>
            <td class="">
                크롤러가 JS 실행 전엔 빈 목록을 볼 수 있음
            </td>
            <td class="">
                <b>HTML에 데이터가 포함</b>되어<br/>완벽한 수집 가능
            </td>
        </tr>
    </tbody>
</table>

성능적으로는 개발자 도구의 네트워크 창을 보면 쉽게 알 수 있다.
이전에는 네트워크 창을 볼 경우 HTML 문서가 도착한 뒤에 `post_rank`라는 요청이 반드시 가야만 했었다.

<figure>
    <img src="/images/rank_ex.png" alt="클라이언트 컴포넌트 시절 273ms로 네트워크 요청이 간 모습">
    <figcaption>이때 <b>273ms</b>라는 시간이 소요되었다.</figcaption>
</figure>

하지만 지금은 아예 `post_rank`라는 요청 자체가 보이지 않는다. 데이터를 부착시킨 HTML만을 보여주므로 당연한 것이다.

<figure>
    <img src="/images/rank_cur.png" alt="서버 컴포넌트로서 네트워크 요청 자체가 사라진 모습">
    <figcaption>그냥 네트워크 요청 자체가 사라졌다.</figcaption>
</figure>

새로고침을 해봐도 클라이언트 컴포넌트의 경우 가끔 `isLoading` 상태로 등록해놓은 로딩 UI가 보이지만 서버 컴포넌트로 리팩토링하면
그럴 일 자체가 사라졌다.

이번 개발을 통해서 리팩토링 작업의 시작을 한 거 같은데 너무 재밌고 유익했다.
새로운 지식을 배우자마자 실습할 수 있다는 건 정말 큰 기회이다.. 이번에 몸소 서버/클라이언트 컴포넌트의 차이점을 깨달으면서
둘의 기능을 명확하게 구분할 수 있었고, 가능한 한 서버 컴포넌트로서 최대한 구현해 최대한 빠른 정적 HTML을 제공하는 게
UX에 있어서 가장 중요하다는 걸 알게 되었다.