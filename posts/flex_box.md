---
title: "flex 박스 레이아웃 속성에 대해서 알아보자"
date: "2026-01-04 20:06:55"
category: "CSS"
description: "플렉스 박스 레이아웃 속 웹 요소의 크기를 쉽게 바꾸는 방법에 대해서 알아보자"
---

## 플렉스 박스 속성
플렉스 박스 레이아웃의 공칙 명칭은 <b>플렉서블 박스 레이아웃(flexible box layout)</b>이다.
화면 크기가 달라지면 그에 맞춰 플렉스 항목을 늘리거나 줄일 수 있는 유연한 상자라는 의미이다.
항목마다 크기를 조절하기 위해선 아래 4가지 속성을 플렉스 항목에 사용해야 한다.

<table>
    <caption>플렉스 박스 레이아웃의 속성</caption>
    <thead>
        <tr>
            <th>속성</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>flex-basis</b></td>
            <td>플렉스 항목의 기본 크기를 지정한다.</td>
        </tr>
        <tr>
            <td><b>flex-grow</b></td>
            <td>공간이 남으면 플렉스 항목을 늘린다.</td>
        </tr>
        <tr>
            <td><b>flex-shrink</b></td>
            <td>공간이 부족하면 플렉스 항목을 줄인다.</td>
        </tr>
        <tr>
            <td><b>flex</b></td>
            <td>flex-basis, flex-grow, flex-shrink의 속성을 한꺼번에 지정한다.</td>
        </tr>
    </tbody>
</table>

### 기본 크기를 지정하는 flex-basis
`flex-basis` 속성은 플렉스 항목의 기본 크기를 지정한다. 플렉스 항목을 가로로 배치한다면(flex-direction: row) 이 값은
플렉스 항목의 너비이고, 세로로 배치하면(flex-direction: column) 높이가 된다.

`flex-basis` 속성의 기본값은 `auto`인데 이 값은 플렉스 항목에 `width` 속성이 지정되어 있다면 그 값을 `flex-basis` 값으로
사용한다. 만일 `width` 값이 없다면 콘텐츠 영역만큼만 크기를 차지한다. 세로로 배치할 경우에는 `height` 값을 사용하고,
`height` 값이 없다면 역시 콘텐츠 영역만큼 크기를 차지한다.

`flex-basis` 속성에서 정확한 크기를 지정할 때는 pixel이나 %,vw 등 다양한 단위를 사용할 수 있다.

### 플렉스 항목을 확장하는 flex-grow 속성
화면 너비가 큰 환경에서 접속할 경우 플렉스 컨테이너에 플렉스 항목을 채우고도 남는 공간이 생긴다.
이때 남은 공간을 어떻게 나눌지는 `flex-grow` 속성이 지정한다.

`flex-grow`의 기본값은 $0$이다. 확장을 하지 않는다는 의미이고 음숫값은 사용할 수 없다.

### 플렉스 항목을 축소하는 flex-shrink 속성
플렉스 컨테이너의 너비가 줄어들 경우 그 안에 있는 플렉스 항목의 너비도 자연스럽게 줄어들도록 설정할 수 있는데, 이때
`flex-shrink` 속성을 사용한다. `flex-shrink`의 기본값은 1이다. 1은 컨테이너에 맞춰 플렉스 항목을 축소한다.
0으로 지정하면 플렉스 항목을 축소하지 않는다.

### 확장,축소를 한꺼번에 지정하는 flex 속성
`flex` 속성은 `flex-grow`와 `flex-shrink`, `flex-basis` 속성을 한꺼번에 줄여서 표현할 때 사용한다. 이 3개의 속성값을
지정할 때는 `flex-grow`, `flex-shrink`, `flex-basis` 순서로 지정해야 하며 기본값은 각각 0, 1, auto이다.

#### flex: 숫자
`flex` 속성에 값으로 숫자 하나만 지정하면 `flex-grow`의 값으로 사용한다. 나머지 속성인 `flex-shrink`는 1,
`flex-basis`는 0의 값을 사용한다. `flex-basis`의 기본값은 `auto`지만 이때는 0의 값을 사용한다.
`flex-basis`의 값이 0이면 확장, 축소하는 상황에 따라 항목의 기본 크기가 결정된다.

`flex` 속성에 값이 2개라면 첫 번째 값은 `flex=grow`이고, 두 번째 값에 단위가 없다면 `flex-shrink`, 단위(px이나 %)가
있다면 `flex-basis`의 값이 된다.

```CSS
flex: 1; /* flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
flex: 2; /* flex-grow: 3, flex-shrink: 1, flex-basis: 0 */
flex: 0 1 auto; /* flex-grow: 0, flex-shrink: 1, flex-basis: auto */
flex: 1 300px; /* flex-grow: 1, flex-shrink: 1, flex-basis: 300px */
```

#### flex: none
`flex: none`으로 설정하면 플렉스 컨테이너 안에서 플렉스 항목이 확장하거나 축소되지 않는다. 크기는 미리 정해 놓은
`width`와 `height` 값을 사용하거나, 값이 없다면 내용의 크기에 따라 결정된다. (`flex: 0 0 auto`와 일치)
플렉스 박스 레이아웃에서 특정 부분만 확장,축소하지 않도록 만들 때 이 값을 사용한다.

#### flex: auto
`flex: auto`로 지정하면 플렉스 항목의 크기를 `auto`로 설정한다. 플렉스 항목에 `width`나 `height` 값이 있다면
그 값을 크기로 사용하고, 값이 없다면 내용만큼 영역을 차지한다. 그리고 `flex-grow`와 `flex-shrink`는 각각 1로 설정한다.
공간이 남는다면 모든 플렉스 항목을 똑같은 비율로 확장하고, 공간이 부족하면 모든 플렉스 항목을 똑같은 비율로 축소한다.
(`flex: 1 1 auto`)

---
<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800 dark:text-gray-200" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>

- **플렉서블 박스(Flexible Box)**: 화면 크기에 따라 아이템의 크기를 유연하게 늘리거나 줄일 수 있는 레이아웃 방식임.
- **`flex-basis` (기본 크기)**: 아이템의 초기 크기를 지정함. 주축 방향에 따라 너비(`row`) 또는 높이(`column`)가 되며, 기본값은 `auto`(콘텐츠 크기)임.
- **`flex-grow` (확장)**: 남는 공간이 있을 때 아이템을 얼마나 늘릴지 결정함. 기본값은 `0`으로 늘어나지 않음.
- **`flex-shrink` (축소)**: 공간이 부족할 때 아이템을 얼마나 줄일지 결정함. 기본값은 `1`로 공간에 맞춰 축소됨.
- **`flex` (단축 속성)**: `grow`, `shrink`, `basis`를 한 번에 설정하는 속성임. (순서: `grow` → `shrink` → `basis`)
    - **`flex: 숫자`**: `flex-grow` 값을 설정하며, `basis`는 `0`이 됨. (예: `flex: 1`)
    - **`flex: none`**: 아이템의 크기를 고정하여 늘어나거나 줄어들지 않음. (`0 0 auto`)
    - **`flex: auto`**: 초기 크기를 기준으로 여백에 따라 자유롭게 늘어나거나 줄어듦. (`1 1 auto`)