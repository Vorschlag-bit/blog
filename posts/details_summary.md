---
title: "<details> & <summary>: 자바스크립트 없이 토글 만들기"
date: "2025-12-18 17:08:35"
category: "HTML"
description: "자바스크립트 없이 토글을 만들 수 있는 details와 summary에 대해서 알아보자."
---

##  details & summary: 자바스크립트 없이 "접기/펼치기" 만들기
이전에 `<ul>`과 `<li>`를 통해서 정보를 <b>Grouping(구조화)</b>하는 방법을 익혔다.  
웹사이트에선 클릭 시 사용이 펼치고 다시 클릭하면 닫히는 기능(토글)을 만들 때 자바스크립트의 `onClick` 이벤트를 활용해 만드는 경우가 있다.  
하지만 이런 interactive한 기능을 HTML만으로 충분히 구현할 수 있다.

### 1. <details\>와 <summary\>란?
이 두 태그는 항상 세트로 사용된다.  
- `<details>`: 접기/펼치기 기능이 동작하는 <b>전체 영역(컨테이너)</b>이다. 기본적으로 안의 내용이 숨겨져 있다.
- `<summary>`: 화면에 보이는 <b>제목(버튼)</b> 역할을 한다. 이걸 클릭 시 숨겨진 내용이 나타난다.

#### 기본 구조
```HTML
<details>
  <summary>정답 보기 (클릭!)</summary>
  <p>짜잔!</p>
</details>
```
이런 식으로 작성하면 자동으로 제목 앞에 <b>작은 삼각형(▶)</b>을 붙여주고, 클릭 시 <b>방향이 바뀌며(▼)</b> 내용이 펼쳐지는 기능을 제공한다.

### 2. JS의 `div` + `onClick` 조합과의 차이점
자바스크립트의 `<div>` + `onClick()`를 통해서 이 기능을 똑같이 구현할 수 있다.  
`<div>`로 버튼을 만들고, CSS로 `display: none`을 준 다음에 js로 클래스를 토글하는 방식으로 구현하면 된다. 하지만 `<details>`를 써야 하는 확실한 이유들이 존재한다.

- 1. <b>검색 엔진 최적화(SEO)</b>
    - 구글 봇은 `display: none`으로 숨겨진 `<div>` 속 텍스트보다, `<details>` 태그 내부 속의 텍스트를 더 잘 긁어간다. 중요한 내용인데 잠시 가독성을 위해 숨겨둔 것이라고 판단하는 셈이다.
- 2. <b>웹 접근성(Web Accessibility)</b>
    - 스크린 리더는 `<summary>`를 만나면 <b>"버튼, 축소됨(또는 확장됨)"</b>이라고 명확히 알려준다.
    - 키보드(`Tab`,`Enter`,`Space`) 조작이 별도의 설정없이도 완벽하게 지원된다. `<div>` 태그로 이 기능을 만들려면 `aria-expanded=false`와 같이
    복잡한 속성을 개발자가 직접 붙여줘야 하는 번거로움이 있다.
- 3. <b>성능과 생산성 향상</b>
    - Js 코드를 로드하고 실행할 필요가 없으니 페이지가 훨씬 가볍고 빠르다. 개발 시간도 당연히 줄어든다.

### 3. 내 블로그 사용 예시
내 블로그 글 역시 토글을 만들 때 `<details>`를 통해서 만든다.  
대표적인 예시가 바로 <b>트러블 슈팅</b>이다.

```HTML
<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span className="text-red-400">제목을 입력하세요</span>
</summary>

내용을 입력하세요

</details>
```

<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span className="text-red-400">제목을 입력하세요</span>
</summary>

내용을 입력하세요

</details>


트러블 슈팅 토글을 만들 때, 내가 실제로 사용하는 형식이다. 자주 사용하기 때문에 VScode의 markdown Snippet에 `toggle`이라는 명령어로 만들어두었다.

### 4. 유용한 팁
만약 해당 토글을 페이지에 처음 들어왔을 때부터 열린 상태로 두고 싶다면, `<details>` 태그에 `open` 속성만 추가하면 된다.
```HTML
<!-- 이 항목은 페이지 로딩 시 이미 펼쳐져 있다. -->
<details open>
  <summary>공지사항 (필독)</summary>
  <p>이번 주 서버 점검 안내입니다.</p>
</details>
```
물론 자바스크립트로 제어할 때도 `class`를 건드리는 게 아니라, 이 `open` 속성을 넣는 방식(`element.setAttribute('open', '')`)이 훨씬 표준적이다.

### 5. 토글의 기본 모양(삼각형) 없애기
기본 삼각형(▶)이 디자인에 안 어울린다면 CSS로 없앨 수 있다.
내 블로그도 `global.css`를 통해서 적용시켜놨다. 내 블로그 글은 `md`를 HTML로 변환시키기 때문에 클래스가 없는 순수한 HTML 태그들로 변환된다.  
이때 tailwind의 `prose`를 통해서 분몬 내용 태그의 부모 태그에 클래스에 prose를 적용해 본문 내부의 HTML 태그에 한해서 css를 통일시켰다.

```css
.prose details {
    display: block;
    margin-bottom: 1rem;
    background-color: rgba(128, 128, 128, 0.05); /* 배경색 살짝 추가 */
    border: 2px solid currentColor; /* pixel 테두리 */
    padding: 0.5rem;
}

.prose summary {
    cursor: pointer;
    list-style: none;
    display: flex; 
    align-items: center;
    font-weight: bold;
    outline: none; /* 클릭 시 파란 테두리 제거 */
}
```

<div class="flex items-center gap-2">
    <svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/> </svg>
    <span class="font-bold text-2xl">
        글 요약
    </span>
</div>

1. `<details>` : 숨겨진 내용을 감싸는 박스.
2. `<summary>` : 클릭할 제목(버튼). 반드시 `<details>`의 첫번째 자식 태그여야 함.
3. 장점 : JS없이 토글 기능 가능. 웹 접근성 및 SEO 접근성 상승.
4. `open` 속성을 적어서 기본값으로 펼치게 만들 수도 있음.