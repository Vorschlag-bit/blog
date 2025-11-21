---
title: "카테고리 만들기"
date: "2025-11-21 19:00:00"
category: "개발"
description: "블로그에 사용할 카테고리 기능을 만들기"
---

## 카테고리 기능 만들기

우선 구조는 아래와 같이 잡았다.
1.  **데이터:** 마크다운 파일(`Frontmatter`)에 `category: "일상"` 같은 줄을 추가
2.  **로직:** 전체 글 중에서 "특정 카테고리만 뽑아오는 함수"를 만들기
3.  **화면:**
    *   메인 페이지 글 목록에 **[일상]** 같은 태그를 붙여줌.
    *   태그를 누르면 `/categories/일상` 페이지로 이동해서 그 주제 글만 보여줌.


---

### 1단계: 마크다운 파일 수정하기

모든 `.md` 파일(최소 2개 이상)을 열어서 `category` 항목을 추가했다.

**[예시: posts/first.md]**
```yaml
---
title: "첫 번째 글"
date: "2025-11-21"
category: "개발"  <-- 이거 추가!
description: "..."
---
```

**[예시: posts/second.md]**
```yaml
---
title: "오늘 점심 메뉴"
date: "2025-11-22"
category: "일상"  <-- 이거 추가!
description: "..."
---
```

---

### 2단계: 로직 업데이트 (`src/lib/posts.js`)

이제 `category` 정보를 가져오고, 특정 카테고리 글만 걸러내는 기능을 추가한다.
`src/lib/posts.js` 파일을 열고 아래 내용을 반영한다.

**1. `getSortedPostsData` 함수 수정**

```javascript
// ... 기존 코드 ...
    return {
      id,
      ...matterResult.data,
      category: matterResult.data.category || "기타", // 카테고리가 없으면 '기타'로 처리
    };
// ... 기존 코드 ...
```

**2. `getPostsByCategory` 함수 추가 (파일 맨 아래에 작성)**
특정 카테고리의 글만 필터링해서 가져오는 함수이다.

```javascript
// 특정 카테고리의 글만 가져오는 함수
export function getPostsByCategory(category) {
  const allPosts = getSortedPostsData();
  // filter 함수로 조건에 맞는 것만 남김
  return allPosts.filter((post) => post.category === category);
}
```

---

### 3단계: 메인 페이지에 태그 보여주기 (`src/app/page.js`)

메인 목록에서 제목 옆이나 위에 카테고리 뱃지를 달아준다. 그리고 그걸 누르면 이동하게 링크(`Link`)를 걸었다.

```javascript
import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="p-10">
      <section>
        <h1 className="text-4xl font-bold mb-8">블로그 글 목록 📝</h1>
        <ul className="space-y-4">
          {allPostsData.map(({ id, title, date, description, category }) => (
            <li key={id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2">
                {/* 1. 카테고리 뱃지 추가 */}
                <Link href={`/categories/${category}`}>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 hover:underline cursor-pointer">
                    {category}
                  </span>
                </Link>
                <p className="text-gray-500 text-sm">{date}</p>
              </div>

              <Link href={`/posts/${id}`}>
                <h2 className="text-2xl font-bold text-blue-600 cursor-pointer hover:underline">
                  {title}
                </h2>
              </Link>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

---

### 4단계: 카테고리 모아보기 페이지 만들기 (동적 라우팅) ⭐

이제 **`/categories/개발`** 로 접속하면 개발 글만 보여주는 페이지를 만들었다.

1.  `src/app` 안에 `categories` 폴더 생성
2.  그 안에 `[slug]` 폴더 생성 (폴더 이름이 대괄호 포함 `[slug]`)
3.  그 안에 `page.js` 생성

최종 경로: `src/app/categories/[slug]/page.js`

**[코드 작성]**
메인 페이지랑 거의 비슷한데, 데이터를 가져올 때 **전체가 아니라 필터링된 데이터**를 가져오는 게 다르다.

```javascript
import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts"; // 아까 만든 필터 함수

export default async function CategoryPage({ params }) {
  // URL에서 카테고리 이름 가져오기 (예: '개발')
  // 한글이 깨질 수 있으니 decodeURIComponent 사용
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  
  // 해당 카테고리 글만 가져오기
  const categoryPosts = getPostsByCategory(category);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        📂 <span className="text-blue-600">{category}</span> 관련 글
      </h1>

      {categoryPosts.length === 0 ? (
        <p>이 카테고리에는 아직 글이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {categoryPosts.map(({ id, title, date, description }) => (
            <li key={id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <p className="text-gray-500 text-sm mb-1">{date}</p>
              <Link href={`/posts/${id}`}>
                <h2 className="text-2xl font-bold hover:underline">{title}</h2>
              </Link>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---