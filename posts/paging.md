---
title: "page 기능을 만들어보자"
date: "2025-12-17 16:01:46"
category: "개발"
description: "Js에서 직접 page 객체 기능을 만들어보기"
---

## Page 기능을 만들어보자
블로그 글이 40개가 넘어가면서 슬슬 한 화면에 모두 다 보여주기엔 버겁다고 생각이 들었다.  
마침 글 상세 조회 시에도 <b>이전 글</b>과 <b>다음 글</b>이 존재하면 좋겠다고 생각을 들던 차였기에
외부 라이브러리 도움없이 직접 페이지 기능을 구현해보기로 했다.

### 설계 및 구현
먼저 난 기존이 `lib/posts.js`에 `getSortedPostsData()` 함수를 통해서 정렬된 Post 리스트를 가져오는 함수가 존재했다.  
이걸 활용해서 <b>특정 페이지의 글만 잘라서 주는 함수</b>를 만들기로 했다.

```javascript

export function getPaginatedPosts(page = 1, limit = 10) {
    // 1. 모든 글 가져오기 (기존 함수 활용)
    const allPosts = getSortedPostsData()

    // 2. 모든 글 개수
    const totalCount = allPosts.length

    // 3. Paging 계산 로직 (10개씩 보여주되, 41개면 5페이지이므로 올림처리)
    const totalPages = Math.ceil(totalCount / limit)

    // 4. 현재 페이지가 범위를 벗어나지 않도록 보정
    const currentPage = Math.max(1,Math.min(page,totalPages))

    // 5. 배열 자르기
    const startIdx = (currentPage - 1) * limit
    const endIdx = startIdx + limit

    // slice를 통해서 원본 배열의 범위만큼 복사해서 가져오기
    const paginatedPosts = allPosts.slice(startIdx, endIdx)

    // 6. Java Page 객체처럼 return
    return {
        posts: paginatedPosts,                  // 현재 페이지 글 목록(content)
        currentPage,                            // 현재 페이지 번호
        totalPages,                             // 전체 페이지 수
        totalCount,                             // 전체 글 수
        hasNext: currentPage < totalPages,      // 다음 페이지 존재 여부
        hasPrev: currentPage > 1,               // 이전 페이지 존재 여부
    }
}
```
현재 페이지는 `searchParams`로 넘겨받은 <b>page값에 대한 에러 핸들링</b>을 위해 저렇게 작성되었다.  
사용자가 <b>악의적으로 최대 페이지 수이상의 수</b>를 URL에 입력할 경우, totalCount와 최소 비교를 통해서 막을 수 있고,
반대로 <b>음수</b>를 넣었을 경우에도 1과의 최대 비교를 통해서 최소 1을 보장하도록 했다.

인덱스를 계산할 때는 배열과 페이지가 서로 `0-based`와 `1-based`로 다르기 때문에 $$-1$$을 해줌으로써 알맞게 슬라이싱이 된다.

그 후엔 페이지 번호를 누를 수 있는 <b>리모컨 UI</b>를 만들어야 했다.  
Next.js의 `<Link>` 태그를 활용해서 <b>URL 쿼리스트링(`?page=n`)</b>을 변경하기 위함이다.

```javascript
import Link from "next/link";

export function Pagination({ currentPage, totalPages }) {
    // 페이지 번호 배열 만들기
    const pages = Array.from({ length: totalPages }, (_, i) => i+1);

    return (
        <div>
            {/** 이전 버튼 */}
            {currentPage > 1 ? (
                <Link
                    href={`/?page=${currentPage - 1}`}
                    className="px-3 py-1 border-2 border-black"
                >
                    &lt; PREV
                </Link>
            ) : (
                <span className="px-3 py-1 border-2 border-gray-300">
                    &lt; PREV
                </span>
            )}
            {/** 페이지 번호들*/}
            <div>
                {pages.map((p) => (
                    <Link
                        key={p}
                        href={`/?page=${p}`}
                        className={`px-3 py-1 border-2
                            ${p == currentPage ? 'bg-blue-600 text-white' : 'border-black'}`}
                    >
                        {p}
                    </Link>
                ))}
            </div>
            {/** 이후 버튼 */}
            {currentPage < totalPages ? (
                <Link
                    href={`/?page=${currentPage + 1}`}
                    className="px-3 py-1 border-2 border-black"
                >
                    NEXT &gt;
                </Link>
            ) : (
                <span className="px-3 py-1 border-2 border-gray-300">
                    NEXT &gt;
                </span>
            )}
        </div>
    )
}
```
`<`(꺽쇠) 모양을 넣기 위해서 HTML Entity를 넣어서 표현했다.  
HTML에선 `<`와 `>`는 <b>태그</b>의 의미를 갖기 때문에 아무리 태그 내부에 넣는다고 해도, Parser가 제대로 파싱을 못 하게 방해하기 때문에
별도의 코드로 작성해야 한다.
#### 완성된 페이징 UI (전체 및 카테고리 조회 시)
<figure>
    <img src="/images/page_t1.png" alt="틀만 잡은 페이지 UI 모습">
    <figcaption>CSS를 대충 적용해본 페이지 UI 모습</figcaption>
</figure>

<figure>
    <img src="/images/page_t2.png" alt="CSS 적용한 페이지 UI 모습">
    <figcaption>테마에 맞게끔 CSS 적용한 UI 모습</figcaption>
</figure>

### 카테고리 모음 화면에도 적용
이걸 `/categories/[slug]/page.js`에도 적용시켜야 한다.  
`page.js`는 `/categories/[slug]`로 이동할 경우 실행되기 때문에 기본 url이 별도로 존재한다. (basePath)
현재는 `Pagination` Component의 `href`가 <b>홈(`/`)</b>을 기준으로 되어 있기 때문에 basePath를 바탕으로 queryString을 붙이는 식으로
수정했다.

```javascript
// basePath를 받도록 수정 (기본값은 "/")
export default function Pagination({ currentPage, totalPages, basePath = "/" }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
            <div>
                // basePath 뒤에 queryString 덧붙이기
                <Link
                    href={`${basePath}?page=${currentPage - 1}`}
                    className="px-3 py-1 border-2 border-black dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                    &lt; PREV
                </Link>
            </div>
    )
}
```

다음으로 `categories/[slug]page.js`의 파라미터를 이젠 params뿐만 아니라 searchParams(queryString)도 받게 했다.
```javascript
// paging을 위한 searchParams와 라우팅을 위한 카테고리 params
export default async function CategoryPage({ params, searchParams }) {
    // url에서 카테고리 이름 갖고 오기 (ex: "개발")
    // 한글을 깨지므로 decodeURIComponent 사용
    const { slug } = await params
    const category = decodeURIComponent(slug)
    
    // 해당 카테고리 글만 가져오기
    const query = await searchParams
    const page = Number(query?.page) || 1
    const LIMIT = 10

    // return 받은 객체 fields
    const { posts, totalPages, curPage } = getPaginatedCategories(page, LIMIT, category)

    return (
        <div>
            ... 기존 ul li 태그들...
            <Pagination currentPag={curPage} totalPages={totalPages} basePath={`/categories/${slug}`} />
        </div>
    )
}
```

전체 이동 로직을 정리하면  
1. 사용자가 `/categories/HTML?page=2`로 이동
2. Next.js가 `/app/categories/[slug]/page.js`를 실행
3. `params`에는 `{ slug: 'HTML' }`이 들어가 있음 -> `category` 변수
4. `searchParams`에는 `{ page: 2 }`가 들어가 있음 -> `page` 변수
5. `getPaginatedCategories(2, 10, HTML)` 함수가 실행 -> 해당 카테고리의 2페이지 글 목록만 가져옴
6. `Pagination` 컴포넌트에는 `basePath=/categories/HTML`를 넘겨줘서 다른 페이지 버튼을 누를 경우,
    `/categories/HTML?page=3`으로 이동하게 된다.


### 상세조회에서 이전 이후 글 적용하기
전체에 대한 페이징을 적용하고 나니, 이를 활용해 상세조회 시 <b>이전/이후</b> 글로 바로 이동할 수 있는 컴포넌트를 만들어도
괜찮겠다고 생각이 들었다.


카테고리 분류를 통해 들어온 상세 조회건 전체 조회에서 들어온 상세 조회건 현재 url은 `/posts/title`이다.  
물론 Paging 배열 속 인덱스 정보 같은 걸 queryString으로 받아서 이전/이후를 판별하는 로직에 사용할 수도 있겠지만
그렇게되면 카테고리 분류로 들어올 때랑 전체 조회에서 들어올 때랑 url이 달라지고, 계산 로직도 복잡해질 거 같아서
단순히 내 post의 `id`를 바탕으로 이전/이후를 계산해 존재 유무에 따라 보여주는 컴포넌트를 만들기로 했다.

먼저 `lib/posts.js`에 현재 id를 바탕으로 이전/이후 글 id 및 글 정보를 return하는 함수를 만들었다.
```javascript
// 상세 조회에서 사용할 이전/이후 포스팅 nav 로직
export function getPreNextPost(currentId) {
    const allPosts = getSortedPostsData()

    // 현재 글 idx 찾기
    const idx = allPosts.findIndex((post) => post.id === currentId)

    // 예외처리
    if (idx === -1) return { prev: null, next: null }

    // idx - 1 == 더 최신 글 -> Next
    // idx + 1 == 더 이전 글 -> Prev
    const next = idx - 1 >= 0 ? allPosts[idx - 1] : null;
    const prev = idx + 1 < allPosts.length ? allPosts[idx + 1] : null;

    return {
        prev: prev,     // 이전 글
        next: next,     // 이후 글
    }
}
```
이전/이후 글을 스스로 결정하는 게 좀 헷갈렸는데 그냥 문자 그대로 이전은 이전, 이후는 이후의 글을 보여주기로 결정했다.

그 다음엔 실제로 보여줄 컴포넌트를 만들었다.
```javascript
export default function PostNavigator({ prev, next }) {
    return (
        <div className="flex w-full gap-4 mt-10 mb-8 font-[Galmuri11]">
            {/* 이전 글 (Prev) */}
            {prev ? (
                <PostCard post={prev} type="prev" />
            ) : (
                <div className="flex-1 invisible" />
            )}

            {/* 다음 글 (Next) */}
            {next ? (
                <PostCard post={next} type="next" />
            ) : (
                <div className="flex-1 invisible" />
            )}
        </div>
    );
}
```
이전/이후의 CSS가 방향만 다르고 똑같았기 때문에 공용 컴포넌트인 PostCard 함수를 통해서 구현하였다.
```javascript
function PostCard({ post, type }) {
    const isNext = type === 'next';

    return (
        <Link 
            href={`/posts/${post.id}`} 
            className=""
        >
            <div className={`
                다른 css들...
                ${isNext ? 'flex-row-reverse text-right' : 'flex-row text-left'}
            `}>
                
                {/* 1. 아이콘 (원형 테두리) */}
                <div className={`
                    ${!isNext && 'rotate-180'} /* Prev일 때 화살표 180도 회전 */
                `}>
                    {/* SVG 삽입 */}
                    <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> 
                        <path d="M6 4h2v2h2v2h2v2h2v4h-2v2h-2v2H8v2H6V4zm12 0h-2v16h2V4z" fill="currentColor"/> 
                    </svg>
                </div>

                {/* 2. 텍스트 정보 */}
                <div className="">
                    <span className="">
                        {isNext ? '다음 포스트' : '이전 포스트'}
                    </span>
                    <h3 className="">
                        {post.title}
                    </h3>
                </div>

            </div>
        </Link>
    );
}
```
핵심은 `isNext`라는 상수를 통해서 내가 사용한 방향 아이콘을 180도 뒤집고, flex를 통한 정렬 역시 isNext 삼항연산자를
통해서 `flex-row-reverse`와 `flex-row` 중 선택하도록 구현하였다.

#### 완성된 PostNavigator UI (상세 조회 시)
<figure>
    <img src="/images/page_t4.png" alt="이전 글 버튼만 있는 UI 사진">
    <figcaption>이전 글 버튼만 있을 경우 모습</figcaption>
</figure>

<figure>
    <img src="/images/page_t5.png" alt="이전/이후 글 모두 있는 UI 사진">
    <figcaption>이전/이후 버튼 모두 있을 경우 모습</figcaption>
</figure>

이제 페이징 기능까지 추가하면서 블로그가 정말 여타 플랫폼과 비교해도 손색이 없을 만큼  
그럴 듯해 보인다. 다음 번엔 <b>DB를 활용한 조회 수</b> 기능을 만들어볼까 한다.

본격적인 DB와의 데이터 연동을 할 좋은 항목이라고 생각하고 개발하면서 또 많은 걸 배울 수 있을 것이다!