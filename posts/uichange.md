---
title: "블로그 UI 바꾸기"
date: "2025-11-22 02:32:45"
category: "개발"
description: "블로그 UI를 픽셀 아트로 바꿔보자"
---

## 블로그 UI 꾸며보기
이제 댓글과 글 모두 작성 가능한 최소한의 블로그 기능을 다 갖추었다.
사실 여전히 채워야할 기본적인 기능들이 넘쳐나지만 우선 블로그의 스타일부터 꾸며보고 싶었다.

그 중에서도 개인적으로 Pixel 스타일 블로그들을 가끔 구글링하다가 보면서 너무 이쁘다고 생각이 들었고
나도 적용해보고 싶어서 폰트부터 UI까지 차근차근 변경해나갈 것이다.

이 글은 그 과정을 적당히 상세하게 적어내는 글.

### 1. 폰트부터 바꾸기
도트 UI의 80%는 **폰트**로부터 나온다. UI가 아무리 레트로스러워도 폰트가 굴림체면 말짱 도루묵인 것.
한글 도트의 국룰인 **갈무리(Galmuri)** 폰트를 적용해보았다.

Next.js는 js답게 구글폰트나 로컬 폰트를 손쉽게 불러올 수 있다. 특히 갈무리는 CDN으로 쉽게 사용이 가능하다.

`layout.js`에 `<head>` 태그를 생성한 후 폰트 링크를 넣어주었다.

```javascript
<html>
    <head>
        {/** galmuri 폰트 불러오기 */}
        <link 
            rel="stylesheet"
            ref="https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css"
        />
    <head/>
    {/** font 적용하기 */}
    <body className="기존 css + font-[Galmuri11]">
        {/** 기존 내용들 */}
    <body/>
<html/>
```

<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span>트러블 슈팅(클릭)</span>
</summary>

`<link>`를 적용할 때 `<Link>`를 처음에 사용했었는데 당연히 되질 않았다.\
`<Link>`는 `next/link` 라이브러리에서 가져온 것으로 클릭하면 페이지가 이동하는 `<a>`태그로 변한다.\
하지만 `<a>`태그는 `<head>`태그의 자식이 될 수 없는 HTML 문법 때문에 에러가 나왔었다.\
`<link>`태그는 HTML 표준 태그로 CSS나 폰트 스타일을 불러올 때 사용한다.

</details>

#### 폰트 적용 모습
![galmuri적용](/images/galmuri.png)

폰트만 바꿨는데도 벌써 느낌이가 살아버리는 모습을 볼 수 있다.

그 다음에는 본격적인 **UI깎기**를 수행하였다.\
UI의 구체적인 디자인을 정하려고 Pinterest에서 괜찮아 보이는 UI 이미지들을 찾아보았다.

#### 1. 아기자기한 픽셀 이미지
![아기자기_픽셀_이미](/images/retro1.jpg)

#### 2. 감성 충만한? 레트로 브라우저 이미지
![감성_충만_레트로_브라우저](/images/_.jpeg)

#### 3. 보기 편한? 레트로 브라우저 이미지
![보기_편한_레트로_브라우저](/images/retro2.gif)

1번은 아기자기하고 이쁘긴 하지만 이 블로그는 엄연히 **'기술'** 블로그가 정체성인만큼 가시성을 최우선으로 고려해서 3번의 형태를 최대한 녹여내는 걸로 결정했다.

### 2. UI 깎아내기
레트로 도트 UI의 핵심은 **'칼각'** 이라고 생각한다. 둥근(rounded) css를 모두 없어야 하는데 이는 매우 귀찮으므로 `global.css`에서 한 번에 처리하기로 결심했다.

```css
/** 모든 요소에서 둥근 거 제거  */
* {
    border-radius: 0 !important;
}

/** buttom에 픽셀 느낌 주기 */
button, .border {
    border-width: 2px !important; /** 테두리는 두껍게 */
    border-style: solid !important;
}
```

버튼에도 도트느낌을 살리기 위해서 **"픽셀 그림자"** 유틸리티를 만들어봤다.
```css
/* globals.css */

/* 픽셀 아트 테두리 효과 (Box Shadow로 구현) */
.shadow-pixel {
  box-shadow: 
    -2px 0 0 0 currentColor, 
    2px 0 0 0 currentColor, 
    0 -2px 0 0 currentColor, 
    0 2px 0 0 currentColor; 
  border: none !important;
  margin: 2px; /* 그림자 공간 확보 */
}

/* 버튼 눌렸을 때 효과 */
.shadow-pixel:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
```

그 후엔 블로그에 올린 이미지에도 레트로 느낌의 그림자를 주고 고정된 비율 및 정렬 상태를 부여하기 위해서 아래의 css를 적용하였다.
```css
.prose img {
    max-width: 80%;
    height: auto;
    margin: 2rem 0; /* 위아래 여백 2rem, 좌우는 왼쪽 정렬 */
    display: block; /* 가운데 정렬을 위해 block 요소로 변경 */

    /* Retro 감성 느낌 내보기 */
    border: 2px solid currentColor;
    box-shadow: 4px 4px 0px currentColor;
}
```

#### 적용 전
![적용_전](/images/before_sh.png)

#### 적용 후
![적용_후](/images/after_sh.png)

그 다음에는 3번 같은 페이지를 모든 div마다 그리는 건 너무 비효율적이므로 `<RetroWindow>`라는 컴포넌트로 만들어서 재사용할 수 있게 만드는 게 목표였다.\
먼저 global.css를 수정해서 `body`에 입힐 css를 격자모양을 주었다.

```css
body {
  /* ...기존 설정... */
  /* 모눈종이 패턴 (색상은 취향껏 조절) */
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
}

/* 다크모드일 때 그리드 색상 변경 */
.dark body {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}
```

그 후엔 재사용해서 사용할 `<RetroWindow>` 컴포넌트를 빡구현했다.
<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span>RetroWindow 코드(스압)</span>
</summary>

```javascript
"use client";

export default function RetroWindow({ children, title = "Untitled", className ="" }) {
    return (
        // 1. 창틀 (검은 테두리 + 그림자)
        <div suppressHydrationWarning className={`border-2 border-black dark:border-gray-400 bg-white 
        dark:bg-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] ${className}`}>
            {/** 2. 타이틀 바 (파란색 or 회색 배경) */}
            <div suppressHydrationWarning className="border-b-2 border-black dark:border-gray-400 bg-blue-100 dark:bg-gray-800 p-2
            flex justify-between items-center select-none">
                {/** file/title */}
                <div className="font-[Galmuri11] font-bold text-sm truncate flex items-center gap-1 text-black dark:text-white">
                <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 22h18V8h-2V6h-2v2h-2V6h2V4h-2V2H3v20zm2-2V4h8v6h6v10H5z" fill="currentColor"/>
                </svg>
                    <span className="ml-1">{title}</span>
                </div>

                {/** 윈도우 버튼 3개(장식용) */}
                <div className="flex gap-1">
                    {/** 최소화 */}
                    <div className="w-3 h-3 border border-black bg-white"></div>
                    {/** 최대화 */}
                    <div className="w-3 h-3 border border-black bg-gray-300"></div>
                    {/** 닫기 */}
                    <div className="w-3 h-3 border border-black bg-red-400"></div>
                </div>
            </div>

            {/** 3. 실제 콘텐츠 영역 */}
            <div className="p-6">
                {children}
            </div>
        </div>
    )
}
```

</details>

이후에 이걸 `/src/app/page.js` 파일과 `/src/app/posts/[id]/page.js` 파일의 최상위 `<div>` 바로 아래에 `<RetroWindow>` 컴포넌트를 감쌌다.

```javascript
/** /src/app/page.js */
export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="p-10 max-w-4xl mx-auto">
      {/** RetroWindow로 감싸기 */}
      <RetroWindow title="C:\Users\DevLog\posts_list.exe">
        {/** 기존 컴포넌트들 */}
      </RetroWindow>
    </div>

/* --------------------------- */

/** /src/app/posts/[id]/page.js */
export default async function Post({params}) {
    const { id } = await params
    const postData = await getPostData(id)

    return (
        <div className="max-w-4xl mx-auto p-4">
            <RetroWindow title={`Reading: ${postData.title}.txt`}>
                {/** 기존 컴포넌트들 */}
            </RetroWindow>
        </div>
    )
}
```
#### 적용 후
!["레트로_윈도우_적용_후"](/images/after_window.png)

아주 만족스럽다!

### 3. 후기
중간 중간 `CSS` 오류로 인해서 리팩토링이 꽤 오래걸렸지만 그만큼 css의 흐름과 기본 문법을 익힐 수 있었다.\
또한 `suppressHydrationWarning`를 활용해서 client와 server의 HTML 차이를 강제로 무시하는 방법으로
console Error를 피할 수 있었는데 이런 자잘자잘한 지식들 역시 이번 포스팅을 작성하면서 배울 수 있었다.\
다음엔 **사이드** 추가할 컴포넌트들을 어떻게 넣을지 고민하고 개발하는 포스트를 올릴 것 같다.\
또 하루를 꼬박 걸려서 만들 생각에 조금은 막막하지만 이상하리만치 재밌다..\
개발의 흥미를 다시 찾는 데에는 이만한 작업이 없는 것 같다. \
지금까진 최고의 개발 경험이다!