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

## 공통 타입 정의하기 (types 폴더)
내가 사용하는 객체에 대한 '정적 타입'을 적어두는 곳이다.  
