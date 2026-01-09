---
title: "Typescript 도입기, 안정적인 개발과 운영을 위해서"
date: "2026-01-09 13:33:28"
category: "개발"
description: "블로그를 Typescript 기반으로 리팩토링 해보자."
---

## 서론: 이젠 진짜 해야 한다.
새로운 기능 추가보다 블로그 리팩토링에 힘을 쏟기로 결정한 순간부터 반드시 해야 하는 일이었다.

현재는 Js로만 코드가 구성되어 있다. Js의 동적 타입 결정은 유연한 구조를 주지만, 프로젝트의 구조가 커질수록
'타입의 유연함'이란 오히려 독이 될 뿐이다.

이전에 Kotlin으로 개발을 해본 적이 있는데, Typescript를 적용한 Js는 Kotlin과 매우 비슷한 형식으로 작성된다고
느꼈다.

이 글은 현재까지 Js로 개발된 블로그를 Ts로 수정하는 리팩토링을 담은 글

## 종속성 설치
먼저 아래의 명령어를 통해서 Typescript를 설치했다.
```zsh
npm install -D typescript @types/react @types/node @types/react-dom
```
<!-- 이 의존성들이 각각 뭘 설치하는 것인지 작성할 것 -->

그 후에 일단 아무것도 작성하지 않은 `tsconfig.json` 파일은 만들어 root 디렉토리에 둔다.  
다음에 `npm run dev`로 서버를 시작하면 Next.js가 설정 내용을 자동으로 채워줄 것이다.

<figure>
    <img src="/images/ts_i.png" alt="typescript 설치하고 개발 서버 구동 시, tsconfig.json 자동생성되는 사진">
    <figcaption>그러면 이렇게 터미널에도 <code>tsconfig.json</code>를 생성했다고 나온다.</figcaption>
</figure>

<figure>
    <img src="/images/tsconfig.png" alt="tsconfig.json 내용">
    <figcaption>내용도 자동으로 생성되어 있다.</figcaption>
</figure>
```

## 공통 타입 정의하기 (types 폴더)
이후에는 `/types`라는 디렉토리를 만들어서 블로그에 사용한 객체들의 정적 타입을 하나 하나 세심히 작성하기만 하면
사실상 거의 끝이다. 물론 이 부분이 덕분에 제일 많은 시간을 소모한다.

특정 객체가 2개 이상의 컴포넌트에서 사용된다면 이 `/types` 디렉토리 아래에 `index.ts`나 해당 객체의 이름을 붙이 ts 파일을 만들어서
여러 곳에서 사용할 수 있도록 하고, 오직 하나의 컴포넌트에서만 사용된다면 해당 컴포넌트에 직접 `interface`를 만드는 게 편하다.

예를 들어 `server actions`의 return값으로 내뱉는 `data`는 클라이언트 컴포넌트(`WeatherWidget`)와 그 부모인 서버 컴포넌트(WeatherContainer)에서 모두 사용되기 때문에 이런 경우엔 `/types` 이하에 `weather.ts`라는 파일로 객체를 생성해 두었다.
```Tsx
// 기상성 API 응답 객체
export interface WeatherData {
    temperature: string,
    tmx: string,
    tmn: string,
    humidity: number,
    wind: number,
    PTY: number,
    SKY: number,
    LGT: number,
    location: string,
    iconName: string
}
```

이 객체를 사용할 파일의 확장자 또한 이젠 바꿔줘야 한다. 컴포넌트(Jsx를 return하는) 파일일 경우에는 `.tsx`를 일반 서버 로직이라면
`ts`를 붙여주면 된다.

<figure>
    <img src="/images/ts_1.png" alt="tsx로 바꾼 후 보이는 컴파일러 에러들(빨간 줄)">
    <figcaption>확장자를 <code>.tsx</code>로 변경하면 이렇게 이제 컴파일러 에러가 보인다.</figcaption>
</figure>

여기서부턴 이제 순수 노가다뿐이다. 자신이 설계한 타입에 맞게끔 하나씩 수정 천천히 수정해 나가면 된다.

