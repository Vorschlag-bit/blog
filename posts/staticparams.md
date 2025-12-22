---
title: "generateStaticParams와 dynamicParams를 활용해 Next.js에게 화이트 리스트 제공하기"
date: "2025-12-22 22:19:06"
category: "개발"
description: "Next.js의 예약어 기능을 활용해서 404 page를 손쉽게 호출해보자"
---

## 1. 서론: 404가 안 나와요
사건의 발단은 특정 카테고리 글만 모아서 보여주는 `/categories/[slug]/page.js`의 CSS를 수정하면서 놀던 중 발생했다.  
URL에 있는 `[slug]` 대신 다른 걸 입력하면 어떻게 되지?라고 생각이 들어서 `params`에 아무 내용이나 입력해봤다.

<figure>
    <img src="/images/wr_params.png" alt="잘못된 params를 입력하고 난 뒤 화면" >
    <figcaption>404가 아니라 그대로 page.js가 호출된 모습을 볼 수 있다.</figcaption>
</figure>

처음엔 당황스러워서 내가 작성한 코드 로직을 다시 살펴봤다.

```javascript
// url에서 카테고리 이름 갖고 오기 (ex: "개발")
const { slug } = await params
const category = decodeURIComponent(slug)

// ... (중략)

// return 받은 객체 fields
const { posts } = getPaginatedCategories(page, LIMIT, category)

// 렌더링 부분
{ posts.length === 0 ? (
    <p>이 카테고리에는 아직 글이 없습니다.</p>
) : ( ... ) }
```

`getPaginatedCategories()` 함수는 내부적으로 `filter`를 사용하여 카테고리가 일치하는 글만 남긴다.
당연히 <b>category</b>로 사용된 params에 맞는 글이 없으니 빈 배열(`[]`)이 반환되었을 것이다.
결국 화면에는 "글이 없습니다"라는 텍스트만 덩그러니 남고, `category` 타이틀은 내가 URL에 막 입력한 텍스트 그대로 노출되고 있었다.

### 더 심각한 문제: 파일 시스템 접근
이후엔 `/posts` 하위 params도 테스트해봤다. 내 블로그는 아주 간단한 구조라 `/posts/[id]` 경로를 사용하는데, 여기에 의미 없는 값을 입력해보았다.

<figure>
    <img src="/images/wr_posts.png" alt="잘못된 params를 /posts 하위에 입력해본 모습" >
    <figcaption>핸들링 되지 않은 치명적인 오류가 나오는 모습</figcaption>
</figure>

이번엔 핸들링되지 않은 에러의 모습이 적나라하게 나왔다. `/posts/[id]/page.js` 내부 코드는 별도의 검증 없이 곧바로 `fs` 모듈을 통해 파일을 읽으려 시도했기 때문이다.

그제서야 정신이 번쩍 들었다. 비록 공개 프로젝트지만 <b>URL을 조작해 내 프로젝트 파일 시스템을 뒤져보는 일(Path Traversal)</b>이 발생하지 않도록, `try-catch`로 확실한 예외 처리를 추가했다.

```javascript
// id(파일 이름)을 받아서 해당 글의 데이터를 가져오는 함수
export async function getPostData(id) {
    // Path Traversal 방지 (id에 슬래시나 파일 시스템 탐색 시도 차단)
    if (id.includes('/') || id.includes('\\') || id.includes('..')) return null;

    try {
        const fullPath = path.join(postsDirectory, `${id}.md`)
        // ... 파일 읽기 및 변환 로직 ...
        return { ... }
    } catch (error) {
        console.error(`Error reading post id -> ${id}: `, error);
        return null;
    }
}
```

그리곤 `posts/[id]/page.js`에서 `null`을 반환받았을 때 Next.js가 제공하는 `notFound()` 함수를 호출하도록 수정했다.

### 레이아웃 중첩의 딜레마
그렇게 `notFound()` 함수로 에러 핸들링을 하고 화면을 보았다.

<figure>
    <img src="/images/wr_posts2.png" alt="에러가 잘 핸들링되었으나 양 옆에 사이드 바가 존재하는 404 페이지 모습">
    <figcaption>404가 나오긴 하는데... 사이드바는 왜 거기서 나와?</figcaption>
</figure>

원인은 <b>Next.js App Router의 레이아웃 중첩(Nested Layout) 구조</b> 때문이었다.

나는 깔끔한 404 페이지를 위해 사이드바가 없는 최상위 `layout.js`와, 사이드바가 포함된 `(main)/layout.js`를 분리해 두었다.

하지만 `notFound()`가 호출된 시점은 이미 `(main)/layout.js` 내부인 `/posts/[id]/page.js`였다.
즉, **부모 레이아웃(사이드바)은 그대로 유지된 채** 자식 컴포넌트만 404 페이지로 교체된 것이다.

단순히 CSS로 숨길 수도 있겠지만, 기껏 깔끔한 404를 보여주기 위해 디렉토리까지 꾸역꾸역 나눠논 마당이라 근본적인 해결책이 필요했다. 

여기서 등장하는 것이 바로 <b>Next.js의 예약어 기능</b>이다.

## 2. 해결책: 미리 명단을 제출 (generateStaticParams)

Next.js에는 <b>빌드 타임(Build Time)</b>에 정적 경로를 미리 생성하는 `generateStaticParams`라는 함수가 존재한다.
쉽게 말해, 가게 문을 열기 전에 <b>"오늘 들어올 수 있는 손님 명단(VIP List)"</b>을 미리 문지기에게 전달하는 것이다.

### 사용 방법
사용법은 간단하다. `page.js` 파일 내에서 `generateStaticParams`라는 이름의 비동기 함수를  
`export`하면 된다.

**1. 포스트 페이지 (`/posts/[id]/page.js`)**
```javascript
import { getSortedPostsData } from "@/lib/posts";

// 빌드 시점에 실행되어 모든 글의 ID 리스트를 반환
export async function generateStaticParams() {
    const posts = getSortedPostsData(); // 모든 글 데이터를 가져옴
    return posts.map((post) => ({
        id: post.id // [id] 폴더명과 일치하는 키를 사용해야 함
    }));
}
```

**2. 카테고리 페이지 (`/categories/[slug]/page.js`)**
```javascript
import { getAllCategories } from "@/lib/posts";

export async function generateStaticParams() {
    const categories = getAllCategories(); // 모든 카테고리 목록을 가져옴
    return categories.map((item) => ({
        slug: item.category // [slug] 폴더명과 일치하는 키 사용
    }));
}
```

이제 Next.js는 빌드할 때 이 함수들을 실행해서 존재하는 모든 글과 카테고리에 대한 HTML을 미리 만들어둔다. <b>(SSG: Static Site Generation)</b>

## 3. 핵심: 문지기 세우기 (dynamicParams)

단순히 `generateStaticParams`만 쓴다면, 명단에 없는 손님이 왔을 때 Next.js는 "혹시 모르니까 서버에서 찾아볼게"라며 렌더링을 시도한다. (SSR 동작).
이때, <b>"명단에 없으면 아예 들여보내지 마"</b>라고 설정하는 것이 바로 <b>`dynamicParams`</b> 옵션이다.

```javascript
// 리스트에 없는 경로로 접근하면 404를 반환 (false 설정)
export const dynamicParams = false; 

export default async function Post({ params }) {
    // ...
}
```

이 옵션을 `false`로 설정하면, Next.js 라우터는 URL이 들어오자마자 `generateStaticParams`로 만든 명단을 확인한다.
만약 명단에 없는 `id`나 `slug`라면?  
<b>컴포넌트를 실행조차 하지 않고 즉시 404 페이지로 보내버린다.</b>

## 4. 왜 이 방식이 최적의 해결책인가?
단순히 사이드바를 없애기 위해서라기엔 거창해 보일 수 있지만, 내 블로그 환경(Markdown + Vercel)에서 이 방식은 세 가지 결정적인 장점이 있다.

### ① 레이아웃 문제 해결
`dynamicParams = false` 설정 덕분에, 유효하지 않은 URL은 `(main)/layout.js` 하위의 페이지 컴포넌트에 도달하기 전에 차단된다.
라우팅 레벨에서 튕겨 나가기 때문에, `(main)` 레이아웃이 렌더링되지 않고 **최상위 루트의 `not-found.js`가 깔끔하게 렌더링**된다. 사이드바 문제는 자연스럽게 해결되었다.

### ② 보안 강화 (Whitelist 기반 라우팅)
이전에는 `fs.readFileSync`가 실행되기 직전에야 방어 코드로 막았지만, 이제는 아예 접근조차 불가능하다.
<b>화이트리스트(Whitelist)</b> 방식이므로, 내가 작성한 글 외의 어떤 경로로도 파일 시스템에 접근 시도를 할 수 없다.

### ③ 성능 최적화 (Serverless 비용 절약)
내 블로그는 DB가 없고, 글을 작성해서 `git push`를 하면 Vercel이 빌드를 다시 수행하는 구조다.
즉, <b>"글이 바뀔 시점 = 배포 시점"</b>이 일치한다.

굳이 사용자가 접속할 때마다 서버(Serverless Function)를 깨워서 연산할 필요 없이, 빌드 타임에 HTML을 다 구워놓고 서빙만 하는 것이 가장 빠르고 효율적이다.

## 5. 결론
처음엔 단순히 "잘못된 URL 입력 시 404 띄우기"로 시작했지만, 결과적으로 <b>Next.js의 렌더링 전략(SSG)</b>을 제대로 활용하는 구조로 개선하게 되었다.

이제 내 블로그는 이상한 URL로 공격을 시도하거나 실수를 해도, 입구컷을 할 수 있는 블로그가 되었다.
덕분에 코드는 더 간결해졌고, 404 페이지는 깔끔해졌으며, 마음은 한결 편안해졌다.

```javascript
// 이제 page.js 내부에는 불필요한 방어 로직 없이, 본연의 기능만 남았다.
export default async function Post({ params }) {
    const { id } = await params
    const postData = await getPostData(id) // 이미 존재함이 보장됨

    return (
        <article>...</article>
    )
}
```