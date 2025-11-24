---
title: "<div> 떡칠에서 벗어나기, 본문은 왜 꼭 <main>이어야 할까?"
date: "2025-11-24 13:37:50"
category: "HTML"
description: "main 태그와 div 태그의 차이점에 대해서 알아보자"
---

## <main\>태그와 <div\>태그의 결정적 차이점은 뭘까?
웹 개발을 처음 시작하는(마치 나 같은) 사람들은 `<div>`태그를 많이 사용한다.\
적당히 네모난 박스를 만들기에 만만하고 1줄을 통째로 차지하기 때문에\
 이곳 저곳에서 유용하게 써먹기 때문이다.

하지만 **화면 상 보이는 것**과 **브라우저(검색엔진)이 이해하는 것**은 다르다!\
오늘은 HTML에서 의미있는 태그(Semantic Tag)의 시작이자 핵심인 `<main>`에 대해서 파헤쳐 볼 것이다.

### 1. <main\>과 <div\>의 결정적인 차이
#### <div\> (= Division)의 특징
- 아무런 의미가 없다.(Non-Semantic)
- 단순히 구역을 나누거나, CSS스타일(Flexbox, Grid 등)을 입히기 위한 테두리(Wrapper)의 역할을 맡는다.
- 이는 마치 아무것도 안 적힌 택배 상자와 같다. 내용물을 까보기 전까진 뭐가 들어있는지 알 수가 없다.

#### <main\>의 특징
- 문서의 주요한 콘텐츠이다.(Main Content)
- 페이지에서 가장 핵심이 되는 내용(본문, 주요 기능 등)을 감싸는 역할을 맡는다.
- 대놓고 중요하다는 커버가 있는 상자와 같다. 누가봐도 매우 중요한 것이 들어있는지 알 수 있다.

### 2. 왜 <div\> 대신 <main\>을 써야만 할까?
일반 사용자 입장에서는 `<div>`로 감싸나 `<main>`으로 감싸나 겉보기엔 똑같다.\
하지만 **보이지 않는 곳**에서 결정적인 차이가 있다.
#### 이유 1: 접근성(Accessibility)
시각 장애인은 모니터를 통해서 화면을 보는 것이 아닌 **스크린 리더**를 통해서 화면을 **듣는다**.\
만약 `<div>` 태그만 사용할 경우 스크린 리더는 어디가 본문인지 알 수가 없게된다.\
따라서 사용자는 로고, Nav, header 등을 일일이 다 듣고 나서나 겨우 본문에 도달할 수 있게 될 것이다.\
더욱이 이걸 매 페이지마다 반복한다고 하면 피로감은 엄청날 것이다.

반면에 `<main>` 태그를 사용하면 스크린 리더는 **본문으로 바로 건너뛰기** 기능을 통해서 바로 본문을 찾아낸다.\
단 이 기능은 반드시 `<main>` 태그가 있을 때에만 동작한다.

#### 이유 2: 검색 엔진 최적화(SEO) - 구글봇
구글의 검색 로봇(크롤러)은 하루에만 수십억개의 페이지를 읽는다.\
만약 로봇이 찾은 웹사이트가 `<div>`로 떡칠이 되어 있다면 스크린 리더와 마찬가지로 sidebar, header, footer 등을 다 뒤지면서 시간을 낭비한다.

반면 `<main>`을 사용하면 스크린 리더와 마찬가지로 크롤링 봇에게 **이게 핵심**이라고 알려주는 가이드의 역할을 할 수 있다.

또한 이는 당연하게 검색 결과에 더 정확하게 노출될 확률을 올려주므로 나 같은 개인 블로거에게 있어서는 매우 중요하다!

### 3. 한 페이지에 반드시 1개만!
`<main>` 태그에는 아주 중요한 제약 조건이 있다.

> **한 HTML 문서(페이지) 안에는 보이는 `<main>` 태그가 단 하나만 존재해야 한다.**

생각해보면 당연하다 **본문**이란 글에 있어서 1개의 항목으로 존재해야하기 때문이다.\
따라서 아래와 같은 잘못된 예시들을 미리 방지해야 한다.
```HTML
<!-- main이 여러 개인 경우 -->
<body>
    <main>글 내용</main>
    <main>댓글</main>
</body>

<!--- main이 특정 태그(header, footer, nav 등)의 자식으로 들어가는 경우 -->
<header>
    <main>본문</main>
</header>
```
`<main>`은 부모는 일반적인 경우 `<body>` 태그이고 `<div>` 태그도 가능하다.

### 4. 코드로 비교해보기
일반적인 블로그 HTML을 구현한다고 가정해보자.\
흔한 안 좋은 예시는 `<div>` 태그만 떡칠하고 **id**나 **className** 따위를 사용해서 개발자만 알아볼 수 있도록 구분한 형태이다.
```HTML
<body>
  <div id="header">로고 및 메뉴</div>
  <!-- 브라우저: 여기가 본문인가? 그냥 박스인가? 몰라레후 -->
  <div class="content-wrapper">
      <h1>블로그 제목</h1>
      <p>블로그 내용...</p>
  </div>

  <div id="footer">저작권 정보</div>
</body>
```
좋은 예시는 Semantic(의미를 갖춘) 구조이다.
```HTML
<body>
    <header>로고 및 메뉴</header>
    <!-- 브라우저: 여기가 본문이구만! -->
    <main>
        <h1>글 제목</h1>
        <p>글 내용</p>
    </main>
    <footer>저작권 정보 등등</footer>
</body>
```

### 5. 내 블로그의 경우
내 블로그는 **Next.js**의 **App router** 구조를 사용 중이다.\
이 구조는 `src/app/layout.js`가 페이지의 전체 골격을 담당한다.\
특히 **RootLayout** 함수의 params인 **children**(페이지별 콘텐츠)를 감싸는 태그가\
 `<main>`여야 최적의 구조이다.
```javascript
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      {/** 중략.. */}
      <body className="">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* header 구현 정보 */}
          <header className="">
            <Link href="/" className="flex items-center gap-3 group">
              <h1 className="">
                헤더 정보
              </h1>
            </Link>
            <nav className="">
              {/** nav 구현 정보 */}
            </nav>
          </header>
          {/* children = 내가 만들 main 페이지 들어가는 곳 */}
          <main className="">
            {children}
          </main>
          <footer className="">
            footer 정보
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
```
이렇게 layout을 잡는다면, 앞으로 만드는 모든 페이지들이 자동으로 `<main>` 태그 내부로 들어가게 되며 **SEO**와 **접근성**을 모두 손쉽게 얻을 수 있게된다!

<div class="flex items-center gap-2">
    <svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/> </svg>
    <span class="font-bold text-2xl">
        글 요약
    </span>
</div>

1. `<div`는 의미가 없는 디자인용 박스다.
2. `<main>`은 페이지의 진짜 핵심 콘텐츠를 담는 그릇이다.
3. `<main>`을 쓰면 시각장애인이 본문으로 바로 점프할 수 있고, 구글이 내용을 더 잘 이해한다.
4. `<main>`은 한 페이지에 딱 한 번만 써야 하며, header나 footer 안에 넣으면 안 된다.
