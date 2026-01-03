---
title: "미디어 쿼리에 대해서 알아보자"
date: "2026-01-03 14:50:00"
category: "CSS"
description: "사이트에 접근하는 기기의 해상도에 맞춰 다른 스타일 시트를 제공하는 미디어 쿼리에 대해 알아보자."
---

## 미디어 쿼리 (Media Query)
CSS 모듈인 미디어 쿼리는 사이트에 접속하는 디바이스에 따라 특정한 CSS 스타일을 사용하는 방법이다.
미디어 쿼리를 사용하면 <b>접속하는 디바이스의 화면 크기에 따라 레이아웃</b>이 달라진다.

저번에 학습했던 <a class="plink" href="https://vorschlag-blog.vercel.app/posts/reactive">반응형 웹</a>에서 본 velog의 예시를 다시 한 번 보자.

<figure>
    <img src="/images/vel1.png" alt="PC에서 보는 Velog 화면 예시">
    <figcaption>PC 화면에선 여백의 미가 크다. 태그 목록이 좌측에 배치된 것이 특징이다.</figcaption>
</figure>

<figure>
    <img src="/images/vel2.png" alt="모바일에서 보는 Velog 화면 예시">
    <figcaption>반면 모바일 화면에선 더 아기자기하고 화면이 꽉 차있다. 태그 목록이 글 목록의 위로 배치된 것이 특징이다.</figcaption>
</figure>

이렇게 사용자가 어떤 미디어를 사용하는가에 따라서 사이트의 형태가 바뀌도록 CSS를 작성하는 방법을 미디어 쿼리라고 한다.
미디어 쿼리는 다양한 기기와 화면 크기에 대응해 웹 사이트를 더 효과적으로 표현할 수 있도록 해준다.

Velog처럼 사이드에 배치됐던 태그 목록이 헤더와 가깝게 위에 배치되게 만들 수 있고, 접속한 기기에 따라 필요한 스타일만 적용시켜 로딩 시간을 줄일 수도 있다.

### 미디어 쿼리 구문
미디어 쿼리는 `@media` 속성을 사용해 특정 미디어에서 어떤 CSS를 적용할 것인지를 지정할 수 있다. 
```CSS
@media [only || not] 미디어 유형 [and 조건문] * [and 조건문]
```

- 1. `only`: 미디어 쿼리를 지원하지 않는 웹 브라우저에서는 미디어 쿼리르 무시하고 실행하지 않음.
- 2. `not`: `not` 다음에 지정하는 미디어 유형을 제외한다. 예를 들어 `not tv`라고 지정 시, tv를 제외한 미디어 유형에만 적용.
- 3. `and`: 조건을 여러 개 연결 해 추가 가능.

미디어 쿼리 구문은 `<style>` 태그 사이에 사용하며 대소문자를 구분하지 않는다. 기본적으로 미디어 유형을 지정하고 필요할 경우에는
`and` 연산자로 조건을 적용한다. 예를 들어 다음 코드는 미디어 유형이 `screen`이면서 최소 너비가 786px이고 최대 너비는 1500px인 경우에
CSS를 적용하는 구문이다.

```CSS
@media screen and (min-width: 786px) and (max-width: 1500px) { ...생략 }
```

### 미디어 유형의 종류
미디어 쿼리는 미디어별로 적용할 CSS를 따로 작성하므로 `@media` 속성 다음에 미디어 유형을 알려 줘야 한다.
아래는 `@media` 속성의 미디어 유형을 정리한 표이다.

<table>
    <caption>@media 속성의 미디어 유형</caption>
    <thead>
        <tr>
            <th>미디어 유형</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>all</b></td>
            <td>모든 미디어 유형에서 사용할 CSS를 정의. 기본값</td>
        </tr>
        <tr>
            <td><b>print</b></td>
            <td>인쇄 장치에서 사용할 CSS를 정의.</td>
        </tr>
        <tr>
            <td><b>screen</b></td>
            <td>컴퓨터 스크린에서 사용할 CSS를 정의.</td>
        </tr>
        <tr>
            <td><b>tv</b></td>
            <td>tv에서 사용할 CSS를 정의.</td>
        </tr>
        <tr>
            <td><b>aural</b></td>
            <td>음성 합성 장치(화면을 읽어 소리로 출력 해주는 장치)에서 사용할 CSS를 정의.</td>
        </tr>
        <tr>
            <td><b>braille</b></td>
            <td>점자 표시 장치에서 사용할 CSS를 정의.</td>
        </tr>
        <tr>
            <td><b>handheld</b></td>
            <td>패드처럼 손에서 들고 다니는 장치를 위한 CSS를 정의.</td>
        </tr>
        <tr>
            <td><b>projection</b></td>
            <td>프로젝터를 위한 CSS를 정의</td>
        </tr>
        <tr>
            <td><b>tty</b></td>
            <td>디스플레이 기능이 제한된 장치에 맞는 cSS를 정의. 이런 장치에선 px단위 사용 불가</td>
        </tr>
        <tr>
            <td><b>embossed</b></td>
            <td>점자 프린터에서 사용할 CSS를 정의</td>
        </tr>
    </tbody>
</table>

화면용 스타일과 인쇄용 스타일을 따로 만든다면 아래와 같은 미디어 쿼리를 지정하면 된다.
```CSS
@media screen { /* 화면용 스타일 */ }
@media print { /* 인쇄용 스타일 */ }
```

----

### 웹 문서의 가로 너비와 세로 높이 속성
실제 웹 문서 내용이 화면에 나타나는 영역을 뷰포트라고 한다. 뷰포트의 가로 너비와 세로 높이를 미디어 쿼리의 조건으로 사용할 수 있다.
이때 높이는 미디어에 따라 다양하므로 주의해야 한다.

아래 표는 웹문서의 가로 너비와 세로 높이를 지정할 때 사용하는 속성을 정리한 표이다.
<table>
    <caption>웹 문서의 가로 세로 속성</caption>
    <thead>
        <tr>
            <th>속성</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>width, height</td>
            <td>웹 페이지의 가로 너비, 세로 높이를 지정.</td>
        </tr>
        <tr>
            <td>min-width, min-height</td>
            <td>웹 페이지의 최소 가로 너비, 최소 세로 높이를 지정.</td>
        </tr>
        <tr>
            <td>max-width, max-height</td>
            <td>웹 페이지의 최대 가로 너비, 최대 세로 높이를 지정.</td>
        </tr>
    </tbody>
</table>

---

### 화면 회전 속성
스마트폰이나 테블릿에선 화면을 세로로 볼 수도 있고, 가로로도 볼 수가 있다. 미디어 쿼리에선 `orientation` 속성을 사용하면 기기의 방향을 확인할 수 있고,
그에 따라서 웹 사이트의 레아아웃을 바꿀 수 있다. `orientation` 속성값으로는 `portrait`와 `landscape`가 있다. 가로 모드는 기본값이 `landscape`이고,
세로 모드는 `portrait`가 기본값이다.

<table>
    <caption>화면 회전 속성</caption>
    <thead>
        <tr>
            <th>속성</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>orientatoin: portrait</td>
            <td>단말기의 세로 모드를 지정.</td>
        </tr>
        <tr>
            <td>orientation: landscape</td>
            <td>단말기의 가로 모드를 지정. 기본값</td>
        </tr>
    </tbody>
</table>

---

### 미디어 쿼리 중단점
미디어 쿼리를 작성할 때 화면 크기에 따라 서로 다른 CSS를 적용할 분기점을 <b>중단점(break point)</b>이라고 한다.
이 중단점을 어떻게 지정하느냐에 따라 CSS가 달라지고 화면 레이아웃이 바뀌는데, 대부분 기기의 화면 크기를 기준으로 한다.
하지만 시중에 나온 모든 기기를 반영하는 것은 불가능하므로, 보통 모바일,pc,테블릿 정도로만 구분한다.

처리 속도나 화면 크기 등에서 다른 기기보다 모바일의 제약 조건이 더 많으므로 파일의 레이아웃을 기본으로 하여 CSS를 만든다
(모바일용 CSS는 태블릿과 데스크톱에도 기본으로 적용됌). 그러고 나서 사용이 더 좋고, 화면이 큰 태블릿과 데스크톱에 맞춰
많은 기능과 스타일을 추가하면 된다. 이렇게 모바일을 먼저 고려해 미디어 쿼리를 작성하는 방법을 <b>모바일 퍼스트(mobile first)</b> 기법이라고
한다.

미디어 쿼리를 작성할 때 주어진 조건에 따라 다양한 중단점을 만들 수 있으나 크게 모바일(스마트폰), 태블릿, PC로 구분된다.

- <b>스마트폰</b>: 모바일 페이지는 미디어 쿼리를 사용하지 않고 기본 CSS로 작성한다. 만약 스마트폰의 방향까지 고려해 제작하면 `min-width`의 세로와 가로를
    각각 `portrait 320px, landscape 480px`로 지정한다.
- <b>태블릿</b>: 세로 높이가 768px 이상이면 태블릿으로 지정한다. 가로 너비는 데스크톱과 같이 1024px 이상으로 지정한다.
- <b>PC</b>: 화면 크기가 1024px 이상이면 PC로 지정한다.

---

## 미디어 쿼리 적용
미디어 쿼리는 크게 <b>외부 CSS 파일로 연결하는 방법</b>과 <b>웹 문서에 직접 작성하는 방법</b>이 있다.

### 외부 CSS 파일 연결
외부 CSS 파일을 따로 저장해 웹 문서에 연결하는 방법은 조건별로 CSS 파일을 따로 작성한 뒤 `<link>` 태그나 `@import` 문을 사용해 연결한다.
외부 CSS 파일을 연결할 때 가장 많이 사용하는 `<link>` 태그는 `<head>`와 `</head>`사이에 작성한다.
```HTML
<!-- link 태그 작성 예시 -->
 <link rel="style" media="미디어 쿼리 조건" href="css 파일 경로" >
```
위 코드는 미디어 쿼리 조건이 맞는다면 css 파일 경로에 있는 css 파일을 적용하라는 의미다.

외부 CSS 파일을 연결하는 방법으로는 `<link>` 태그 대신 `@import` 문을 사용해도 된다.
`@import` 문은 CSS를 정의하는 `<style>` 태그 사이에 작성한다.
```HTML
<style>
    @media url("/css 파일 경로") [미디어 쿼리 조건문들]
</style>
```
---

### 웹 문서에 직접 정의
웹 문에서 미디어 쿼리를 직접 정의할 수도 있다. 직접 정의는 2가지 방식이 존재한다.
첫 번째로는 `<style>` 태그 안에 `media` 속성을 사용하고 조건을 지정 후, 조건에 맞는 슈타일 규칙을 작성하는 것이다.
```HTML
<style media="screen and (max-width: 480px)">
    body {
        /* css 내용들... */
    }
</style>
```
두 번째 방법은 스타일을 선언할 때 `@media` 문을 사용해 조건별로 스타일을 지정하고 그 중에서 선택해 적용하는 것이다.
```HTML
<style>
    @media screen and (max-width: 480px) {
        body {
            /* css 내용들 */
        }
    }
</style>
```

---

### 개발자 도구 창에서 미디어 쿼리 표시하기
웹 개발자 도구 창에는 반응형 사이트의 미디어 쿼리를 직접 확인해볼 수 있다. 여러 사이트들의 미디어 쿼리 구성과 코드를 직접 볼 수 있어서
미디어 쿼리 공부에 큰 도움이 될 것 같다.

<figure>
    <img src="/images/media_ex.png" alt="개발자 도구(F12)를 누르고 기기 툴바를 누른 뒤 ...버튼을 누르면 보임">
    <figcaption>개발자 도구에서 기기 툴바를 누른 뒤 ...버튼을 누르면 미디어 쿼리를 볼 수 있다.</figcaption>
</figure>

<figure>
    <img src="/images/media2.png" alt="너비에 따른 미디어 쿼리 크기가 나온다.">
    <figcaption>벨로그의 미디어 쿼리 모습을 볼 수 있다.</figcaption>
</figure>

[미디어 쿼리 표시]를 실행하면 현재 사이트의 CSS 코드를 분석해서 미디어 쿼리를 색상별로 구분해서 보여 줍니다. 사이트에 따라 미디어 쿼리 막대가 1개인 곳이 있고,
2개나 3개인 곳도 있다. 미디어 쿼리 막대의 색상은 아래와 같이 다른 의미를 갖고 있다.

- <b>파란색</b>: 최대 너비(max-width)를 기준으로 중단점을 나눈 미디어 쿼리를 나타낸다.
- <b>녹색</b>: 최소 너비(min-width)와 최대 너비를 기준으로 중단점을 나눈 미디어 쿼리를 나타낸다.
- <b>노란색</b>: 최소 너비(min-width)를 기준으로 중단점을 나눈 미디어 쿼리를 나타낸다.

<figure>
    <img src="/images/mquery.png" alt="[소스 코드에서 보기]를 통해 해당 미디어 쿼리가 정의된 CSS 파일 경로와 개수를 볼 수 있다.">
    <figcaption>[소스 코드에서 보기]를 통해 해당 미디어 쿼리가 정의된 CSS 파일 경로와 개수를 볼 수 있다.</figcaption>
</figure>

<figure>
    <img src="/images/vel.png" alt="미디어 쿼리 소스 코드 확인한 모습.">
    <figcaption>미디어 쿼리를 이렇게 직접 소스 코드까지 볼 수 있다.</figcaption>
</figure>

***

<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>

- **미디어 쿼리(Media Query)**: 접속하는 기기의 화면 크기나 특성에 따라 서로 다른 CSS 스타일을 적용하여 레이아웃을 최적화하는 기술임.
- **기본 구문**: `@media [미디어 유형] [and 조건]` 형태로 작성하며, `only`, `not`, `and` 연산자를 사용해 정교한 조건 설정이 가능함.
- **주요 속성**:
    - **미디어 유형**: `screen`(화면), `print`(인쇄) 등이 있으며 `all`이 기본값임.
    - **크기 조건**: `min-width`, `max-width` 등을 사용해 뷰포트의 너비/높이에 따라 스타일을 분기함.
    - **방향 조건**: `orientation` 속성으로 가로 모드(`landscape`)와 세로 모드(`portrait`)를 감지함.
- **중단점(Breakpoint)**: 레이아웃이 변경되는 기준점임. 보통 스마트폰, 태블릿, PC로 구분하며, 모바일 스타일을 먼저 작성하고 확장해 나가는 **모바일 퍼스트** 기법을 주로 사용함.
- **적용 방법**: `<link>` 태그나 `@import`를 통해 외부 파일을 연결하거나, 문서 내 `<style>` 태그 안에 `@media` 구문을 직접 작성하여 적용함.
- **개발자 도구 활용**: 브라우저 개발자 도구의 '기기 툴바'를 통해 사이트에 적용된 미디어 쿼리 구간을 시각적으로 확인하고 소스 코드를 분석할 수 있음.