---
title: "목차와 리모컨을 만들기"
date: "2025-11-25 04:39:45"
category: "개발"
description: "블로그 사이드에 배치할 목차와 리모컨을 만들어보자"
---

## 목차와 리모컨 만들어보기
지금까지 내 블로그는 Next.js의 App router 구조라서 주로 Server Component였다.서버가 준비한 데이터를 보여주기만 하면 되는 수동적인 구조인 셈이다.

하지만 이번에 내가 만들어보고 싶은 것은 글을 상세조회했을 때, 오른쪽 사이드에 위치하는\
**목차 겸 리모컨** 컴포넌트를 만들어보고 싶었다. 이 기능은 **스크롤 이벤트 감지**, **클릭 이동**, **현재 위치 하이라이팅** 등
브라우저(Client)에서만 가능한 기능이다. 다크모드처럼 새로운 클라이언트 컴포넌트를 만들 생각에 재밌을 거 같았다.

### 1. 전체 구조 설계
앞서 말했듯이 지금 내 `page.js`는 Server Component이지만, 스크롤 이벤트 감지 같은 건 Client에서만 가능하기 때문에\
이 기능을 담당할 Client Component를 만들어서 `page.js`에 껴 넣으면 될 거라고 생각했다.

```TEXT
src/
    components/
        PostRemoteController.js (클라이언트 컴포넌트: 목차 겸 리모컨)
    app/
        post/
            [id]/
                post.js (서버 컴포넌트: 데이터 fetch 후 리모컨 주입)
```

### 2. 고려해야 할 점
이 컴포넌트를 구현하기 위해서 고려해야 할 점이 뭐가 있을지 생각을 해봤다.\
우선 **목차** 기능이기 떄문에 내 글이 HTML로 변환될 때 헤딩(h1,h2,h3) 태그들을 다 찾아야 했다.\
React가 useEffect로 랜더링된 후, 본문이 담긴 DOM 요소 내부에서 `<h2>`, `<h3>` 태그들을 모두 찾게될 것이다.

여기서 한 가지 문제점은 내가 Server와 Client 사이의 HTML 변환을 위해 `dangerouslySetInnerHTML`를 사용해서 HTML을 뿌렸다는 점이다.
이를 통해 뿌려진 HTML은  
`id`가 없다는 특징이 있는데, javascript로 헤딩 태그들을 순회하면서 id가 없다면 부여하도록 해야 했다.
그래야 목차를 클릭할 경우 해당 위치로 이동할 수 있기 때문이다.

그 후에는 찾아낸 헤딩 태그들의 정보를 `state`로 저장한다.
```javascript
// 예시 데이터 구조
[
  { id: "heading-1", text: "서론", level: 2 }, // h2
  { id: "heading-2", text: "사용법", level: 3 }, // h3
]
```
그 다음에는 현재 사용자가 보고있는 위치를 감지해야 한다. 스크롤을 내려서 읽을 때마다 현재 읽고 있는 섹션이
목차 내에서 하이라이팅이 되어야 하기 때문이다.

이를 위해선 **스크롤 이벤트 리스너**를 사용하거나 **IntersectionObserver**를 사용해야 하는데, 후자가 성능이
더 좋다고 해서 후자를 사용해 각 헤딩 태그를 관찰하다가 화면에 들어오면 해당 헤딩의 id를 `activeId`라는 state에 저장시킬 것이다.

마지막으로는 목차를 누르거나, 리모컨을 통해 맨위/아래로 이동할 때 **부드럽게** 이동해야 한다.\
이는 `behavior: smooth`를 사용해서 구현하면 될 거 같았다.


### 3. 핵심 로직 구현
설계한 내용을 바탕으로 `PostRemoteController` 컴포넌트를 구현했다.
이 컴포넌트의 핵심은 **DOM이 랜더링된 직후**에 본문의 헤딩 태그들을 긁어오는 것이다.
```javascript
// src/components/PostRemoteControl.jsx
"use client";

export default function PostRemoteControl() {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        // 1. 본문 영역(.prose) 선택
        const contentArea = document.querySelector(".prose");
        if (!contentArea) return;

        // 2. h2, h3 태그 수집
        const elements = contentArea.querySelectorAll("h2, h3");
        const headingData = [];

        elements.forEach((el, index) => {
            // id가 없다면 강제로 부여 (앵커 이동을 위해)
            if (!el.id) el.id = `section-${index}`;

            headingData.push({
                id: el.id,
                text: el.innerText,
                level: el.tagName,
                element: el,
            });
        });

        setHeadings(headingData);
        
        // ... Observer 로직 ...
    }, []);

    // ... 렌더링 로직 ...
}
```
처음에는 이렇게 `if` 문을 통해서 id가 없을 경우 직접 부여하는 로직을 구현했으나\
`rehype-slug` 플러그인을 통해서 **서버가 HTML을 생성할 때 아예 id를 심어주도록** 수정했다.\
따라서 `posts.js`의 페이지 랜더링 변환 로직에 `rehypeSlug` 함수를 추가했다.
```javascript
import rehypeSlug from 'rehype-slug'; // import 추가

// ... 기존 코드 ...
const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug) // [추가] HTML 변환 시 id를 자동으로 생성해줌!
    .use(rehypeRaw)
    // ... 나머지 플러그인
    .process(matterResult.content);
```

IntersectionObserver를 활용해 스크롤을 할 때마다 `entry.isIntersecting`을 체크해서 `activeId`를
업데이트해주는 로직을 추가했고, 클릭 시 `window.scrollTo`를 이용해서 부드러운 이동을 구현했다.

<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span className="text-red-400">트러블 슈팅</span>
</summary>

하지만 처음에는 목차 컴포넌트는 생성되었으나 아무런 헤딩들이 보이질 않았었다.\
이론적으로 딱히 놓친 게 없었던 거 같은데, 막상 실행해보니 목차가 랜더링되질 않았다. 
!["아무것도_안_뜸"](/images/remote_fail.png)

콘솔을 통해서 데이터를 로깅해봤을 때도
`headings`는 3개가 분명히 존재했었다.
!["콘솔_로그"](/images/remote_debug.png)

원인에는 2가지 실수가 존재했었다.

**1. `map` 함수의 실수**

React에서 리스트를 랜더링할 때 습관적으로 `{}`(중괄호)를 사용했었는데, `return`을 빼먹은 것이다.
```javascript
// ❌ 실수한 코드: 중괄호를 썼는데 return이 없음 -> undefined 반환
{headings.map((heading) => {
    <li key={heading.id}>...</li>
})}

// ✅ 수정된 코드: 소괄호()를 사용하여 암시적 리턴(implicit return) 사용
{headings.map((heading) => (
    <li key={heading.id}>...</li>
))}
```
이 사소한 실수때문에 30분 동안 코드를 뒤적였고, 눈이 너무 아팠다.\
 JSX를 반환할 때는 **소괄호**를 사용하는 습관을 들이자.

**2. document vs element**

클릭 시 이동하는 함수에서 잘못 사용한 요소가 문제였다.
`document.getBoundingClientRect()`라는 함수는 존재하지 않았는데, `document` 객체에서 호출한 것이 문제였다.
내가 찾은 특정 `element` 기준으로 위치를 계산해야 했었다.

</details>

### 4. 페이지 적용 및 스타일링
완성된 컴포넌트를 상세 페이지인 `src/app/[id]/page.js`에 적용했다.\
모바일에서는 본문을 가릴 수 있으므로 `hidden xl:block`을 적용해서 화면이 넓은 환경(1280px 이상)에서만 목차와 컨트롤러가 보이도록 처리했다.

디자인은 블로그 컨셉인 Retro 무드에 맞게 픽셀 아트 느낌의 그림자(shadow-pixel)와 Galmuri 폰트를 적용했다.

```javascript
// src/app/posts/[id]/page.js
export default async function Post({params}) {
    // ...
    return (
        <div className="relative max-w-4xl mx-auto p-4">
             {/* 우측에 리모컨 배치 */}
            <PostRemoteControl />
            
            <RetroWindow>
                {/* ... 본문 내용 ... */}
            </RetroWindow>
        </div>
    )
}
```

### 5. 마치며
단순히 데이터를 뿌려주는 것을 넘어서, 사용자의 스크롤 위치를 실시간을 감지하고 상호작용하는 기능을
구현해보니 블로그가 훨씬 생동감 있게 바뀌었다!

서버 컴포넌트(데이터 fetch)와 클라이언트 컴포넌트(인터렉션)가 적절히 역할을 분담하는 Next.js의 매력도 느낄 수 있었던 기능 개발이었다.

다음에는 블로그 왼쪽에 위치할 컴포넌트를 구상해봐야겠다.