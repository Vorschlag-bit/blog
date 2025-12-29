---
title: "테두리(border) style 정리"
date: "2025-12-29 17:23:30"
category: "CSS"
description: "테두리와 관련된 스타일 속성을 정리한 글"
---

## 테두리(border) 속성 style 정리
박스 모델을 사용해서 웹 문서에 요소를 배치하려면 각 박스 모델의 크기와 여백, 테두리 스타일 등을 고려해야 한다.  
특히 테두리 스타일은 단순히 점선, 실선인지뿐만 아니라 테두리의 두께, 색상 등을 지정할 수도 있다. 또한 각 테두리에 대한
스타일링을 따로 지정할 수도 있고 모두 함께 지정할 수도 있다.

### 박스 모델의 방향
박스 모델은 상하좌우 4가지 방향이 있어서 테두리나 마진, 패딩 등을 지정할 때 한꺼번에 똑같이 지정할 수도 있고 모두 따로
지정할 수도 있다. 이때 박스 모델의 4개의 방향을 가리키는 예약어를 알아둬야 하는데, 위쪽은 <b>top</b>, 오른쪽은 <b>right</b>,
아래는 <b>bottom</b>, 왼쪽은 <b>left</b>이다. 속성값이 여러 개일 때는 맨 위부터 시작해서 <b>top->right->bottom->left</b>와 같이
시계 방향으로 적용된다는 걸 기억해두자.

---

### border-style
테두리 스타일일 지정하는 border-style 속성의 기본값은 `none`으로 속성값을 따로 지정하지 않으면 테두리 색상이나 두께를
지정하더라도 화면에 표시되지 않는다. 따라서 테두리를 사용하려면 가장 먼저 테두리 스타일을 지정해야 한다.

<table>
    <caption>width와 height 속성값</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>none</td>
            <td>테두리가 없음. 기본값</td>
        </tr>
        <tr>
            <td>solid</td>
            <td>테두리를 감춤. 표에서 border-collapse: collapse일 경우 다른 테두리도 표시되지 않음.</td>
        </tr>
        <tr>
            <td>dotted</td>
            <td>테두리를 점선으로 표시한다.</td>
        </tr>
        <tr>
            <td>dashed</td>
            <td>테두리를 짧은 직선으로 표시한다.</td>
        </tr>
        <tr>
            <td>double</td>
            <td>테두리를 이중선으로 표시한다. 두 선 사이의 간격이 border-width 값이 된다.</td>
        </tr>
        <tr>
            <td>groove</td>
            <td>테두리를 조각한 것처럼 표시한다. 홈이 파인 듯한 입체 느낌이 남.</td>
        </tr>
        <tr>
            <td>inset</td>
            <td>표에서 border-collapse: seperate일 경우 전체 박스 테두리가 차에 박혀 있는 것처럼 표시되고, border-collapse: collapse일 경우 ridge와 똑같이 표시.</td>
        </tr>
        <tr>
            <td>ridge</td>
            <td>테두리를 창에서 튀어나온 것처럼 표시.</td>
        </tr>
    </tbody>
</table>

만약 테두리 스타일을 4개 방향 모두 다르게 지정하고 싶다면 border-top-style, border-right-style, border-bottom-style, border-left-style처럼
border와 style 사이에 상하좌우 방향을 넣고 하이픈으로 연결하면 된다.

---

### border-width
테두리는 스타일과 마찬가지로 두께가 있어야만 화면에 나타난다. border-width 속성의 이름에서 알 수 있듯이 이 속성을 이용하면 테두리 두께를 지정할 수 있다.
테두리 두께를 지정할 때는 px을 사용해서 직접 크기를 지정할 수도 있고, `thin`, `medium`, `thick`과 같이 예약어 중에서 선택할 수도 있다.

```CSS
.box1 { border-width: thin thick; }
```
이렇게 박스 스타일의 속성이 2개라면 첫 번째 값인 `thin`은 위/아래(top,bottom) 테두리 값이 되고, 두 번째 값인 `thick`은 왼쪽/오른쪽(left,right)의 값이 된다.

```CSS
.box1 { border-width: thin thick thin; }
```
이렇게 박스 스타일의 속성이 3개라면 순서대로 <b>top->right->bottom</b>인데 마지막 left의 속성값이 빠져있는 상황이다. 이럴 경우엔 마주보고 있는 `right`의
속성값과 동일하게 적용된다.

---

### border-color
`border-color` 속성은 박스 모델에서 테두리 색상을 지정할 때 사용한다. `border-color` 속성을 사용해서 4개의 방향의 테두리 색상을 한꺼번에 지정할 수도 있고,
`border-top-color`처럼 `border`와 `color` 사이에 테두리 방향을 넣어서 색상을 하나씩 지정할 수도 있다.

```CSS
/* 전체 테두리 */
.box1 { border-color: red; }
/* 위쪽/아래쪽 테두리만 적용 */
.box1 { border-top-color: red; border-bottom-color: red; }
```

---

### 테두리 스타일을 묶어서 지정
각 속성을 따로 사용하면 테두리와 관련된 스타일 코드만 해도 아주 길어질 것이다. 그럴 땐 테두리 스타일과 두께, 색상을 한꺼번에 지정하는 방법을 사용하면 된다.  
4개의 방향 테두리 스타일을 다르게 지정하고 싶다면 `border-top`이나 `border-left`처럼 속성 이름에 방향만 함께 적으면 되고, 모두 적용하고 싶다면
간단히 `border` 속성만 사용하면 된다.

```CSS
/* 모든 테두리 3px 검은색 실선 */
p { border: 3px solid black; }
/* 아래쪽 테두리 3px 회색 점선 */
p { border-bottom: 3px dotted rbg(75, 70, 70); }
```

---

### border-radius
박스 모델에서 테두리를 표시하면 기본적으로 사각형이고 꼭짓점이 직각이다. 하지만 `border-radius` 속성을 사용하면 꼭짓점 부분이
원이 있는 것처럼 둥글게 처리된다. 이때 원의 반지름을 `radius` 속성을 이용하면 둥근 정도로 지정할 수 있다.

```CSS
.box1 { border-radius: 25px; }
```

`border-radius` 속성을 사용하면 이미지를 완전한 원의 형태로도 만들 수 있다. 이미지 요소의 너비와 높이를 똑같이 만든 후(정사각형)
`border-radius`의 반지름값을 너비나 높이의 50%로 지정하면 원이 된다.

```CSS
.circle { border-radius: 50%; }
```

---

### 꼭짓점마다 따로 둥글게 처리
박스 모델에서 꼭짓점 4개를 모두 다르게 지정하고 싶다면 border와 radius 사이에 위치를 나타내는 예악어를 넣으면 된다.  
예를 들어 왼쪽 윗부분 꼭지점이라면 `border-top-left-radius`라는 속성을 사용하면 되고, 오른쪽 아래 꼭지점이라면
`border-bottom-right-radius`라는 속성을 사용하면 된다.

---

<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800 dark:text-gray-200" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>


- **박스 모델의 방향**: 테두리, 마진, 패딩 등의 속성은 `top` → `right` → `bottom` → `left` (시계 방향) 순서로 적용됨.
- **`border-style`**: 테두리의 형태(실선, 점선 등)를 정의함. 기본값이 `none`이므로 이 속성을 지정해야만 테두리가 화면에 표시됨.
- **`border-width`**: 테두리의 두께를 설정함. `px` 같은 단위나 `thin`, `thick` 등의 키워드를 사용하며, 입력하는 값의 개수에 따라 상하좌우 적용 규칙이 달라짐.
- **`border-color`**: 테두리의 색상을 지정함. 4면을 통일하거나 방향별로 다르게 설정할 수 있음.
- **단축 속성 (`border`)**: 두께, 스타일, 색상을 한 줄에 묶어서 정의할 때 사용함. (예: `border: 3px solid black`)
- **`border-radius`**: 테두리의 모서리를 둥글게 처리함. 정사각형 요소에서 값을 `50%`로 설정하면 원형 이미지를 만들 수 있음.