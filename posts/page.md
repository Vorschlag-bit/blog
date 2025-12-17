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
계산 로직이 왜 저렇게 되는 건지 + 시작,끝 인덱스도 왜 저렇게 되는 건지 추가

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

&lt, &gt는 무엇인가?

