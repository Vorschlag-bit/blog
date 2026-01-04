---
title: "플렉스(flex) 박스 레이아웃에 대해서 알아보자"
date: "2026-01-04 17:13:19"
category: "CSS"
description: "반응형 레이아웃을 만들기 위해 사용되는 방법 중 하나인 플렉스 박스에 대해서 알아보자"
---

## 플렉스(flex) 박스
반응형 레이아웃을 만들 때는 flex 박스 레이아웃을 사용하거나 CSS 그리드 레이아웃을 사용해야 한다.  
이 글은 그 중에서 flex 박스 레이아웃에 대해서 정리한 글.

flex 박스 레이아웃은 기본적으로 웹 요소를 <b>가로</b>로 배치하다가 화면에 가득찰 경우 아래로 내려
다시 옆으로 배치하는 방식이다. 즉 행렬처럼 배치를 한다. 이때 배치 방향을 세로로도 바꿀 수 있고, 정렬 방법 또한
지정할 수 있다. 그리고 이렇게 플렉스 박스로 배치된 요소들 사이의 간격 역시 조정할 수 있다.

### 플렉스 박스 레이아웃의 용어
<b>플렉스 박스 레이아웃(flex box layout)</b>은 등장한 지 얼마되지 않은 개념이라 새롭게 배워야할 용어들이 존재한다.

<figure>
    <img src="/images/flex_1.png" alt="flex 박스 레이아웃 구조 및 용어 설명하는 사진">
    <figcaption>플렉스 박스 레이아웃의 표준 규약은 W3 공식 홈페이지에서 더 자세히 알려준다.</figcaption>
</figure>

- <b class="text-red-400">플렉스 컨테이너(부모 박스)</b>: 플렉스 박스 레이아웃을 적용할 대상을 묶는 요소이다.
- <b class="text-orange-400">플렉스 항목(자식 박스)</b>: 플렉스 박스 레이아웃을 적용할 대상으로 1-6까지 작은 박스들이 모두 해당된다.
- <b class="text-green-400">주축(main axis)</b>: 플렉스 컨테이너 안에서 플렉스 항목을 배치하는 기본 방향이다. 기본적으로 왼쪽에서
오른쪽으로 수평 방향으로 배치한다. 플렉스 항목의 배치가 시작되는 위치를 '주축 시작점', 끝나는 위치를 '주축 끝점'이라고 한다.
- <b class="text-blue-400">교차축(cross axis)</b>: 주축으로 배치하다가 끝점까지 닿을 때 어떻게 배치할지 결정하는 속성이다.
기본적으로 위에서 아래로 배치한다. 플렉스 항목의 배치가 시작되는 위치를 '교차축 시작점', 끝나는 위치를 '교차축 끝점'이라고 한다.

플렉스 박스 레이아웃을 만드는 순서를 정리하면 아래와 같다.
1. CSS를 사용해 적용할 대상을 플렉스 컨테이너로 지정  
2. 플렉스 컨테이너 안에 플렉스 항목 작성  
3. CSS를 사용해 주축과 교차축 지정하기  
4. CSS를 사용해 교차축의 배치 지정

주축을 가로로 지정하면 교차축은 세로가 되고, 주축을 세로로 지정하면 교차축은 가로가 된다.

---

### 플렉스 컨테이너에서 사용하는 속성
플렉스 박스 레이아웃에는 플렉스 컨테이너에서 사용하는 속성과 컨테이너 안의 플렉스 항목에서 사용하는 속성이 있다.  
플레그 컨테이너의 주축에서 또는 교차축에서 요소를 어떻게 정렬하는지에 따라 플렉스 항목이 배치된다.

<table>
    <caption>플렉스 컨테이너 배치 관련 속성</caption>
    <thead>
        <tr>
            <th>속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>justify-content</b></td>
            <td>주축의 정렬 방법</td>
        </tr>
        <tr>
            <td><b>align-items</b></td>
            <td>교차축의 정렬 방법</td>
        </tr>
        <tr>
            <td><b>align-content</b></td>
            <td>교차축에 여러 줄로 표시할 때 사용하는 정렬 방법</td>
        </tr>
    </tbody>
</table>

컨테이너에서 지정한 정렬 방법은 플렉스 항목 전체에 똑같이 적용된다. 이때 플렉스 항목에서 특정 항목만
다르게 배치하고 싶다면 `align-self` 속성을 사용해서 별도로 정렬할 수 있다.

---

#### 플렉스 컨테이너를 지정하는 display 속성
플렉스 박스 레이아웃을 만드려면 먼저 배치할 요쇼를 플렉스 컨테이너로 묶어야 한다. 즉, 배치할 웹 요소가 있다면 그 요소를 감싸는
부모 요소를 만들고, 그 부모 요소를 플렉스 컨테이너로 만들어야 한다. 특정 요소가 플렉스 컨테이너로 동작하려면 `display` 속성을
통해 플렉스 박스 레이아웃을 적용하겠다고 지정해야 한다.

아래는 플렉스 컨테이너를 지정하는 `display` 속성값을 정리한 표이다.

<table>
    <caption>display 속성값</caption>
    <thead>
        <tr>
            <th>속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>flex</b></td>
            <td>플렉스 컨테이너를 블록 레벨로 만든다.</td>
        </tr>
        <tr>
            <td><b>inline-flex</b></td>
            <td>플렉스 컨테이너를 인라인 레벨로 만든다.</td>
        </tr>
    </tbody>
</table>

---

#### 플렉스 방향을 지정하는 flex-direction 속성
플렉스 컨테이너의 주축과 방향을 지정하는 속성이다. 아래는 사용할 수 있는 속성을 표로 정리했다.

<table>
    <caption>flex-direction 속성값</caption>
    <thead>
        <tr>
            <th>속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>row</b></td>
            <td>주축을 가로로 지정하고 왼쪽에서 오른쪽으로 정렬한다. 기본값</td>
        </tr>
        <tr>
            <td><b>row-reverse</b></td>
            <td>주축을 가로로 지정하고 오른쪽에서 왼쪽으로 정렬한다.</td>
        </tr>
        <tr>
            <td><b>column</b></td>
            <td>주축을 세로로 지정하고 위쪽에서 아래쪽으로 정렬한다.</td>
        </tr>
        <tr>
            <td><b>column-reverse</b></td>
            <td>주축을 세로로 지정하고 아래쪽에서 위쪽으로 정렬한다.</td>
        </tr>
    </tbody>
</table>

---

#### 플렉스 항목의 줄을 바꾸는 flex-wrap 속성
`flex-wrap` 속성은 플렉스 컨테이너 너비보다 플렉스 항목이 많은 경우 줄을 바꿀지 여부를 지정한다.
속성값으로 `wrap`이나 `wrap-reverse`로 지정한 후 웹 브라우저 화면의 너비를 늘리거나 줄여 보면 컨테이너의 너비에 따라서
줄이 여러 개로 표시되는 걸 볼 수 있다.

아래는 `flex-wrap`에서 사용할 수 있는 속성값을 표로 정리했다.

<table>
    <caption>flex-wrap 속성값</caption>
    <thead>
        <tr>
            <th>속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>nowrap</b></td>
            <td>플렉스 항목을 한 줄로 표시한다. 기본값</td>
        </tr>
        <tr>
            <td><b>wrap</b></td>
            <td>플렉스 항목을 여러 줄로 표시한다.</td>
        </tr>
        <tr>
            <td><b>wrap-reverse</b></td>
            <td>플렉스 항목을 여러 줄로 표사하되, 교차축의 시작점과 끝점이 바뀐다.</td>
        </tr>
    </tbody>
</table>

#### 배치 방향과 줄 바꿈을 한꺼번에 지정하는 flex-flow 속성
`flex-flow` 속성은 `flex-direction` 속성과 `flex-wrap` 속성을 한꺼번에 지정한다. 기본 속성은 `row nowrap`이다.
```HTML
<style>
    #f1 { flex-flow: row wrap } /* 왼쪽에서 오른쪽, 여러 줄 */
    #f2 { flex-flow: row nowrap } /* 왼쪽에서 오른쪽, 한 줄 */
</style>
```

---

#### 주축 정렬 방법을 지정하는 justify-content 속성
`justify-content` 속성은 주축에서 플렉스 항목 간의 정렬 방법을 지정하는 속성이다.

아래는 `justify-content` 속성에서 사용할 수 있는 속성값을 정리한 표이다.

<table>
    <caption>justify-content 속성값</caption>
    <thead>
        <tr>
            <th>속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>flex-start</b></td>
            <td>주축의 시작점에 맞춰 정렬한다. 기본값</td>
        </tr>
        <tr>
            <td><b>flex-end</b></td>
            <td>주축의 끝점에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>center</b></td>
            <td>주축의 중앙에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>space-around</b></td>
            <td>항목을 고르게 정렬한다. 각 항목은 양쪽 여백의 절반만큼 자리를 차지한다.</td>
        </tr>
        <tr>
            <td><b>space-between</b></td>
            <td>첫 번째 항목은 주축 시작점에, 마지막 항목은 주축 끝점에 배치한 후 나머지 항목은 같은 간격으로 정렬한다.</td>
        </tr>
        <tr>
            <td><b>space-evenly</b></td>
            <td>항목을 고르게 정렬한다. 각 항목의 여백은 모두 동일</td>
        </tr>
    </tbody>
</table>

---

#### 교차축 정렬 방법을 지정하는 align-items 속성
`justify-content` 속성이 주축에서 항목을 정렬하는 방법이라면, `align-items` 속성은 교차축의 정렬 방법을 지정한다.  
아래 표는 `align-items` 속성값을 표로 정리한 것이다.

<table>
    <caption>align-items 속성값</caption>
    <thead>
        <tr>
            <th>속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>flex-start</b></td>
            <td>교차축의 시작점에 맞춰 정렬한다. 기본값</td>
        </tr>
        <tr>
            <td><b>flex-end</b></td>
            <td>교차축의 끝점에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>center</b></td>
            <td>교차축의 중앙에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>baseline</b></td>
            <td>교차축의 문자 기준선에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>stretch</b></td>
            <td>플렉스 항목을 늘려 교차축에 가득 차게 정렬한다. 기본값</td>
        </tr>
    </tbody>
</table>

---

#### 특정 항목만 정렬 방법을 지정하는 align-self 속성
`align-self` 속성은 특정 플렉스 항목만 정렬 방법을 지정할 때 사용한다.  
아래 표는 `align-self` 속성값을 표로 정리한 것이다.

<table>
    <caption>align-self 속성값</caption>
    <thead>
        <tr>
            <th>속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>auto</b></td>
            <td>부모 요소의 align-items 값을 사용해 정렬한다. 기본값</td>
        </tr>
        <tr>
            <td><b>normal</b></td>
            <td>레이아웃 형태나 사용하는 브라우저에 따라 다르게 정렬한다.</td>
        </tr>
        <tr>
            <td><b>flex-start</b></td>
            <td>플렉스 컨테이너의 시작점에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>flex-end</b></td>
            <td>플렉스 컨테이너의 끝점에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>self-start</b></td>
            <td>플렉스 항목의 시작 위치에 맞춰 정렬한다. 텍스트를 포함하고 있을 경우 언어의 방향에 따라 시작 위치 결정</td>
        </tr>
        <tr>
            <td><b>self-end</b></td>
            <td>플렉스 항목의 끝 위치에 맞춰 정렬한다. 텍스트를 포함하고 있을 경우 언어의 방향에 따라 끝 위치 결정</td>
        </tr>
        <tr>
            <td><b>baseline</b></td>
            <td>플렉스 항목의 텍스트 기준선에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>center</b></td>
            <td>플렉스 컨테이너의 중앙에 정렬한다.</td>
        </tr>
        <tr>
            <td><b>stretch</b></td>
            <td>플렉스 컨테이너의 높이에 가득 차게 늘려서 정렬한다.</td>
        </tr>
    </tbody>
</table>

---

#### 여러 줄일 때 교차축 정렬 방법을 지정하는 align-content 속성
주축에서 줄 바꿈이 생겨서 플렉스 항목을 여러 줄로 표시할 때 `align-content` 속성을 사용하면 교차축에서
플렉스 항목의 정렬 방법을 지정한다.

<table>
    <caption>align-content 속성값</caption>
    <thead>
        <tr>
            <th>속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>flex-start</b></td>
            <td>교차축의 시작점에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>flex-end</b></td>
            <td>교차축의 끝점에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>center</b></td>
            <td>교차축의 중앙에 맞춰 정렬한다.</td>
        </tr>
        <tr>
            <td><b>space-between</b></td>
            <td>첫 번째 항목과 끝 항목을 교차축의 시작점과 끝점에 맞추고 나머지 항목은 그 사이에 같은 가격으로 정렬</td>
        </tr>
        <tr>
            <td><b>space-around</b></td>
            <td>모든 항목을 교차축에 같은 간격으로 정렬한다.</td>
        </tr>
        <tr>
            <td><b>stretch</b></td>
            <td>플렉스 항목을 늘려서 교차축에 가득 차게 정렬한다. 기본값</td>
        </tr>
    </tbody>
</table>

---

#### 플렉스 레이아웃을 활용해 중앙 표시
플렉스 박스를 사용하면 중앙에 배치하는 방법이 아주 쉽고 다양하게 가능하다. 부모 요소를 플렉스 컨테이너로 만들고
플렉스 컨테이너에서 주축과 교차축의 정렬 방법을 `center`로 정렬하면 된다. 이때 플렉스 컨테이너의 높이는 내용만큼만
인식하므로 화면 중앙에 배치하려면 플렉스 컨테이너의 높이를 뷰포트 높이로 지정해야 한다. 따라서 최소 높이를 뷰포트 높이의
전체로 지정해야 한다.

```HTML
<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh; /* 브라우저 높이의 100% */
    }
</style>
```

---

#### 플렉스 항목 간 여백을 두는 gap 속성
플렉스 컨테이너 안에 있는 여러 클래스 항목의 간격을 조절할 때 gap 속성을 사용한다. 이 속성은 플렉스 컨테이너에 적용하므로
컨테이너 안에 있는 모든 항목에 동일하게 적용된다. 이때 세로 간격을 조절하고 싶다면 `row-gap`, 가로 간격을 조절하고 싶다면
`col-gap`으로 값을 따로 지정할 수 있다.

---

<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800 dark:text-gray-200" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>


- **플렉스 박스(Flex Box)**: 반응형 레이아웃을 위해 요소를 가로(행)나 세로(열)로 유연하게 배치하는 1차원 레이아웃 방식임.
- **핵심 용어**:
    - **플렉스 컨테이너(부모)** & **플렉스 항목(자식)**: 레이아웃을 적용할 전체 영역과 그 내부 요소들.
    - **주축(Main Axis)**: 아이템이 배치되는 기본 방향 (기본값: 가로/왼쪽→오른쪽).
    - **교차축(Cross Axis)**: 주축과 수직이 되는 방향 (기본값: 세로/위→아래).
- **컨테이너 주요 속성**:
    - `display`: `flex`나 `inline-flex`로 컨테이너를 정의함.
    - `flex-direction`: 주축의 방향(가로/세로)을 결정함 (`row`, `column` 등).
    - `flex-wrap`: 항목이 한 줄을 넘어갈 때 줄 바꿈 여부를 결정함 (`nowrap`, `wrap`).
    - `justify-content`: **주축** 방향의 정렬 방식을 지정함 (가운데, 양끝 배분 등).
    - `align-items`: **교차축** 방향의 한 줄 정렬 방식을 지정함.
    - `align-content`: 항목이 **여러 줄**일 때 교차축 정렬 방식을 지정함.
- **항목 주요 속성**: `align-self`를 사용해 특정 항목만 교차축 정렬을 다르게 지정할 수 있음.
- **중앙 정렬 팁**: 부모 요소에 `justify-content: center`와 `align-items: center`를 조합하고 높이(`min-height: 100vh`)를 확보하면 화면 정중앙 배치가 매우 간편함.