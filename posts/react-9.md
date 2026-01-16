---
title: "서버 액션(Server Actions): API 없는 백엔드"
date: "2025-12-31 20:55:52"
category: "React"
description: "Next.js가 새로 제시한 패턴인 use server에 대해서 알아보자."
---
<img src="/images/react_icon.svg" alt="React 로고" />

## 1. 패러다임의 변화: "API 없어도 된다"
지금까지 데이터를 요청하거나 수정하는 작업을 해야 할 때는 늘 똑같은 패턴을 반복했었다.  
1. `app/api/comment/route.js` 파일을 만든다. (백엔드)  
2. `useEffect`나 이벤트 핸들러에서 `fetch(/api/visit)`을 호출한다. (클라이언트)  
3. 성공 시, `useState`로 인해 화면이 리렌더링된다.

Next.js의 App Router는 <b>Server Actions</b>를 통해 <b>1,2번 과정을 삭제했다</b>.  
그냥 자바스크립트 함수를 부르면, 그게 서버에서 실행된다.

### 1-1. "use server"
Server Actions의 구현방법은 아주 간단하다. 맨 위에 `use server`라고 적기만 하면 된다.  
```Jsx
// app/guestbook/actions.js (서버 사이드 코드)
'use server'
import db from '@/lib/db'

export async function addComment(formData) {
  const comment = formData.get('comment')
  
  // 1. DB에 저장 (이 코드는 서버에서 도니까 안전함)
  await db.comment.create({ data: { text: comment } })
  
  // 2. 중요! 화면 갱신하라고 명령 (다음에서 설명)
  revalidatePath('/guestbook')
}
```

### 1-2. 컴포넌트에서 사용하기 (<form\>)
이제 클라이언트 컴포넌트에서 `fetch`를 사용할 필요가 없다. `<form>`의 `action`에게 저 함수를 꽂아주기만 하면 된다.
```Jsx
// app/guestbook/page.js
import { addComment } from './actions' // 함수 import

export default function Guestbook() {
  return (
    <form action={addComment}>
      <input name="comment" type="text" />
      <button type="submit">등록</button>
    </form>
  )
}
```

이 컴포넌트의 구체적인 동작원리는 아래와 같다.  
1. 사용자가 '등록' 버튼을 누른다.  
2. Next.js가 자동으로 입력값을 포장해 서버 함수(`addComment`)로 POST 요청을 한다.  
3. 서버 함수가 실행된 뒤, 결과를 return한다.  

PHP나 JSP의 Form 전송처럼 매우 간단하나, 브라우저 새로고침은 전혀 일어나지 않는다!

---

## 2. 캐시 무효화 (Revalidation)
지난 학습에서 Next.js의 다양한 캐시 기능을 학습했었다. Next.js는 한 번 가져온 데이터를 정말 끈질기게 기억한다.  

따라서 데이터를 수정했다면, Next.js에게 기존 데이터는 낡았음을 알려주고 새로운 데이터로 덮어씌워야 한다.
이 방식은 크게 2가지로 가능하다.

### 2-1. revalidatePath ('경로' 기준)
가장 직관적이다. 특정 주소(URL)에 해당하는 페이지의 캐시를 날려버린다.
<b>'해당 경로에 해당하는 페이지의 캐시를 모두 날려'</b>라는 의미이다.  

예를 들어 차트와 같은 실시간 데이터를 만든다고 생각해보자. `/chart`에 새로운 데이터가 들어오게 될 것이다.

그럴 때 `revalidatePath('/chart')`를 사용하면 `/chart`를 보고 있는 사용자의 화면이 즉시 최신 데이터로 새로고침된다. 

하지만 `revalidatePath`는 만약 해당 차트가 메인 페이지(`/`)의 일부 컴포넌트로서 존재한다면  
`/chart`만 새로고침한 것이기 때문에 메인 페이지에선 오래된 데이터를 보고 있게 된다.

### 2-2. revalidateTag ('데이터' 기준)
URL이 아니라 <b>데이터 자체</b>에 이름을 붙여서 관리하는 방식이다.

`fetch(url, { next: { tags: ['posts'] } })`와 같이 next option에 `tags`를 달아놨다면 사용 가능하다.
<b>'이 태그가 달린 데이터는 모두 새로 고침'</b>하라는 의미이며, 여러 페이지를 동시에 갱신할 때 유용하다.

앞서 `revalidatePath`의 한계를 확실하게 해결해줄 수 있다. 메인 페이지부터 내가 미처 신경쓰지 못한 페이지까지 한꺼번에
새로고침이 된다.

## 3. 로딩 상태 처리 (useFormStatus)
서버 액션은 모두 비동기 작업(DB 저장 등)이기 때문에 시간이 조금 걸릴 수도 있다.

하지만 사용자 입장에선 별다른 표시가 없다면 중복 요청(일명 따-닥)을 시도할 수 있기 때문에 로딩 상태를 반드시 표시해줄 필요가 있다.  

React는 이를 위해서 훅을 제공해준다. (단, `<form>`의 자식 컴포넌트에서만 사용 가능)
```Jsx
'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  // pending: 현재 액션이 실행 중이면 true
  const { pending } = useFormStatus()
 
  return (
    <button disabled={pending}>
      {pending ? '저장 중...' : '등록'}
    </button>
  )
}
```

### 3-1. loading.js와 useFormStatus의 차이점
둘 다 '로딩 중'이라는 화면 혹은 섹션을 보여주지만, 사용하는 목적이 완전히 다르다.

<table>
    <caption><code>loading.js</code>와 <code>&lt;useFormStatus&gt;</code> 비교</caption>
    <thead>
        <tr>
            <th>구분</th>
            <th><code>loading.js</code> (Suspense)</th>
            <th><code>useFormStatus</code></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>성격</td>
            <td><b>네비게이션 (이동)</b> 로딩</td>
            <td><b>뮤테이션 (수정)</b> 로딩</td>
        </tr>
        <tr>
            <td>언제?</td>
            <td>페이지를 <b>들어갈 때</b> (데이터 가져오는 중)</td>
            <td>버튼을 <b>클릭할 때</b> (데이터 저장하는 중)</td>
        </tr>
        <tr>
            <td>범위</td>
            <td>페이지 전체 혹은 섹션</td>
            <td><code>&lt;form&gt;</code> 내부의 특정 버튼이나 UI</td>
        </tr>
        <tr>
            <td>UX 목적</td>
            <td>빈 화면(흰색)을 보이지 하기 위해</td>
            <td>중복 클릭(따닥)을 막고, 처리 중임을 알리기 위해</td>
        </tr>
    </tbody>
</table>

## 4. Deep Dive: 왜 API를 안 만들까? (RPC 패턴)
이런 방식을 <b>RPC(Remote Procedure Call)</b>라고 부른다.
클라이언트(브라우저)가 마치 내 옆에 있는 함수를 부르듯이 서버의 함수를 호출하는 것이다.

과거에는 프론트엔드와 백엔드가 물리적으로, 코드적으로 완전히 분리되어 있어서 HTTP 통신(REST API)이 필수였다.
하지만 Next.js App Router는 <b>"서버와 클라이언트가 한 프로젝트 안에 공존"</b>하기 때문에, 복잡한 API 엔드포인트를 생략하고 직접 함수를 연결하는 효율적인 방식을 택한 것이다.

## 5. 결론 및 리팩토링 계획
Server Actions와 Server Component를 학습하고 나니, 내 블로그의 `PostRank` 컴포넌트가 눈에 밟힌다.

현재 내 코드는

1. `app/api/rank/route.js`를 만들고 (API Route)
2. 클라이언트 컴포넌트에서 `useEffect`와 `fetch`로 데이터를 요청하고 있다.

굳이 그럴 필요가 없었다. **단순히 데이터를 보여주는 로직**이라면 Server Component에서 직접 DB를 찌르면 되고, **조회수를 올리는 로직**이라면 Server Action을 쓰면 된다.

다음 단계에서는 불필요한 API Route를 제거하고, `useEffect` 없이 깔끔하게 동작하는 **서버 컴포넌트 기반의 랭킹 시스템**으로 리팩토링을 진행해봐야겠다.