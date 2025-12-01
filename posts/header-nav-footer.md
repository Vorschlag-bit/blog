---
title: "SEO의 메뉴판인 <header>, <nav>, <footer>"
date: "2025-12-01 12:14:17"
category: "HTML"
description: "검색 엔진에게 안내서 역할을 하는 header,nav,footer 태그에 대해서 알아보자."
---

## header, nav, footer - 검색 엔진에게 메뉴판 쥐어주기
지금까지 나는 `main`,`section`,`article` 태그에 대해서 용도와 차이점 등을 위주로 학습했다.  
이 글은 본문을 감싸고 있는 <strong>사이트의 머리,발 그리고 지도</strong>에 대해서 알아보자.  
이 태그들을 제대로 사용한다면 구글 봇에게 내 사이트의 구조를 더욱 의미있게 알려줄 수 있게 된다.

### 1. 왜 이 태그들은 필요할까?
과거에는 상단 메뉴바도 `<div id="header" />`, 하단 정보도 `<div id="footer" />`로 만들었다.  
하지만 시각 장애인이 사용하는 **스크린 리더**나 **검색엔진 봇**은 `id` 값을 제대로 해석하지 못 하는 경우가 많다.
**메뉴로 건너뛰기**와 같은 기능을 수행하려면 `<nav>` 태그를 사용해야 하고, 사이트의 핵심 링크가 모여있는 곳을 파악해
페이지 간의 연결 관계를 이해해야 한다.

### 2. 각 태그의 역할과 사용법
`<header>` - **사이트의 간판**  
- 의미: 소개 및 탐색에 도움을 주는 콘텐츠 그룹.
- 위치: 보통 페이지의 최상단에 위치하지만, `<article>`이나 `<section>`의 머리말(제목 부분)으로도 사용된다.
- 내용: 로고, 사이트 제목, 검색창, 사용자 정보 등

```HTML
<!-- 사이트 전체 헤더 -->
<header>
  <h1>My Tech Blog</h1>
  <button>다크모드 켜기</button>
</header>
```

`<nav>` - **사이트의 지도**  
- 의미: 현재 페이지 내, 또는 다른 페이지로 이동하는 주요 링크들의 집합.
- 주의할 점: 모든 링크(`<a>` 태그)를 nav로 감쌀 필요는 없다. **메인 메뉴, 목차, 페이지네이션**과 같이 중요한 네비게이션에만 사용해야 한다.

```HTML
<!-- 메인 메뉴 -->
<nav>
  <ul>
    <li><a href="/">홈</a></li>
    <li><a href="/about">소개</a></li>
    <li><a href="/posts">글 목록</a></li>
  </ul>
</nav>
```

`<footer>` - **사이트의 꼬리말**  
- 의미: 가장 가까운 구획(`<body>` 혹은 `<article>`)의 작성자 정보, 저작권, 관련 문서 링크 등을 담는다.
- 위치: 보통 페이지의 가장 하단에 위치한다.

```html
<!-- 사이트 푸터 -->
<footer>
  <p>© 2024 OO의 블로그. All rights reserved.</p>
  <address>Contact: email@example.com</address>
</footer>
```

### 3. 실전 예제: 블로그 레이아웃 짜보기
지금까지 배운 내용을 모두 합치면 의미있는(Semantic) 웹 구조가 생성된다. `<div>` 떡칠로부터 벗어나자!
```html
<!DOCTYPE html>
<html lang="ko">
<body>
    <!-- 1. header: 로고와 메인 메뉴 -->
    <header>
        <h1>DevLog</h1>
        <nav>
            <ul>
                <li><a href="/home">Home</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    </header>

    <!-- 2. main: 실제 본문 내용 -->
    <main>
        <!-- 3. section: 최근 글 목록 -->
        <section>
            <h2>최신 글</h2>
            <!-- 4. article: 독립적인 글 카드 -->
            <article>
                <h3>글 제목</h3>
                <p>글 내용...</p>
            </article>

            <h2>최신 글2</h2>
            <article>
                <h3>글 제목2</h3>
                <p>글 내용2...</p>
            </article>
        </section>
    </main>
    <!-- 5. footer: 저작권 정보 -->
    <footer>
        <p>Copyright 저작권 정보...</p>
    </footer>

</body>
</html>
```

### header와 footer는 페이지에 딱 하나만 써야하는가?
아니다. `<body>`의 header, footer가 될 수도 있지만, `<article>` 내부의 header/footer가 될 수도 있다!  
예를 들어, 블로그 글 하나(`article`) 안에서 제목과 날짜를 `<header>`로 감싸고, 태그와 댓글 링크를 `<footer>`로 감쌀 수도 있다.

<div class="flex items-center gap-2">
    <svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/> </svg>
    <span class="font-bold text-2xl">
        글 요약
    </span>
</div>

1. `<header>`: 간판(로고, 제목)
2. `<nav>`: 지도(메뉴, 목차)
3. `<footer>`: 꼬리말(카피라이트, 연락처)