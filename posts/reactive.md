---
title: "반응형 웹에 대해서 알아보자"
date: "2026-01-02 14:18:12"
category: "CSS"
description: "다양한 플랫폼에 맞춰 화면을 구성하는 반응형 웹에 대해서 알아보자"
---

## 반응형 웹 디자인이란?
이젠 PC보다 스마트폰이나 태블릿에서 웹 사이트에 접속하는 경우가 훨씬 잦다. 하지만 PC와 스마트폰의 화면 크기는 완전히 다르기 때문에
PC용으로 만든 웹 페이지를 스마트폰에서 접속하면 글자가 매우 작게 표시가 되어 버린다. 따라서 포털 사이트나 쇼핑몰 사이트에서는 모바일 기기의
특성을 최대한 활용할 수 있도록 모바일 사이트를 별도로 제작한다.

하지만 스마트폰이나 태블릿, 심지어는 스마트 TV 등 브라우저 환경이 매우 다양한 상황 속에서 그때마다 웹 페이지를 별도로 제작하는 건 매우 번거로운 일이다.
새로운 기능이 추가된다면 모든 플랫폼에 맞춰 새롭게 화면을 구성해야 할 테니 유지보수까지 어려워 질 것이다. 물론 요즘엔 모바일은 앱으로서 아예 별도로 만드는
일이 잦지만...

이런 문제를 해결하기 위해 <b>반응형 웹 디자인</b>이라는 개념이 나타났다. 반응형 웹 디자인은 웹 요소를 화면 크기에 맞게 재배치하고 표시 방법만 바꿔 사이트를
구현한다.

<figure>
    <img src="/images/vel1.png" alt="velog pc 화면 예시">
    <figcaption>velog를 예시로 보면 pc는 널찍한 화면을 제공한다.</figcaption>
    <img src="/images/vel2.png" alt="velog 모바일 화면 예시">
    <figcaption>하지만 모바일 환경에선 스마트폰 환경에 맞춰 더 아기자기해졌다.</figcaption>
</figure>

위의 velog가 대표적인 반응형 웹 페이지이다. 자사 어플이 없는 경우엔 이런 식으로 다양한 플랫폼에 맞춰 화면이 변경되는 걸 개발자 도구를 통해 확인할 수 있다.

### 모바일 기기를 위한 뷰포트

반응형 웹 디자인에서 기본적으로 알아 둬야 하는 것은 <b>뷰포트(ViewPort)</b>다. PC에 맞게 제작한 웹 페이지를 모바일 기기에서 접속하면 모든 내용이 작게 표시된다.
그 이유는 PC화면과 모바일 화면에서 표시되는 픽셀의 차이때문인데, 뷰포트를 지정하면 접속한 기기의 화면에 맞춰 확대하거나 축소해서 표시할 수 있다.
이때 뷰포트란 스마트폰 화면에서 실제 내용이 표시되는 영역이다. 뷰포트는 `<meta>` 태그를 이용해 `<head>` 태그 사이에 작성한다.

```HTML
<meta name="viewport" content="속성1 = 값1, 속성n = 값n">
```

`<meta>` 태그에서는 `content` 속성을 통해 뷰포트의 속성과 속성값을 지정한다. 아래는 `content` 속성에서 사용하는 뷰포트 속성을 정리한 표이다.
<table>
    <caption>뷰포트의 속성</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
            <th>사용 가능한 값</th>
            <th>기본값</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>width</b></td>
            <td>뷰포트 너비</td>
            <td>device-width 또는 크기</td>
            <td>브라우저 기본값</td>
        </tr>
        <tr>
            <td><b>height</b></td>
            <td>뷰포트 높이</td>
            <td>device-height 또는 크기</td>
            <td>브라우저 기본값</td>
        </tr>
        <tr>
            <td><b>initial=scale</b></td>
            <td>초기 확대 축소한 값</td>
            <td>1 ~ 10</td>
            <td>1</td>
        </tr>
    </tbody>
</table>

뷰포트 개념이 등장하기 전까지는 CSS에서 크기를 지정할 때 주로 px이나 퍼센트 단위를 사용했으나 이제는 뷰포트를 기준으로 하는 단위를 사용할 수도 있다.
- vw(viewport width): 1vw = 뷰포트 너비 1%와 같음
- vh(viewport height): 1vh = 뷰포트 높이 1%와 같음
- vmin(viewport minimum): 뷰포트의 너비와 높이 중에서 작은 값의 1%와 같음
- vmax(viewport maximum): 뷰포트의 너비와 높이 중에서 큰 값의 1%와 같음

***

<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>

- **반응형 웹 디자인**: PC, 스마트폰, 태블릿 등 다양한 기기의 화면 크기에 맞춰 웹 요소의 배치와 표시 방법을 유동적으로 조절하는 방식임. 기기별로 별도의 사이트를 만들 필요가 없어 유지보수에 효율적임.
- **뷰포트(Viewport)**: 스마트폰 화면에서 실제 콘텐츠가 표시되는 영역을 의미함. PC 화면을 모바일에서 단순히 축소해서 보여주는 문제를 해결하기 위해 필수적으로 설정해야 함.
- **설정 방법**: HTML의 `<head>` 태그 내부에 `<meta name="viewport" ...>` 태그를 사용하여 너비(`width`), 높이(`height`), 초기 확대 비율(`initial-scale`) 등을 지정함.
- **뷰포트 단위**: 픽셀(`px`) 대신 뷰포트 크기를 기준으로 하는 `vw`(너비 1%), `vh`(높이 1%), `vmin`, `vmax` 단위를 사용하여 유동적인 크기를 지정할 수 있음.