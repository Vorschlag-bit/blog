---
title: "<section> vs <article>, 도대체 언제 뭘 써야할까?"
date: "2025-11-29 11:59:32"
category: "HTML"
description: "많이 헷갈리는 <section>과 <article>의 차이점에 대해서 알아보자"
---

## <section\>과 <article\>의 차이점은 뭘까?
이전에 `<div>` 떡칠 HTML에서 벗어나기 위해 `<main>`과 `<div>`의 차이점을 알아보았다.  
`<div>`가 아무 의미가 없는 박스라면, `<main>`은 **본문**이라는 중요한 의미를 갖고 있었다.

하지만 HTML 구조를 잡다보면 또 다른 난관에 봉착하곤 한다. 바로 **영역을 나눌 때 뭘 쓰지**라는 고민이다.
또 다시 `<div>`를 쓸지, `<section>`을 사용할지 아니면 `<article>`을 사용할지 고민을 자주하는 편이다.  
오늘은 특히 헷갈리는 `<section>`과 `<article>`의 **결정적 차이점**에 대해서 파헤쳐 보자.

### 1. 둘 다 구역을 나누는 거 아닌가?
HTML5에서 등장한 이 두 태그는 모두 `<div>`처럼 콘텐츠를 감싸는 역할을 수행하지만, **브라우저와 검색엔진**이
해석하는 의미는 완전히 다르다.

#### <section\>의 특징
- **주제별로 묶는 역할**을 한다.
- 서로 관련이 있는 컨텐츠들을 하나의 그룹으로 묶을 때 사용한다.
- 보통 내부에는 반드시 <strong>제목 태그(<h1\>~<h6\>)</strong>가 포함되어야 한다.(이 구역의 이름표 역할)
- 책을 치면 **'1장'**, **'2장'** 같은 챕터 구분에 가깝다.

#### <article\>의 특징
- **독립적인 콘텐츠**이다. (Self-contained)
- 이 부분만 따로 떼어내서 다른 곳에 옮겨놔도 **완벽하게 말이 되는 글**이어야 한다.
- 신문으로 치면 경제 섹션에 있는 <strong>개별 기사 하나</strong>에 가깝다.

### 2. 가장 쉬운 구분 방법: "독립성 테스트"
이 태그를 쓸지 말지를 고민된다면 하나의 질문을 던져보면 된다.
> "이 부분만 뚝 떼어내서 내 친구들에게 보낼 때, 완벽히 이해가 가는가?"

이해가 된다면 **독립적**이므로 `<article>`을 사용하자.(블로그 포스팅, 뉴스 기사, 댓글 하나 등)  
앞뒤의 문맥이 필요하다면(묶음이라면) `<section>`을 사용하자.(최신 글 목록, 회사 소개 등)

### 3. 코드로 비교해보기
이론만 보면 역시 잘 와닿지 않으므로, 실제 코드로 보자.  
안 좋은 예시는 역시 `<div>`로 떡칠된 의미 불명의 구조들이다.
```HTML
<div class="main-content">
  <div class="news-box"> <!-- section인지 article인지 모름 -->
    <h3>오늘의 뉴스</h3>
    <div class="news-item">뉴스 1...</div>
    <div class="news-item">뉴스 2...</div>
  </div>
</div>
```

좋은 예시는 의미를 갖춘(Semantic) 구조이다.
```HTML
<main>
  <!-- 뉴스라는 큰 주제를 묶었으므로 section -->
  <section class="news-section">
    <h2>오늘의 IT 뉴스</h2> <!-- section엔 제목이 있는 게 좋다 -->
    
    <!-- 뉴스 기사 하나하나는 독립적이므로 article -->
    <article>
      <h3>비트코인 급등, 이유는?</h3>
      <p>오늘 비트코인이...</p>
    </article>

    <article>
      <h3>HTML5 태그 정리</h3>
      <p>article 태그는...</p>
    </article>
  </section>
</main>
```
### 4. 내 블로그의 경우
내 블로그의 경우에는 `src/app/page.js`(메인 페이지)가 모든 블로그 글을 보는 것이기 때문에
**블로그 글**이라는 주제가 있어서 `<section>`을 부모 태그로 사용하고 블로그 글들은 `<ul>`, `<li>` 태그를
활용해 날짜 내림차순으로 블로그 글을 화면에 뿌렸다.

```javascript
export default function Home() {
    const allPostsData = getSortedPostsData();

    return (
    <div className="">
        <section>
          <h1 className="">
          <span className="">블로그 글 목록</span>
          </h1>
          {/** 중략... */}
          <ul className="">
            {allPostsData.map(({ id, title, date, description, category }) => (
              <li key={id}>
                {/** 블로그들 map 함수로 얻은 id,date,title 등을 뿌리는 로직 */}
              </li>
            ))}
          </ul>
        </section>
    </div>
    )
}
```
하지만 `<article>` 태그는 많이 활용하지 않았는데, 역시 SEO에게 더 좋은 점수를 받기 위해서라도
`src/app/[id]/post.js`의 본문을 `<article>` 태그로 감싸는 리팩토링을 수정해야겠다.  
언제나 의미를 갖춘 HTML 구조를 짜는 것이 프론트엔드에 있어서 정말 중요한 것 같다.

<div class="flex items-center gap-2">
    <svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/> </svg>
    <span class="font-bold text-2xl">
        글 요약
    </span>
</div>

1. `<section>`은 **주제별로 구역**을 나누고 싶을 때 쓰고, 제목(`<h2>`같은)이 필요하다.
2. `<article>`은 <strong>독립적인 글(기사, 포스트)</strong>일 때 쓴다. (혼자 둬도 말이 된다)
3. 블로그 글 목록은 클릭을 유도하는 리스트라 `<li>`가 적절하고, 상세 본문은 정보 그 자체라  
`<article>`이 적절하다.
4. 헷갈린다면 <strong>"이것만 떼서 다른 곳에 붙여도 되나?"</strong>만 생각하자. 가능하다면 `<article>`,  
아니면 `<section>`이다.