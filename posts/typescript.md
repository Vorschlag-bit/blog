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

Typescript를 사용하면서 타입을 더 엄격하게 다루는 법을 알게 되었다.
클라이언트 컴포넌트가 `props`로 받은 객체를 사용할 때는 내갸 사용하고자 하는 key에 해당 데이터 타입을 작성한 내부 인터페이스를
하나 더 만들어 둬야 한다.

예를 들어 `WeatherContainer.tsx`가 props로 준 `data`라는 값은 객체로서 소괄호에 감싸져 `WeatherWidget.tsx`에게 전해진다.
`WeatherWidget.tsx`에선 이걸 `initialData`라는 `key`로 받아 사용하기 때문에 아래와 같은 인터페이스로 한 번 더 감싸줘야 한다.

```Tsx
// 부모가 Props를 객체로 감싸서 제공
export default async function WeatherContainer() {
    const data = await getWeather({cx: SEOUL_CODE.nx, cy: SEOUL_CODE.ny, type: "xy"})
    return (
        <div className="w-full">
            <WeatherWidget initialData={data} />
        </div>
    )
}

// 자식 컴포넌트에선 props는 객체고, 내가 구조분해 할당으로 받는 건 변수 이름이기 때문에 타입을 한 번 더 감싸야 함
interface WeatherWidgetProps {
    // null or data만 넘겨줌
    initialData: WeatherData | null;
}
```

`WeatherWidget.tsx`에서 사용할 처음 받아 사용할 `initialData`는 무조건 `null` 아니면 `WeatherData` 뿐이므로,
useState에도 제네릭을 이용해 타입을 명시해야 한다.

```Tsx
const [weather, setWeather] = useState<WeatherData | null>(initialData);
```

한 가지 JS에서 주의해야 할 점은 `?` 연산자로 타입을 지정하게 되면, Kotlin에선 `nullable`하는 의미로 null이 기본값이 될 수 있으나,
JS에선 `undefined`가 기본값이 된다는 것이었다. 따라서, `?` 연산자보단 그냥 `| null`을 통해서 nullable한 의미를 표현할 수 있었다.

또한 `|` 연산자와 `||` 연산자의 차이점에 대해서도 알 수 있었다.  
`|` 연산자는 Typescript의 문법으로 타입에 대한 정의였다. 즉 객체의 필드값이 `nullable`할 수 있다는 의미를 부여한다.
반면 `||` 연산자는 Javascript의 문법으로 실행 로직에 대한 방식이다. 값이 없을 경우 `||` 연산자 이후의 값을 대신 넣는다.

이렇게 Javascript 내부에 비슷하지만 주관하는 세계가 다른 Typescript가 함께 녹아들어가 있다는 게 매우 독특했다.

