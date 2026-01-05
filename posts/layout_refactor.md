---
title: "내 홈페이지를 반응형 웹 페이지로 바꿔보자 (with Tailwind)"
date: "2026-01-05 17:30:34"
category: "개발"
description: "기존의 웹 중심의 레이아웃을 반응형으로 수정해보자."
---

## 서론: 나도 이쁜 모바일 화면이 갖고 싶어요
내 페이지는 웹에서 개발하고 있어서 웹 위주의 화면으로 구성되어 있었다. 하지만 그렇다고 해서 아예
다른 미디어 환경을 신경쓰지 않은 것은 아니다!

Tailwind를 활용해서 사이드 바 같은 건 `hidden lg:block`과 같이 기본적으로는 숨기되, 일정 크기 이상의 화면에서만
노출시키는 전략을 사용해서 나름 메인 화면만 보여주고 있었다.

하지만 글꼴이나 검색창 UI 같은 부분에선 아직 세심한 설정까진 이뤄지지 않았기 때문에 모바일의 접근성이 꽝이었다.

<figure>
    <img src="/images/cur_m.png" alt="수정하기 전 모바일에서의 화면 모습(글자 크기 엉망)">
    <figcaption>수정하기 전에는 본문의 제목과 글자 크기가 조정되지 않아서 좀 아쉬운 모습이다. 검색창 UI도 크기가 엉망이다.</figcaption>
</figure>

<figure>
    <img src="/images/cur_p.png" alt="수정하기 전 태블릿에서의 화면 모습(모바일보단 나은 모습)">
    <figcaption>모바일보단 훨씬 나은 모습이다. 허나 검색창 UI는 여전히 크기가 엉망이다.</figcaption>
</figure>

이전에 CSS를 학습하면 <b>모바일 퍼스트</b>라는 기법이 있다는 걸 알게 되었다. 간략하게 설명하면 화면을 스마트폰 기준으로 설계한 뒤
나머지 미디어를 미디어 쿼리로 채워나가는 것이다.

물론 이런 걸 알기 전에 이미 화면을 구현해버린 내 프로젝트라서, 모바일 퍼스트를 적용하겠답시고 처음부터 완전히 다 뜯어 고칠 생각은 없었다.  
더욱이 Tailwind를 활용하면 미디어 쿼리를 아주 쉽게 적용할 수 있어서 고된 리팩토링까지 이어지지 않을 수 있을 거라 생각했다.

### Tailwind CSS의 미디어 쿼리
CSS에서 매번 `@media (min-width: 768px) { ... }`과 같이 길게 작성하던 걸, Tailwind에선 `md:`와 같이 짧은 접두사를 통해
아주 간단하게 미디어 쿼리를 적용할 수 있다.

Tailwind에서 미디어 쿼리 적용하는 걸 이해하기 위해선 <b>최소 너비(min-width)</b>에 대한 개념만 알고 있으면 된다!

#### 1. Tailwind의 브레이크 포인트 (기준점)
Tailwind는 기본적으로 <b>5가지의 기준점(BreakPoint)</b>를 갖고 있다.

<table>
    <caption>Tailwind의 5가지 기준점 정리</caption>
    <thead>
        <tr>
            <th>접두사</th>
            <th>픽셀 기준(min-width)</th>
            <th>대략적인 디바이스</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>(없음)</b></td>
            <td>0px ~ 375px</td>
            <td>모바일 (기본값)</td>
        </tr>
        <tr>
            <td><b>sm</b></td>
            <td>640px ~ </td>
            <td>큰 스마트폰 (가로 모드 등)</td>
        </tr>
        <tr>
            <td><b>md</b></td>
            <td>768px ~ </td>
            <td>태블릿 (아이패드 등)</td>
        </tr>
        <tr>
            <td><b>lg</b></td>
            <td>1024px ~ </td>
            <td>작은 노트북 / 데스크탑</td>
        </tr>
        <tr>
            <td><b>xl</b></td>
            <td>1280px ~ </td>
            <td>큰 모니터</td>
        </tr>
        <tr>
            <td><b>2xl</b></td>
            <td>1536px ~ </td>
            <td>아주 큰 모니터</td>
        </tr>
    </tbody>
</table>

#### 2. 작동원리
Tailwind의 반응형은 <b>'이상'(Equal or Greater than)</b>의 법칙을 따른다. 예를 들어 `md:`와 같이 적으면 
'화면 너비가 768px 이상일 경우 이 CSS를 적용'이라는 의미와 같다.

```Jsx
// 레이아웃: xl 화면(1024px) 이상에서만 보임
// 메인 콘텐츠 옆에 붙이기 위해 left 계산식 사용
<aside className="hidden xl:block absolute top-160 left-full ml-3 h-full font-[Galmuri11] z-40">
    {/* PostRemoteController 구현 내용 */}
</aside>
```

위 코드는 실제 내 오른쪽 사이드 바에 위치한 UI 중 하나인 목차겸 리모컨 UI의 코드 내용이다.  
여기의 CSS로 적힌 `hidden: xl:block`이라는 말을 봐보자. 이는 브라우저에게 기본값으로서 `hidden`을 줘서 숨기게 표현을 하고
`xl:block` 속성을 통해 <b>화면이 1024px 이상일 경우</b>에만 이 컴포넌트를 보여달라고 명시하는 것이다(`block`).

덕분에 위에서 봤던 모바일과 태블릿 환경에서 목차 겸 리모컨 UI는 보이지 않게 된다. (각각 375px,768px)  

## 설계 및 구현
모바일부터 화면 설계를 하기로 결정했다. 모바일 환경에선 본문의 글씨 크기를 수정해주고 검색어 UI에 대한 CSS 설정을 수정하면 아주
그럴듯해 보일 것이었다.

### 1. 카테고리 모음 컴포넌트 (CategoryList.js)
하지만 내 블로그의 자랑인 사이드 바를 아예 보여주지 않는 것은 너무 큰 아쉬움이 남는다. 적어도 category 분류 사이드 바만큼은
반드시 보여주고 싶었다.

이전에 미디어 쿼리를 학습할 때 velog를 기준으로 학습을 했었는데, velog는 category 사이드 바를 모바일 환경에선 가로로 본문 위에 배치시켜
놓은 게 인상적이었다. 나도 category 사이드 바를 이런 식으로 배치하면 좋을 거 같아서 한 번 해보기로 했다.

```javascript
export default function HomeLayout({ children }) {
    return (
    // justify-center로 전체 덩어리를 가운데 정렬 + gap3로 3개의 div 균일한 거리감 조성
    <div className="flex justify-center max-w-[1920px] mx-auto px-4 gap-3">

        <aside className="hidden xl:flex flex-col w-52 gap-4 shrink-0 mt-14 items-center">
            {/** 왼쪽 카테고리 사이드 바 */}
            <CategoryList />
            {/** 날씨 위젯 테스트 */}
            <WeatherWidget />
        </aside>
        {/** 2. 중앙 메인 본문 flex-1로 남은 공간 다 차지 */}
        <main className="flex-1 max-w-4xl w-full min-w-0">
        {/* children = 내가 만들 main 페이지 들어가는 곳 */}
            {children}
        </main>
        
        {/** 3. 오른쪽 균형을 맞추기 위한 투명한 유령 박스 */}
        <aside className="hidden xl:block w-52 mr-2 mt-14 shrink-0" aria-hidden="true">
            <VisitorCounter />
            <PostRank />
        </aside>
    </div>
    )
}
```
현재 `layout.js`는 위와 같다. 양쪽 사이드 바는 현재 `xl`(약 1280px) 이상부터 화면에 비추도록 되어 있다.  
이건 최상위 부모 태그이고 왼쪽 사이드 바에 모두 함께 적용되는 사항이라 이걸 굳이 바꾸고 싶진 않았다.

하지만 이 설정을 없애지 않는 한, 자식 태그에서 아무리 CSS를 수정해도 절대 바뀌지 않는다..
물론 `absolute` 속성을 사용해서 어떻게든 표현할 수는 있겠지만 코드를 관리함에 있어서도 좋지 않은 방식이라고 생각했다.

내가 생각한 건 <b>모바일용 컴포넌트를 하나 더 만들기</b>였다. `xl:hidden`과 같은 조건을 사용해서 넓은 화면에선 보이지 않는
가로로 배치되는 category 모음집을 만들어서 `<main>` 태그 위에 놓기로 한 것이다.

이를 위해 `CategoryList.js`의 코드를 세로로 배치하는 것과 가로로 배치는 경우 모두 사용할 수 있게끔 리팩토링을 진행해야 했다.
`params`로 `vertical`과 `horizontal`을 받도록 하고, 각 `params`에 맞는 CSS 문자열을 준비시켜 적용할 수 있도록 수정했다.

```javascript
<main className="flex-1 max-w-4xl w-full min-w-0">
    <CategoryList type={"horizontal"} />
    {children}
</main>
```

먼저 이렇게 `<main>` 태그 속 `children` 위에 `CategoryList.js` 컴포넌트를 놓되, `lg:hidden`을 걸어서 노트북이나 pc 화면 이상부터는
보이지 않도록 만들었다.

그리고 `CategoryList.js`의 `props`로 type이라는 속성을 두고, 여기로 `vertical` (PC 용, 세로 배치) 혹은 `horizontal` (모바일 용, 가로 배치)을
줘서 각 상황에 맞은 HTML 태그 구조를 return하려고 했다.

```javascript
    return (
        
        <>
            {type !== "vertical" ? (
                // 태블릿 이하의 화면
                <div className="lg:hidden"></div>
            ) : (
                // pc 이상의 화면
                <div className="">
                    {/* 이하 생략 */}
                </div>
            )}
        </>
    )
```

<figure>
    <img src="/images/category_t1.png" alt="모바일(375px 기준) 카테고리 모습 (가로 배치)">
    <figcaption>완성된 모바일(375px 이상)에서 나오는 카테고리 헤더의 모습</figcaption>
</figure>

그 다음에는 본문에 대한 글꼴 및 레이아웃 비율을 조정할 차례였다.

수정해야 할 화면은 크게 3가지로 다음과 같다.  
1. `/app/(main)/page.js`: 메인 화면, 창의 크기를 좀 더 키우고 모든 글꼴을 다 1-2단계씩 낮춰야 할 거 같다.  
2. `/app/(main)/[id]/page.js`: 글 상세 조회 하면, 마찬가지로 화면의 크기를 좀 더 키우고, 모든 글꼴을 1-2단게식 낮출 생각.
3. `/app/(main)/[slug]/page.js`: 카테고리 모음 화면, 이 역시 화면의 크기를 키우고, 모든 글꼴을 1-2단계식 낮춤.

의외로 전역 404페이지인 `not-found.js`는 멀쩡해서 그냥 두기로 했다.

### 2. 메인 화면 ((main)/page.js)
일단 메인 화면과 상세 조회 모두를 가장 바깥에서 감싸는 `RetroWindow.js`에 대해서 수정했다.  
윈도우의 크기를 최대한 가로로 넓게 퍼지도록 주기 위해서 `px-4`라는 속성을 없애서 최대한 넓은 가로폭을 확보했다.  
