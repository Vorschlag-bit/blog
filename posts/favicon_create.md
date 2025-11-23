---
title: "favicon과 OG 만들기"
date: "2025-11-22 16:37:14"
category: "개발"
description: "블로그를 대표하는 마스코트와 카드 이미지를 만들어보기"
---

## favicon과 OG(Open Graph) 만들어보기
웹브라우저에서 가장 눈에 띄는 것은 아무래도 **favicon**과 **사이트 이름**이라고 생각한다.\
Next.js에서는 아주 손쉽게 favicon과 사이트 이름 그리고 **OG(Open Graph)**를 수정할 수 있게 해준다.

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
블로그의 배경인 모눈종이와 도트 제목을 넣었다.