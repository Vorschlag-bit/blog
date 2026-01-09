---
title: "Typescript 도입기, 안정적인 개발과 운영을 위해서"
date: "2026-01-09 13:33:28"
category: "개발"
description: "블로그를 Typescript 기반으로 리팩토링 해보자."
---

## 서론: 이젠 진짜 해야 한다.
새로운 기능 추가보다 블로그 리팩토링에 힘을 쏟기로 결정한 순간부터 반드시 해야 하는 일이었다.

현재는 JS로만 코드가 구성되어 있다. JS의 동적 타입 결정은 초기에는 유연한 구조를 제공하지만, 프로젝트의 규모가 커질수록 '타입의 유연함'은 오히려 독이 될 뿐이다. 언제 어디서 `undefined`가 튀어나올지 모르는 불안감을 안고 개발할 수는 없었다.

이전에 Kotlin으로 개발을 해본 경험이 있는데, Typescript를 적용한 JS는 Kotlin과 매우 비슷한 형식(정적 타입)으로 작성된다고 느꼈다.

이 글은 현재까지 JS로 개발된 블로그를 TS로 마이그레이션 하는 과정을 담은 기록이다.

## 종속성 설치
먼저 아래의 명령어를 통해서 Typescript와 관련 패키지들을 설치했다.

```zsh
npm install -D typescript @types/react @types/node @types/react-dom
```

각 패키지의 역할은 다음과 같다.
*   `typescript`: TS 코드를 JS로 컴파일해주는 핵심 컴파일러.
*   `@types/react`: React의 컴포넌트, Hook 등에 대한 타입 정의 파일.
*   `@types/node`: Node.js 내장 모듈(`fs`, `path` 등)에 대한 타입 정의 파일.
*   `@types/react-dom`: DOM 엘리먼트 조작을 위한 타입 정의 파일.

설치 후 아무 내용이 없는 `tsconfig.json` 파일을 루트 디렉토리에 생성해 둔다.
그다음 `npm run dev`로 개발 서버를 시작하면 Next.js가 감지하고 설정 내용을 자동으로 채워준다.

<figure>
    <img src="/images/ts_i.png" alt="typescript 설치하고 개발 서버 구동 시, tsconfig.json 자동생성되는 사진">
    <figcaption>터미널에서 <code>tsconfig.json</code>가 생성되었다는 메시지를 확인할 수 있다.</figcaption>
</figure>

<figure>
    <img src="/images/tsconfig.png" alt="tsconfig.json 내용">
    <figcaption>내용도 Next.js 권장 설정으로 자동 구성된다.</figcaption>
</figure>

## 공통 타입 정의하기 (types 폴더)
이제부턴 `/types`라는 디렉토리를 만들어서 블로그에 사용되는 데이터 객체들의 타입을 하나하나 세심히 작성하면 된다. 사실상 이 부분이 마이그레이션의 핵심이자 가장 많은 시간을 잡아먹는 노가다 구간이다.

나만의 규칙을 정했다. 특정 객체가 2개 이상의 컴포넌트에서 사용된다면 `/types` 디렉토리 아래에 `weather.ts` 처럼 파일로 분리해 관리하고, 오직 하나의 컴포넌트에서만 사용된다면 해당 컴포넌트 파일 내부에 직접 `interface`를 선언하기로 했다.

예를 들어 Server Actions의 반환값인 `WeatherData`는 클라이언트 컴포넌트(`WeatherWidget`)와 부모인 서버 컴포넌트(`WeatherContainer`) 모두에서 사용되기 때문에 공통 타입으로 분리했다.

```Tsx
// types/weather.ts
// 기상청 API 응답 객체 타입 정의
export interface WeatherData {
    temperature: string;
    tmx: string;
    tmn: string;
    humidity: number;
    wind: number;
    PTY: number;
    SKY: number;
    LGT: boolean; // 0/1 대신 boolean으로 변환해서 사용
    location: string;
    iconName: string;
}
```

이제 이 객체를 사용하는 파일들의 확장자도 바꿔줘야 한다. JSX를 리턴하는 컴포넌트라면 `.tsx`로, 일반 서버 로직이라면 `.ts`로 변경한다.

<figure>
    <img src="/images/ts_1.png" alt="tsx로 바꾼 후 보이는 컴파일러 에러들(빨간 줄)">
    <figcaption>확장자를 <code>.tsx</code>로 변경하자마자 빨간 줄(컴파일 에러)이 반겨준다.</figcaption>
</figure>

이제부터는 인내의 시간이다. 내가 설계한 타입에 맞게 하나씩 오류를 수정해 나가면 된다.

## Props와 타입의 세계
Typescript를 사용하면서 React의 `props`를 다루는 방식이 더 엄격해졌다. JS 시절엔 대충 넘겼던 객체 구조를 명확히 정의해야 한다.

예를 들어 `WeatherContainer.tsx`가 `WeatherWidget.tsx`에게 `data`를 넘겨주는 상황을 보자.
React에서 `props`는 그 자체로 하나의 **객체**다. 따라서 자식 컴포넌트에서는 내가 사용하고자 하는 변수명(key)을 감싸는 인터페이스를 한 번 더 만들어줘야 한다.

```Tsx
// [Parent] WeatherContainer.tsx
export default async function WeatherContainer() {
    const data = await getWeather({ ... })
    
    // 여기서 props라는 택배 상자에 'initialData'라는 이름으로 data를 담아 보낸다.
    return (
        <div className="w-full">
            <WeatherWidget initialData={data} />
        </div>
    )
}

// [Child] WeatherWidget.tsx
// props는 객체이고, 내가 구조분해 할당으로 꺼낼 건 initialData라는 키값이다.
// 따라서 타입을 한 번 더 감싸줘야 한다.
interface WeatherWidgetProps {
    // 데이터가 로딩 실패하거나 없을 경우 null이 올 수 있음을 명시
    initialData: WeatherData | null;
}

export default function WeatherWidget({ initialData }: WeatherWidgetProps) { ... }
```

또한 `useState`를 사용할 때도 제네릭을 이용해 타입을 명시해야 한다. 초기값인 `initialData`는 `WeatherData`일 수도, `null`일 수도 있기 때문이다.

```Tsx
const [weather, setWeather] = useState<WeatherData | null>(initialData);
```

### Nullable 처리에 대한 고찰
JS/TS 생태계에서 `?`(Optional)와 `null`의 차이는 미묘하지만 중요하다.
Kotlin에서는 `?`를 붙이면 Nullable이 되지만, JS/TS에서 `?`는 값이 없을 경우 `undefined`가 된다.

명시적으로 "데이터가 없다"거나 "실패했다"를 표현할 때는 `undefined`보다 `null`이 더 적합하다고 판단했다. 그래서 `initialData?: WeatherData` 대신 `initialData: WeatherData | null`을 사용하여 타입을 정의했다.

또한 `|`와 `||`의 차이점도 명확히 알게 되었다.
*   **`|` (Union Type):** Typescript의 문법. "A 타입이거나 B 타입일 수 있다"는 <b>정의(Definition)</b>의 영역.
*   **`||` (Logical OR):** Javascript의 문법. "앞의 값이 없으면 뒤의 값을 써라"는 <b>실행(Runtime)</b>의 영역.

```Tsx
// 타입 세계 (|): 데이터나 null만 들어갈 수 있는 박스다.
// 실행 세계 (||): 초기값이 undefined면 null로 바꿔서 넣어라.
useState<WeatherData | null>(initialData || null);
```

## 왜 Class 대신 객체 리터럴({})을 쓸까?
Java나 Kotlin을 하다가 넘어오면 가장 어색한 부분이 바로 이 지점이다. 보통 데이터를 담는 객체(DTO)를 만들 때 `Class`를 정의하고 `new PostData()` 처럼 생성해서 쓰는 게 익숙하다.

하지만 이번 리팩토링 과정에서 나는 `interface`와 객체 리터럴(`{}`) 조합을 사용했다.

```Tsx
// Class 대신 Interface 사용
export interface PostData {
    id: string;
    title: string;
    // ...
}

// new 없이 바로 객체 반환
return {
    id: "1",
    title: "제목",
} as PostData;
```

이유는 크게 세 가지다.

1.  **구조적 타이핑 (Structural Typing):** Typescript는 명목적 타이핑(Java)과 달리, "모양"만 같으면 같은 타입으로 인정한다. 굳이 클래스 인스턴스일 필요가 없다.
2.  **직렬화 (Serialization):** 이게 가장 크다. Next.js에서 서버 컴포넌트의 데이터를 클라이언트로 넘길 때 데이터는 JSON으로 직렬화된다. 이때 Class의 메서드는 모두 제거되고 멤버 변수만 남는다. 어차피 메서드가 사라질 운명이라면 처음부터 가벼운 객체 리터럴로 다루는 게 효율적이다.
3.  **번들 사이즈:** `interface`는 컴파일되면 코드에서 100% 사라진다. 반면 `class`는 JS 코드로 변환되어 남는다. 불필요한 런타임 오버헤드를 줄일 수 있다.

결국 "데이터 전송"이 주목적인 웹 프론트엔드 환경에서는 무거운 Class보다 가벼운 Interface가 훨씬 적합하다는 결론을 내렸다.

