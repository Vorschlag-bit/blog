---
title: "SEO(검색엔진) 노출을 위한 설정해보기"
date: "2025-11-26 09:05:41"
category: "개발"
description: "블로그 검색엔진 노출을 위한 몇 가지 설정들을 알아보자"
---

## SEO에게 블로그 노출을 높여주는 방법 소개 및 구현
나는 현재 ["Vercel"](https://vercel.com/)를 사용해서 내 블로그를 배포하고 있다.
이는 공개된 웹페이지이므로 당연히 구글이 크롤링이 가능하다.

하지만 **크롤링이 가능한 상태**와 **구글이 내 사이트를 잘 긁어서 검색 결과에 노출해주는 것**은 엄연히 다르다!\
특히 나처럼 **Next.js**로 웹사이트를 만들었다면, 구글이 내 글을 빠르고 정확하게 가져가도록 **SEO** 설정을 해주는 것이 좋다.
따라서 이 글은 Next.js App Router에서 SEO를 위한 3가지 핵심 설정을 정리하는 글이 되겠다.

### 1. robot.txt 만들기
개발을 하면서 api가 없어서 웹크롤링을 시도해본 사람이라면 `robot.txt`를 다 알고 있으리라.\
검색 엔진 로봇에게 '내 사이트 긁어가도 돼~'라고 허락해주는 파일이다.\
Next.js에선 `src/app/robots.js`(혹은 .ts) 파일을 만들면 Next.js가 알아서 `robot.txt`를 생성해준다!

```javascript
import { userAgent } from "next/server";

export default function robots() {
    return {
        rules: {
            // 모든 로봇에게 허용
            userAgent: '*', 
            // 모든 페이지 허용
            allow: '/',
            // (예시) 특정 페이지는 막고 싶을 때
            disallow: '/private',
        },
        // sitemap을 만들어줘야 로봇이 길을 안 헤맨다
        sitemap: `https://vorschlag-blog.vercel.app/sitemap.xml`
    }
}
```

### 2. sitemap.xml 만들기
크롤링 봇에게 내 사이트를 위한 지도를 제공해주는 것이다. 특히 나처럼 **동적 라우팅**(`[id]`)으로 된 블로그 글에겐
사이트맵은 봇에게 큰 도움이 되니 꼭 만들자. 위치는 `robot.js`와 마찬가지로 `src/app` 하위에 만들어두면 된다.

```javascript
// src/app/sitemap.js
import { getSortedPostsData } from "@/lib/posts";

export default async function sitemap() {
    const baseUrl = 'https://vorschlag-blog.vercel.app'
    const allPosts = getSortedPostsData()

    const posts = allPosts.map((post) => {
        // [안전장치] 날짜 변환 시도
        let dateObj;
        try {
            dateObj = new Date(post.date);
            // 만약 날짜가 유효하지 않다면(Invalid Date) 현재 시간으로 설정
            if (isNaN(dateObj.getTime())) {
                dateObj = new Date();
            }
        } catch (e) {
            dateObj = new Date();
        }

        return {
            url: `${baseUrl}/posts/${post.id}`,
            lastModified: dateObj, 
            changeFrequency: 'daily',
            priority: 0.7, // 게시글은 보통 0.7~0.8
        }
    })

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0, // 메인은 중요하니까 1.0
        },
        ...posts,
    ]
}
```
이렇게 해두면 `내 도메인/sitemap.xml`에 접속했을 때 xml 지도가 자동으로 생성된다!
!["site_map_xml_사진"](/images/sitemap_xml.png)

### 3. 구글 서치 콘솔(GSC)에 등록하기
위의 파일들을 다 만들었어도, 구글은 아직 내 블로그가 생긴지조차 모를 수 있다.
따라서 가서 자소서를 돌려야 한다!

<a href="https://search.google.com/search-console/welcome" style="color: #2f9e44; text-decoration: none;">
  구글 서치 콘솔
</a>
에 접속해서 구글 아이디로 로그인을 하고, 속성 추가를 누르고 블로그 도메인을 입력한다.

필자는 개인 도메인은 없기 때문에 URL 접두어에 내 URL을 넣고, **HTML 태그**로 제공되는 verification code를
`src/app/layout.js`에 있는 `metadata`에 아래의 설정을 추가한 후 인증을 하면 된다.

```javascript
// src/app/layout.js
export const metadata = {
  title: 'DevLog',
  description: '개발 블로그',
  // ... 기타 설정 ...
  verification: {
    google: '복사한-구글-확인-코드',
  },
};
```

마지막으로 소유권 확인이 끝나면 메뉴의 **sitemap**탭으로 가서 `sitemap.xml`을 제출하면 끝!

