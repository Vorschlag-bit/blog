---
title: "<input> 태그의 주요 속성"
date: "2025-12-21 19:22:08"
category: "HTML"
description: "<input> 태그의 최신 속성들에 대해서 알아보자."
---

## <input\> 태그의 주요 속성 정리
HTML 최신 버전에서는 단순히 내용을 입력하는 것뿐만 아니라 입력란에 커서나 힌트를 표시할 수도 있고, 반드시 입력해야 하는
필드를 지정할 수도 있다. 예전에는 이러한 기능들을 구현하기 위해 자바스크립트를 필수로 사용해야 했으나 지금은 아니라는 의미!

이 글은 이런 최신 속성들에 대해서 다루는 글이다.

### 1. 입력 커서를 자동으로 갖다놓는 autofocus 속성
<b>autofocus</b> 속성은 페이지를 불러오자마자 폼에서 원하는 요소에 입력 커서를 놓고 싶을 때 사용한다.  
```HTML
<input autofocus>
```
<label for="auto">자동 커서 예시: <input id="auto" autofocus style="border: 2px solid black"></label>

### 2. 힌트를 표시해주는 placeholder 속성
사용자가 텍스트를 입력할 때 적당한 힌트 내용을 표시해주고 그 필드를 클릭 시, 내용이 사라지도록 만들 때 사용하는 속성이다.
이렇게 하면 텍스트 필드 앞에 제목을 따로 붙이지 않더라도 해당 필드에 어떤 내용을 입력해야 하는지 알려 줄 수 있다.

<figure>
    <img src="/images/placeholder.png" alt="placeholder 예시(프로그래머스)" >
    <figcaption>프로그래머스 로그인 화면에서 이메일 입력 칸을 보면 <b>placeholder</b>인 걸 확인할 수 있다.</figcaption>
</figure>
placeholder를 사용하면 사용자가 어떤 것을 입력해야 할지 안내해주고, 실제 입력이 들어오면 자동으로 사라진다.

### 3. 읽기 전용 필드를 만들어주는 readonly 속성
<b>readonly</b> 속성은 해당 필드를 읽기 전용으로 만들어준다. 텍스트 필드나 텍스트 영역에 내용이 표시되어 있어도
사용자도 그 내용을 볼 수만 있고 입력할 수는 없다.

보통 상품을 고르고, 배송 정보 따위를 입력할 때 `<input>` 태그를 사용하되 선택한 상품 정보를 수정하지 못 하게 만들 때 사용한다.

readonly 속성은 `readonly`라고 작성만 하거나 `readonly="readonly"`, 또는 `readonly=true`라고 작성하면 된다.

### 4. 필수 입력 필드를 지정하는 required 속성
폼에 내용을 입력하고 submit 버튼을 눌러 서버에 데이터를 전송할 때, <b>필수 필드</b>들이 있는지 반드시 검증해야 하는 상황이 많을 것이다.
물론 이는 서버 측에서도 가능하지만 보통은 서버와 클라이언트 양측에서 꼼꼼하게 진행하니 클라이언트도 이런 기능을 구현해야 한다.

이렇게 반드시 입력해야 하는 내용에는 `required` 속성을 지정해 필수 필드로 만들 수 있다.  
이 속성을 사용하려면 `required`라고만 작성하거나 `required="required"`라고 작성하면 된다.

### 마무리
이 글에서 대룬 <code>&lt;input&gt;</code> 태그의 핵심 속성 4가지다. 과거에는 자바스크립트로 구현하던 기능들을 이제 HTML 속성만으로 간편하게 처리할 수 있다는 걸 잊지말자!

<div class="flex items-center gap-2">
    <svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/> </svg>
    <span class="font-bold text-2xl">
        글 요약
    </span>
</div>

1.  **`autofocus`**: 페이지가 열리자마자 해당 필드에 **자동으로 커서**를 위치시킴.
2.  **`placeholder`**: 필드 안에 연한 회색 글씨로 **입력 힌트**를 보여줌 (입력 시 사라짐).
3.  **`readonly`**: 사용자가 값을 볼 수만 있고 **수정은 불가능**하게 만듦 (읽기 전용).
4.  **`required`**: **필수 입력 필드**로 지정하여, 값을 채우지 않으면 폼 전송을 브라우저 단에서 막아줌.
