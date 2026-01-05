---
title: "Tailwind에서 flex 관련 클래스 동작 과정에 대해서 알아보자"
date: "2026-01-05 15:04:58"
category: "CSS"
description: "Tailwind에서 flex에 대한 기본값과 설정 방법에 대해서 알아보자."
---

## Tailwind CSS의 flex

![tailwind 로그](/images/tailwind.png)
내 블로그는 현재 Tailwind CSS를 통해 CSS를 설정하고 있다. 기본 CSS와 다르게 약어로 정의되는 게 많아서
편리하지만 약어의 종류와 설정 방법을 모르면 말짱 도루묵과 다름이 없다.

이 글은 특히 많이 사용하는 `flex` 박스의 속성을 Tailwind CSS에서 어떻게 지정하는지 학습하는 글.
### 1. Tailwind의 flex 기본값
Tailwind CSS에선 요소에 `class=flex`만 적용하면, 브라우저의 기본 `display: flex` 속성을 따른다.  
즉, 별도의 방향이나 정렬 클래스를 주지 않았을 때는 아래의 기본값을 따른다.

- <b>display</b>: <code>flex</code> (블록 레벨의 플렉스 컨테이너)
- <b>direction</b>: <code>row</code> (가로 방향, 왼쪽 -> 오른쪽)
- <b>wrap</b>: <code>nowrap</code> (줄바꿈 없음, 한 줄에 욱여넣음)
- <b>justify(주축)</b>: <code>flex-start</code> (왼쪽 정렬)
- <b>align(교차축)</b>: <code>stretch</code> (부모 높이만큼 늘어남)

### 2. 상세 속성 정리
`flex` 레이아웃에서 자주 사용되는 속성을 그룹별로 나누어 표로 정리해봤다.
#### 2-1. 레이아웃 & 방향

<table>
    <caption>레이아웃 & 방향 관련 속성</caption>
    <thead>
        <tr>
            <th>클래스명</th>
            <th>CSS 속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>flex</b></td>
            <td><code>display: flex</code></td>
            <td>요소를 블록 레벨 플렉스 컨테이너로 설정.</td>
        </tr>
        <tr>
            <td><b>inline-flex</b></td>
            <td><code>display: inline-flex</code></td>
            <td>요소를 인라인 레벨 플렉스 컨테이너로 설정.</td>
        </tr>
        <tr>
            <td><b>flex-row</b></td>
            <td><code>flex-direction: row</code></td>
            <td>주축을 가로(왼->오)로 설정. 기본값</td>
        </tr>
        <tr>
            <td><b>flex-row-reverse</b></td>
            <td><code>flex-direction: row-reverse</code></td>
            <td>주축을 가로 (오->왼)으로 설정.</td>
        </tr>
        <tr>
            <td><b>flex-col</b></td>
            <td><code>flex-direction: column</code></td>
            <td>주축을 세로(위->아래)로 설정.</td>
        </tr>
        <tr>
            <td><b>flex-col-reverse</b></td>
            <td><code>flex-direction: column-reverse</code></td>
            <td>주축을 세로(아래->위)로 설정.</td>
        </tr>
        <tr>
            <td><b>flex-wrap</b></td>
            <td><code>flex-wrap: wrap</code></td>
            <td>공간이 부족하면 다음 줄로 넘김.</td>
        </tr>
        <tr>
            <td><b>flex-nowrap</b></td>
            <td><code>flex-wrap: nowrap</code></td>
            <td>공간이 부족하더라도 한 줄에 욱여넣음. 기본값</td>
        </tr>
        <tr>
            <td><b>flex-wrap-reverse</b></td>
            <td><code>flex-wrap: wrap-reverse</code></td>
            <td>줄바꿈을 하되, 역순(아래->위)로 줄이 쌓임.</td>
        </tr>
    </tbody>
</table>

#### 2-2. 플렉스 항목 크기 조절 (item용)
`flex` 단축 속성을 다루는 클래스이다. `flex-grow`, `flex-shrink`, `flex-basis`가 어떤 식으로 조합되는지 아는 게 중요하다.

<table>
    <caption>레이아웃 & 방향 관련 속성</caption>
    <thead>
        <tr>
            <th>클래스명</th>
            <th>CSS 속성값(Grow,Shrink,Basis 순)</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>flex-1</b></td>
            <td><code>flex: 1 1 0%</code></td>
            <td>무조건 비율대로 채우기.<br>기본 크기(basis)를 0으로 무시하고, 남은 공간을 균등하게 1의 비율로 가져감. 형제 요소들도 모두 <code>flex-1</code>이면 정확히 N 등분됨</td>
        </tr>
        <tr>
            <td><b>flex-auto</b></td>
            <td><code>flex: 1 1 auto</code></td>
            <td>내용물 크기를 유지하면서 채우기.<br>내용물(콘텐츠) 크기를 보장하면서, 남은 공간이 있다면 늘어남. 내용물이 길다면 더 넓은 공간을 차지함</td>
        </tr>
        <tr>
            <td><b>flex-initial</b></td>
            <td><code>flex: 0 1 auto</code></td>
            <td>기본값(늘어나지 않음).<br>공간이 남아도 늘어나지 않음(grow 0). 공간이 부족하면 줄어듦(shrink 1)</td>
        </tr>
        <tr>
            <td><b>flex-none</b></td>
            <td><code>flex: none</code></td>
            <td>크기 고정(변하지 않음).<br>늘어나지도 않고(grow 0), 줄어들지도 않음(shrink 0). 딱 정해진 크기를 유지.</td>
        </tr>
    </tbody>
</table>

#### 2-3. 확대 및 축소 (개별 제어)
위의 `flex-*` 단축 속성 대신, 확대나 축소만 따로 제어하고 싶을 때 사용하는 클래스이다.

<table>
    <caption>확대 및 축소 관련 속성</caption>
    <thead>
        <tr>
            <th>클래스명</th>
            <th>CSS 속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>grow</b></td>
            <td><code>flex-grow: 1</code></td>
            <td>남는 공간이 있을 때 늘어남.</td>
        </tr>
        <tr>
            <td><b>grow-0</b></td>
            <td><code>flex-grow: 0</code></td>
            <td>공간이 남아도 늘어나지 않음.</td>
        </tr>
        <tr>
            <td><b>shrink</b></td>
            <td><code>flex-shrink: 1</code></td>
            <td>공간이 부족할 때 줄어듦. 기본값</td>
        </tr>
        <tr>
            <td><b>shrink-0</b></td>
            <td><code>flex-shrink: 0</code></td>
            <td><b>중요:</b> 공간이 부족해도 절대 줄어들지 않음. (이미지 찌그러짐 방지 등에 사용)</td>
        </tr>
    </tbody>
</table>

#### 2-4. 정렬 (Alignment)
주축(`justify`)과 교차축(`items`) 정렬이다. `flex-col`을 사용할 때는 주축이 세로가 되므로 방향이 바뀐다는 점을 항상 주의해야 한다.

<table>
    <caption>정렬 관련 속성</caption>
    <thead>
        <tr>
            <th>구분</th>
            <th>클래스명</th>
            <th>CSS 속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="6"><b>주축 정렬</b><br>(justify)</td>
            <td><b>justify-start</b></td>
            <td><code>justify-content: flex-start</code></td>
            <td>시작점 정렬. 기본값</td>
        </tr>
        <tr>
            <td><b>justify-center</b></td>
            <td><code>justify-content: center</code></td>
            <td>가운데 정렬.</td>
        </tr>
        <tr>
            <td><b>justify-end</b></td>
            <td><code>justify-content: flex-end</code></td>
            <td>끝점 정렬.</td>
        </tr>
        <tr>
            <td><b>justify-between</b></td>
            <td><code>justify-content: space-between</code></td>
            <td>양 끝에 붙이고 요소 사이 간격을 균등하게 배분.</td>
        </tr>
        <tr>
            <td><b>justify-around</b></td>
            <td><code>justify-content: space-around</code></td>
            <td>요소 주위에 균등한 여백을 줌.</td>
        </tr>
        <tr>
            <td><b>justify-evenly</b></td>
            <td><code>justify-content: space-evenly</code></td>
            <td>요소 사이와 양 끝 여백을 완전히 균등하게 배분.</td>
        </tr>
        <tr>
            <td rowspan="5"><b>교차축 정렬</b><br>(items)</td>
            <td><b>items-stretch</b></td>
            <td><code>align-items: stretch</code></td>
            <td>부모 높이만큼 쫙 늘어남. 기본값</td>
        </tr>
        <tr>
            <td><b>items-start</b></td>
            <td><code>align-items: flex-start</code></td>
            <td>교차축 시작점 (보통 위쪽) 정렬.</td>
        </tr>
        <tr>
            <td><b>items-center</b></td>
            <td><code>align-items: center</code></td>
            <td>교차축 가운데 (수직 중앙) 정렬.</td>
        </tr>
        <tr>
            <td><b>items-end</b></td>
            <td><code>align-items: flex-end</code></td>
            <td>교차축 끝점 (보통 아래쪽) 정렬.</td>
        </tr>
        <tr>
            <td><b>items-baseline</b></td>
            <td><code>align-items: baseline</code></td>
            <td>텍스트 기준선(베이스라인)에 맞춰 정렬.</td>
        </tr>
        <tr>
            <td rowspan="2"><b>나만 정렬</b><br>(self)</td>
            <td><b>self-center</b></td>
            <td><code>align-self: center</code></td>
            <td>부모 설정을 무시하고 <b>나 혼자만</b> 가운데 정렬.</td>
        </tr>
        <tr>
            <td><b>self-start</b></td>
            <td><code>align-self: flex-start</code></td>
            <td>나 혼자만 시작점 정렬.</td>
        </tr>
    </tbody>
</table>

#### 2-5. 간격 (Gap)
과거에는 `margin`을 사용해 요소 사이를 띄웠지만, Flexbox에서는 `gap`을 사용하는 것이 훨씬 효율적이다.

<table>
    <caption>간격 관련 속성</caption>
    <thead>
        <tr>
            <th>클래스명</th>
            <th>CSS 속성값</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>gap-{n}</b></td>
            <td><code>gap: {n}</code></td>
            <td>행과 열 사이의 간격을 동시에 줌.</td>
        </tr>
        <tr>
            <td><b>gap-x-{n}</b></td>
            <td><code>column-gap: {n}</code></td>
            <td>가로(열) 간격만 줌.</td>
        </tr>
        <tr>
            <td><b>gap-y-{n}</b></td>
            <td><code>row-gap: {n}</code></td>
            <td>세로(행) 간격만 줌.</td>
        </tr>
    </tbody>
</table>

---

<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800 dark:text-gray-200" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>


- **기본값**: `flex` 클래스만 주면 가로 방향(`row`), 줄바꿈 없음(`nowrap`), 왼쪽 정렬(`justify-start`), 높이 채움(`items-stretch`)이 기본으로 적용됨.
- **방향 설정**: `flex-col`로 주축을 세로로 바꿀 수 있으며, 이때 `justify`와 `items`의 방향 역할도 바뀐다는 점을 유의해야 함.
- **크기 조절**: `flex-1`(비율 채우기)과 `flex-none`(크기 고정)이 가장 많이 쓰이며, 이미지가 찌그러지는 것을 막으려면 `shrink-0`을 사용해야 함.
- **정렬**: 주축은 `justify-*`, 교차축은 `items-*`를 사용하며, 특정 아이템만 다르게 배치하려면 `self-*`를 사용함.
- **간격**: 요소 사이의 여백은 마진 대신 `gap-*` 유틸리티를 사용하는 것이 관리하기 편함.