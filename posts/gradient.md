---
title: "그라데이션 효과 알아보기"
date: "2025-12-31 23:48:46"
category: "CSS"
description: "그라데이션 효과를 이용해서 색다른 이미지를 연출해보자."
---

## 그라데이션 효과 알아보기
웹 문서의 배경을 꾸밀 때는 이미지나 배경색을 사용하는 것 외에도 그라데이션 효과를 통해 색다른 느낌을 줄 수 있다.

## 선형 그라데이션
선형 그라데이션이란 색상이 수직,수평 또는 대각선 방향으로 일정하게 변하는 걸 의미한다. 선형 그라데이션은 `linear-gradient` 함수를 통해서
생성된다. 이때 <b>색상이 어느 방향</b>으로 바뀌는지 그리고 어떤 색상으로 바뀌는지를 명시해야 한다.

```CSS
p { background: linear-gradient(to 방향, 시작색, 끝색) }
```

### 방향
그라데이션 방향을 지시할 때는 `to` 예약어와 함께 사용합니다. `to` 다음에는 끝나는 방향을 나타내는 예약어를 최대 2개까지 사용 가능하다.
이때 예약어는 수평 방향을 나타내는 `left`와 `right`, 수직 방향을 나타내는 `top`과 `bottom`을 사용한다.

예를 들어 색상이 왼쪽에서 오른쪽으로 변하는 그라데이션이라면 `to right`을, 왼쪽 아래에서 오른쪽 위로 변하는 그라데이션이라면 `to right top` 또는
`to top right`으로 사용하면 된다.

### 각도
각도는 선형 그라데이션에서 색상이 바뀌는 방향을 알려주는 방법이다. 이때 각도는 그라데이션이 끝나는 부분이고 값은 deg로 표기한다.

```HTML
<style>
    .grid { 
        background: #600;
        background: linear-gradient(45deg, #600, #666)
     }
</style>
```

### 색상 중지점
2가지 색 이상으로 선형 그라데이션을 만드려면 색상이 바뀌는 부분을 지정해 주어야 한다. 그라데이션에서 바뀌는 색을 색상 중지점이라고 한다.
색상 중지점을 지정할 때 쉼표로 지정하며 색상만 지정할 수도 있고 색상과 함께 중지점의 위치도 함께 지정할 수 있디.

```HTML
<style>
    .grid {
        background: #600;
        /* 순서대로 방향, 시작 색상, 중지점의 색상과 위치, 끝 색상 */
        background: linear-gradient(to right, #06f, white 30%, #06f);
    }
</style>
```

## 원형 그라데이션
선형 그라데이션이 색상이 직선 형태로 점점 바뀌는 효과라면, 원형 그라데이션은 원 또는 타원의 중심에서부터 동심원을 그리며 바깥 방향으로
색상이 바뀐다. 따라서 원형 그라데이션은 색상이 바뀌기 시작하는 원의 중심과 크기를 지정하고 그라데이션의 모양을 선택해야 한다.

### 모양
원형 그라데이션 효과는 원형과 타원형으로 나타낼 수 있다. 모양을 따로 지정하지 않으면 기본값으로 타원형이다.
```HTML
<style>
    .cir {
        background: blue;
        /* 모양을 따로 지정하지 않으면 타원형 */
        background: radial-gradient(white, green, blue);
        /* 모양 지정 예시 */
        background: radial-gradient(circle, white, green, blue);
    }
</style>
```

### 크기
원형 그라데이션을 사용할 때는 원의 크기도 설정이 가능하다. 원의 모양(circle or eclipse)과 크기를 나타내는 키워드값을 함께 적으면 되는데,
크기에서 사용할 수 있는 값은 아래의 표와 같다.

<table>
    <caption></caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>closest-side</b></td>
            <td>원형이라면 그라데이션 가장자리가 그라데이션 중심에서 가장 가까운 요소의 측면에 닿을 때까지 그림.<br>타원형이라면 그라데이션 중심에서 가장 가까운 요소의 가로 측면이나 세로 측면에 닿을 때까지 그림.</td>
        </tr>
        <tr>
            <td><b>closest-corner</b></td>
            <td>그라데이션 가장자리가 중심에서 가장 가까운 요소의 코너에 닿도록 그림.</td>
        </tr>
        <tr>
            <td><b>farthest-side</b></td>
            <td>원형이라면 그라데이션 가장자리가 중심에서 가장 멀리 떨어져 있는 측면에 닿을 때까지 그림. <br>타원형이라면 그라데이션 가장자리가 그라데이션 중심에서 가장 멀리 떨어져 있는 가로 또는 세로 측면에 닿을 때까지 그림.</td>
        </tr>
        <tr>
            <td><b>farthest-corner</b></td> 
            <td>그라데이션의 가장자리가 그라데이션의 중심에서 가장 멀리 떨어져 있는 꼭짓점에 닿을 때까지 그림.</td>
        </tr>
    </tbody>
</table>

### 위치
`at` 키워드와 함께 지정하면 그라데이션이 시작하는 원의 중심을 다르게 나타낼 수 있다.
사용할 수 있는 위치 속성값은 키워드(`left`, `center`, `right` 중 하나 또는 `top`, `center`, `bottom` 중 하나) 또는 백분율이다.

### 색상 중지점
선형 그라데이션처럼 원형 그라데이션도 색상이 바뀌는 부분을 색상 중지점이라고 한다.
그라데이션의 색상과 어느 부분에서 색상을 바꿀지 위치도 함께 지정할 수 있다.

```HTML
<style>
    .cir {
        background: orange;
        background: radial-gradient(yellow, white, orange);
    }
</style>
```

## 그라데이션을 사용한 패턴
선형 그라데이션과 원형 그라데이션을 반복 사용해 패턴을 만들 수도 있다. 선형 그라데이션을 반복할 때는 `repeating-linear-gradient`를 사용하고,
원형 그라데이션을 반복할 때는 `repeating-radial-gradient`을 사용한다.

---
<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800 dark:text-gray-200" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>


- **선형 그라데이션 (`linear-gradient`)**: 색상이 직선(수직, 수평, 대각선) 방향으로 변하는 효과임. `to` 키워드나 각도(`deg`)로 방향을 설정하며, **색상 중지점**을 지정해 색상이 바뀌는 위치를 조절할 수 있음.
- **원형 그라데이션 (`radial-gradient`)**: 중심에서부터 동심원을 그리며 바깥으로 퍼지는 효과임. 모양은 기본값인 타원형(`ellipse`)과 정원(`circle`) 중 선택할 수 있음.
- **원형 그라데이션의 크기와 위치**: `closest-side`, `farthest-corner` 등의 키워드로 그라데이션이 퍼지는 범위를 정하고, `at` 키워드로 시작 중심점을 변경할 수 있음.
- **반복 그라데이션**: `repeating-linear-gradient` 또는 `repeating-radial-gradient` 함수를 사용하면 동일한 그라데이션 패턴을 연속적으로 반복하여 배경 무늬 등을 만들 수 있음.