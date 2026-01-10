---
title: "Typescript 도입기: 안정적인 블로그 운영을 위한 선택"
date: "2026-01-09 13:33:28"
category: "개발"
description: "Javascript로 작성된 블로그를 Typescript로 리팩토링하며 겪은 시행착오와 배운 점들을 기록한다."
---

## 서론: 이젠 진짜 해야 한다
새로운 기능 추가보다 블로그 리팩토링에 힘을 쏟기로 결정한 순간부터, Typescript 도입은 선택이 아닌 필수였다.

현재 블로그는 순수 Javascript(JS)로 구성되어 있다. JS의 동적 타입 결정 방식은 프로젝트 초기에는 빠른 개발 속도와 유연함을 제공했지만, 프로젝트 규모가 커질수록 이 '유연함'은 독이 되어 돌아왔다. 언제 어디서 `undefined`가 튀어나와 런타임 에러를 일으킬지 모르는 불안감을 안고 운영할 수는 없었다.

과거 Kotlin으로 앱 개발을 했을 때 느꼈던 정적 타입 언어의 안정감—컴파일 단계에서 에러를 잡아주는 든든함—이 그리웠다. JS에 Typescript(TS)를 얹는 것은 Kotlin과 매우 유사한 개발 경험을 제공해 줄 것이라 확신했다.

이 글은 JS 기반의 블로그를 TS로 마이그레이션 하며 마주친 문제들과 해결 과정을 담은 기록이다.

## 도입 과정과 고찰

### 1. 종속성 설치 및 설정
먼저 Typescript와 React 환경에 필요한 타입 정의 패키지들을 설치했다.

```zsh
npm install -D typescript @types/react @types/node @types/react-dom
```

각 패키지의 역할은 다음과 같다.
*   `typescript`: TS 코드를 브라우저가 이해할 수 있는 JS로 변환해주는 핵심 컴파일러.
*   `@types/react`: React의 컴포넌트, Hook, 이벤트 등에 대한 타입 정의 파일.
*   `@types/node`: Node.js 내장 모듈(`fs`, `path` 등) 사용을 위한 타입 정의.
*   `@types/react-dom`: DOM 엘리먼트 조작을 위한 타입 정의.

설치 후 루트 디렉토리에 빈 `tsconfig.json` 파일을 생성하고 `npm run dev`를 실행하면, Next.js가 이를 감지하고 권장 설정값으로 파일을 자동으로 채워준다.

<figure>
    <img src="/images/ts_i.png" alt="typescript 설치하고 개발 서버 구동 시, tsconfig.json 자동생성되는 사진">
    <figcaption>터미널에서 <code>tsconfig.json</code>가 생성되었다는 메시지를 확인할 수 있다.</figcaption>
</figure>

<figure>
    <img src="/images/tsconfig.png" alt="tsconfig.json 내용">
    <figcaption>Next.js가 프로젝트 환경에 맞게 자동으로 설정을 구성해준다.</figcaption>
</figure>

### 2. 타입 관리 전략 (types 폴더 vs Co-location)
환경 설정 후 가장 먼저 한 일은 '데이터의 생김새'를 정의하는 것이었다. 이는 마이그레이션의 핵심이자 가장 고된 작업이었다. 효율적인 관리를 위해 나만의 규칙을 세웠다.

1.  **공통 타입 (`/types`)**: 2개 이상의 컴포넌트나 페이지에서 공유되는 데이터(예: API 응답값)는 `/types` 폴더에 별도 파일로 분리한다.
2.  **지역 타입**: 특정 컴포넌트 내부에서만 사용되는 `props`나 `state` 타입은 해당 파일 내부에 정의한다.

예를 들어 기상청 API 응답값인 `WeatherData`는 서버 컴포넌트(데이터 fetch)와 클라이언트 컴포넌트(UI 렌더링) 모두에서 사용되므로 공통 타입으로 분리했다.

```tsx
// types/weather.ts
export interface WeatherData {
    temperature: string;
    humidity: number;
    SKY: number;
    LGT: boolean; // 0/1 대신 boolean으로 변환해서 사용
    location: string;
    // ...
}
```

이제 파일을 하나씩 `.js`에서 `.tsx`로 변경하면, 빨간 줄(컴파일 에러)의 향연이 시작된다. 이 빨간 줄들을 하나씩 지워나가는 것이 마이그레이션의 주된 업무다.

<figure>
    <img src="/images/ts_1.png" alt="tsx로 바꾼 후 보이는 컴파일러 에러들">
    <figcaption>확장자를 <code>.tsx</code>로 변경하자마자 수많은 타입 에러가 반겨준다.</figcaption>
</figure>

### 3. Props와 State의 엄격함
JS 시절에는 `props`로 무엇이 넘어오든 "알아서 잘 들어오겠지"라고 믿고 썼지만, TS는 용납하지 않는다. 부모가 자식에게 무엇을 줄지, 자식은 무엇을 받을지 명확한 계약(Interface)이 있어야 한다.

```tsx
// [Parent] WeatherContainer.tsx
export default async function WeatherContainer() {
    const data = await getWeather();
    // props라는 택배 상자에 'initialData'라는 이름표를 붙여 data를 담아 보낸다.
    return <WeatherWidget initialData={data} />;
}

// [Child] WeatherWidget.tsx
// 받는 쪽에서도 어떤 모양인지 정의해야 한다.
interface WeatherWidgetProps {
    // 데이터 로딩 실패 시 null이 될 수 있음을 명시 (Union Type)
    initialData: WeatherData | null;
}

export default function WeatherWidget({ initialData }: WeatherWidgetProps) {
    // useState 사용 시에도 제네릭으로 타입 명시
    const [weather, setWeather] = useState<WeatherData | null>(initialData);
    // ...
}
```

#### Nullable 처리에 대한 고찰 (`?` vs `null`)
여기서 `initialData?` (Optional)를 쓰지 않고 `| null`을 쓴 이유가 있다.
JS/TS에서 `?`는 값이 없을 때 `undefined`가 된다. 하지만 나는 "데이터 불러오기를 시도했으나 실패했음"을 명시적으로 표현하기 위해 `null`이 더 적합하다고 판단했다.

또한 Typescript의 <b>Union Type(`|`)</b>과 Javascript의 <b>Logical OR(`||`)</b>의 차이도 명확히 구분해야 했다.
*   **`|` (Type Definition):** "이 변수에는 A 또는 B가 들어갈 수 있다"는 **정의**의 영역.
*   **`||` (Runtime Logic):** "앞의 값이 없으면 뒤의 값을 써라"는 **실행**의 영역.

### 4. 왜 Class 대신 Interface인가?
Java나 Kotlin 배경이 있다면 데이터를 담는 객체(DTO)를 `Class`로 정의하는 게 익숙할 것이다. 하지만 이번 리팩토링에서는 전적으로 `Interface`와 객체 리터럴(`{}`)을 사용했다.

```tsx
// Class 대신 Interface 사용
export interface PostData {
    id: string;
    title: string;
}

// new PostData() 대신 객체 리터럴 반환
return { id: "1", title: "제목" } as PostData;
```

이유는 크게 세 가지다.
1.  **직렬화(Serialization) 이슈:** Next.js에서 서버→클라이언트로 데이터를 넘길 때 JSON 직렬화가 일어난다. 이때 Class의 메서드는 모두 사라지고 데이터만 남는다. 어차피 사라질 거라면 처음부터 가벼운 객체가 낫다.
2.  **구조적 타이핑:** TS는 명목적 타이핑(Java)과 달리 "생김새"만 같으면 같은 타입으로 인정한다. 굳이 인스턴스를 만들 필요가 없다.
3.  **번들 사이즈:** `interface`는 컴파일 시점에 사라지지만, `class`는 JS 코드로 변환되어 남는다.

### 5. 이벤트 객체와 DOM 요소 타입 정리
이번 마이그레이션에서 가장 헷갈렸던 부분이다. `onClick`에는 무슨 타입을 써야 하고, `useRef`에는 뭘 넣어야 할까?
결론부터 말하자면 <b>"누가 이벤트를 관리하느냐"</b>에 따라 사용하는 타입이 다르다.

#### (1) React 이벤트 vs Native 이벤트
*   **React 이벤트 (`React.ChangeEvent` 등):** JSX 태그(`input`, `button` 등) 안에서 `onClick`, `onChange` 등을 사용할 때 쓴다. React가 브라우저 간 호환성을 위해 한 번 감싼 이벤트다.
*   **Native 이벤트 (`MouseEvent` 등):** `useEffect` 내부에서 `addEventListener`를 통해 브라우저(Window, Document)에 직접 이벤트를 붙일 때 쓴다.

#### (2) 실전 예제: 검색 모달 구현
블로그의 검색 모달 기능을 TS로 옮기면서 이 차이를 명확히 이해했다.

```tsx
// 1. DOM 요소 접근용 ref
// 가장 바깥이 <div> 태그이므로 HTMLDivElement 명시
const containerRef = useRef<HTMLDivElement>(null);

// 2. 검색어 입력 핸들러 (JSX 내부)
// React가 관리하는 input 태그의 변경이므로 React.ChangeEvent 사용
const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
}

// 3. 모달 외부 클릭 감지 (JSX 외부)
// 브라우저 전체(document)에 붙이는 리스너이므로 Native Event인 MouseEvent 사용
useEffect(() => {
    function handleClickOutSide(event: MouseEvent) {
        // event.target은 기본적으로 EventTarget 타입이라 Node로 단언(Assertion) 필요
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    }
    
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
}, []);
```

#### 자주 사용하는 React 타입 요약표
개발하면서 자주 찾아보게 된 타입들을 정리해 보았다.

| 타입 이름 (Type) | 의미 (Meaning) | 주요 사용처 (Usage) |
| :--- | :--- | :--- |
| **`React.ReactNode`** | 화면에 그릴 수 있는 **모든 것** (JSX, 문자열, null 등). 가장 넓은 범위. | `children` prop (Layout, Provider 등) |
| **`React.ReactElement`** | 오직 **JSX 태그 객체**만 (`<div />` 등). 문자열 불가능. | 컴포넌트를 prop으로 넘길 때 (`icon={<Icon />}`) |
| **`JSX.Element`** | `ReactElement`와 유사. TS가 JSX를 해석한 결과물. | 컴포넌트의 return 타입 |
| **`React.CSSProperties`** | CSS 속성 객체 타입. (자동완성 지원) | `style` prop |
| **`React.ComponentProps<T>`** | 태그(T)가 가진 **모든 속성**을 추출. | 래퍼(Wrapper) 컴포넌트 제작 시 |
| **`React.Dispatch<SetStateAction<T>>`** | `useState`의 **setState 함수** 타입. | 자식에게 setState를 넘겨줄 때 |

### 6. API 응답 처리와 제네릭(Generics)
외부 API를 호출할 때, 응답받는 데이터의 모양은 매번 다르지만 "에러를 체크하고 JSON으로 파싱하는" 로직은 똑같다.
이럴 때 <b>제네릭(Generics)</b>을 사용하면 하나의 함수로 다양한 타입의 응답을 처리할 수 있다.

```tsx
/**
 * 제네릭 <T>를 사용하여 반환 타입을 호출 시점에 결정하는 함수
 */
const errorCheck = async <T>(res: Response, name: string): Promise<T> => {
    if (!res.ok) {
        throw new Error(`${name} API 요청 실패: ${res.status}`);
    }
    const text = await res.text();
    try {
        // JSON.parse 결과는 any이므로 T로 단언(Assertion)
        return JSON.parse(text) as T;
    } catch (error) {
        throw new Error('잘못된 형식의 응답');
    }
}

// 사용 시점에 <WeatherResponse>라고 타입을 알려준다.
const liveData = await errorCheck<WeatherResponse>(resLive, "초단기실황");
const fcstData = await errorCheck<WeatherResponse>(resFcst, "초단기예보");
```

이제 `liveData` 변수는 자동으로 `WeatherResponse` 타입으로 추론되어, 자동완성의 축복을 받을 수 있게 되었다.

## 마치며
처음에는 빨간 줄을 없애는 과정이 지루하고 고통스러웠다. 하지만 리팩토링이 진행될수록 코드를 작성하는 순간에 실수를 잡아주는 TS의 매력에 빠져들었다.

Typescript 도입은 단순한 언어 교체가 아니라, <b>"내 코드가 데이터와 상호작용하는 방식을 더 명확하게 정의하는 과정"</b>이었다. 이제 런타임 에러의 공포에서 벗어나, 좀 더 비즈니스 로직에 집중할 수 있는 환경이 갖춰졌다. 블로그 운영이 한결 쾌적해질 것 같다.