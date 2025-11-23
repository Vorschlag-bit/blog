---
title: "favicon과 OG 만들기"
date: "2025-11-22 16:37:14"
category: "개발"
description: "블로그를 대표하는 마스코트와 카드 이미지를 만들어보기"
---

## favicon과 OG(Open Graph) 만들어보기
웹브라우저에서 가장 눈에 띄는 것은 아무래도 **favicon**과 **사이트 이름**이라고 생각한다.\
Next.js에서는 아주 손쉽게 favicon과 사이트 이름 그리고 **Open Graph**를 수정할 수 있게 해준다.

먼저 내가 하고 싶은 마스코트는 Pinterest에서 찾은 닥스훈트 도트였다.

!["dachshund"](/images/dachs.jpeg)

이 도트가 맘에 들어서 favicon 겸 마스코트로 사용하기로 결정했고, 투명한 배경을 얻기 위해 
[Piskel](https://www.piskelapp.com/)에서 32 * 32 pixel에 맞춰서 도트를 찍었다.

그 후에는 `layout.js` 파일에서 메타데이터를 수정해 블로그 이름과 description을 수정했고\
`src/app`에 **icon.png** 파일을 넣어서 자동으로 favicon으로 등록시켰다.

다음으로는 OG를 만들 차례였다.\
OG는 보통 가로로 긴 직사각형의 모양이 가장 이쁘게 나오므로 대략 1200 * 630 비율의 대표 이미지가 필요했다.\
이를 위해서 [미리캔버스](https://www.miricanvas.com/templates)에서 OG로 사용할 이미지를 대강 생성했다.\
!["og-img"](/images/og-image.png)
블로그의 배경인 모눈종이와 느낌을 살릴 도트 제목을 넣었다.

그 후에는 `layout.js`의 `metadata`에 `openGraph` 필드를 추가했다.
```javascript
export const metadata = {
  /** 도메인 주소 */
  metadataBase: new URL("https://vorschlag-blog.vercel.app/"),

  title: {
    template: '%s | DevLog',
    default: "Vorschlag's DevLog",
  },
  description: "Next.js와 Tailwind CSS로 바닥부터 만든 레트로 감성 기술 블로그",

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
이렇게 수정을 한 후에 카카오톡 나에게 보내기를 통해서 결과를 테스트해보았는데 기존에 남아있는
캐시때문에 제대로 된 결과가 나오지 않고 있었다.

이럴 때 [카카오개발자 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)를 사용하면 캐시를 초기화하고 결과값을
디버깅할 수 있다!

### 결과
!["og-결과"](/images/og-result.png)

아주 맘에 든다! og 카드부터 블로그에 대한 상세한 설명까지 훌륭하다.\
웹사이트의 메타데이터를 이렇게 쉽게 수정할 수 있다니 Next.js의 또 다른 장점을 발견한 거 같은 경험이었다.

!["og이전결과"](/images/og-before.png)
이전 결과와 비교해보면 훨씬 극명히 비교가 되었다. 역시 만들길 잘한 거 같다.\
하루 하루 개발을 꾸준히 하면서 블로그가 알차지고 있다. \
이 성취감이 어마어마해서 마치 농장 타이쿤 게임을 하는 거 같은 기분이다. 덕분에 개발의 열정이 다시 타오르는 것도 큰 이점이고.

다음 기능은 **사이드**에 채워넣을 무언가를 개발해 보거나 **커스텀 로딩창**을 개발하거나 **커스텀 404**페이지를 개발해보고 싶다.

이를 위해선 다른 기존 블로그들을 탐방하면서 다른 곳은 어떤 식으로 보통 꾸미는지
분석해볼 필요가 있어서 적당히 조사를 해보면서 내게 가장 맘에 드는 UI와 기능을 선택해서 개발해봐야겠다.