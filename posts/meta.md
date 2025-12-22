---
title: "<meta> 태그와 <OG> 태그: 카톡 공유 시 썸네일이 나오는 원리"
date: "2025-12-22 16:22:07"
category: "HTML"
description: "내 블로그를 타인에게 공유할 때 나오는 meta 태그와 OG 태그에 대해서 알아보자."
---

## meta 태그와 OG 태그에 대해서
타인에게 블로그를 카카오톡으로 공유할 때 가장 중요한 건 아무래도 썸네일이 아닐까 싶다.  
링크를 클릭하기 전에 가장 쉽게 링크 내용의 정체성을 드러낼 수 있는 부분이다보니 힘줘서 만들 필요를 느낀다.

나도 이전에 <a href="https://vorschlag-blog.vercel.app/posts/favicon_create" style="color: #2f9e44; text-decoration: none;">
  favicon과 OG 만들기
</a>를 통해서 OG를 만들어본 적이 있으나 구체적인 작동 원리까지는 알지 못 했었기에 이번 기회에 정리하고자 이 글을 작성한다.

### 1. <meta\> 태그란?
`meta` <b>태그란 HTML 문서 자체의 정보(Metadata)</b>를 담는 태그이다.  
이 태그는 브라우저 화면(`<body>`)에는 보이지 않고, <b><code>head</code></b> 태그 안에 숨어서 검색 엔진이나 브라우저, SNS 봇에게 정보를 건낸다.

```HTML
<head>
  <meta charset="UTF-8"> <!-- 문자 인코딩 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- 모바일 반응형 -->
  <meta name="author" content="작성자 이름">
</head>
```

### 2. OG(Open Graph) 태그: SNS 공유를 위한 표준
Open Graph는 페이스북이 만든 프로토콜로, 현재는 전 세계 모든 SNS(카톡,트위터,링크드인 등..)가 링크 미리보기를 만들 때 사용하는 표준규약이다.

#### 핵심 태그 4가지
OG를 구성하는 가장 기본적이고 중요한 4가지 속성이다.

- 1. `og:title`: 콘텐츠의 제목 (블로그 글 제목)
- 2. `og:description`: 콘텐츠에 대한 짧은 설명 (한두 줄 요약)
- 3. `og:image`: 공유할 때 보이는 썸네일
- 4. `og:url`: 콘텐츠 표준 주소

```HTML
<head>
  <meta property="og:title" content="HTML 10일차: 메타 태그 정복하기" />
  <meta property="og:description" content="카톡 공유 시 썸네일이 안 나온다면 필독하세요." />
  <meta property="og:image" content="https://myblog.com/images/thumbnail.png" />
  <meta property="og:url" content="https://myblog.com/posts/html-10" />
</head>
```

<figure>
    <img src="/images/og_ex.png" alt="내 블로그의 og 태그 예시" >
    <figcaption>내 볼르그의 OG 태그 예시이다. image의 경로는 항상 <code>https</code>로 시작하는 <b>절대 경로</b>를 적어야 한다!</figcaption>
</figure>

### 3. 검색 엔진(SEO)을 위한 meta 태그
OG 태그가 "사람들에게 보여주기 위한 카드"라면, 검색 엔진에게 보여주기 위한 태그는 따로 있다.

<b><code>description</code></b> (검색 설명). 구글 검색 결과에서 제목 바로 아래에 뜨는 작은 글씨들이 바로 이것이다.  
<code>name:description</code>은 검색 엔진을 위한 설명이고 <code>property:description</code>은 SNS 공유용이라고 정리하면 된다.
보통 두 곳에 같은 내용을 넣으나 목적은 완전히 다른 셈.

### 4. 트위터(현 X) 카드
트위터는 독자적인 규격을 사용하지만, OG 태그가 있으면 알아서 호환이 된다.  
하지만 더 예쁘게(큰 이미지로) 보여주고 싶다면 아래의 태그를 추가하면 된다.
```HTML
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
```

### 5. Next.js에서 meta와 OG
<b>Next.js</b>에선 <code>generateMetadata()</code> 함수를 통해서 자동으로 <code>&lt;head&gt;</code> 안에 meta 태그들을 생성해준다.
이 함수는 <code>src/app/layout.js</code>나 각 페이지가 되는 <code>page.js</code>에 생성하면 된다.

내 블로그 같은 경우에는 블로그 글을 생성하는 `page.js`와 `src/app/layout.js` 둘 다 생성해놓았다.

```javascript
// 블로그글 생성하는 page.js
export async function generateMetadata({ params }) {
    const { id } = await params
    const post = await getPostData(id)

    const imageUrl = "/images/og-image.png"

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            images: [
                {
                    url: imageUrl, // metadataBase 설정 시 Next.js가 알아서 도메인 주소 붙여줌
                    width: 1200,
                    height: 630,
                },
            ]
        },
    }
}
```

```javascript
// src/app/layout.js 내용
export const metadata = {
  /** 도메인 주소 */
  metadataBase: new URL("https://vorschlag-blog.vercel.app/"),

  title: {
    template: '%s | DevLog',
    default: "Vorschlag's DevLog",
  },
  description: "Next.js와 Tailwind CSS로 바닥부터 만든 레트로 감성 기술 블로그",

  keywords: ["Next.js", "React", "Tech Blog", "Retro UI", "개발 블로그"],

  /** 구글 서치 콘솔 설정 */
  verification: {
    google: 'Htjlq8zQw672rHdKDBD1kI5bsP718VLw9FgsJU5pMVo',
  },

  /** OG */
  openGraph: {
    title: "DevLog | 바닥부터 파보는 기술 블로그",
    description: "개발 지식과 트러블 슈팅을 기록하는 레트로 공간입니다.",
    url: "https://vorschlag-blog.vercel.app/",
    siteName: "DevLog",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};
```

Next.js는 위 객체를 읽어서 최종 HTML을 만들 때 `<meta property="og:..." />` 태그들을 생성해서 클라이언트에 보낸다.

<div class="flex items-center gap-2">
    <svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/> </svg>
    <span class="font-bold text-2xl">
        글 요약
    </span>
</div>

1.  **`meta` 태그**: `<head>`에 위치하며, 브라우저/검색엔진/SNS에게 정보를 주는 역할.
2.  **OG 태그 (`og:image` 등)**: 카톡, 슬랙 등에 링크를 공유할 때 <b>'있어 보이게'</b> 만드는 필수 태그.
3.  **SEO (`description`)**: 구글 검색 결과에 내 사이트 설명을 띄우는 태그.
4.  **이미지 경로**: 외부에서 접속해야 하므로 반드시 <b>절대 경로(URL)</b>여야 함.