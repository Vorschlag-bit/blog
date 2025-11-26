---
title: "React Hooks의 3가지(useState, useEffect, useRef) 조사"
date: "2025-11-26 06:42:10"
category: "React"
description: "React의 대표적인 Hook 3가지(useEffect, useState, useRef)에 대해서 알아보자."
---

## React 3개 Hook 핵심 정리
### 들어가며
블로그의 상세 페이지 **목차**와 **리모컨** 기능을 구현하면서, React 핵심 동작원리를 깊게 공부하게 되었다.\
단순히 기능 구현을 넘어서, 성능 최적화와 **생명주기**(LifeCycle)을 이해하는 게 프론트의 핵심이라 생각해서
이를 어떻게 관리했는지 작성하는 글.

### 1. 상태관리의 기본: useState
- 역할: 컴포넌트가 기억해야 할 데이터 저장소\
이전의 클래스 컴포넌트에서만 가능했던 **상태관리**를 함수형 컴포넌트에서도 할 수 있게 만들어진 Hook이다.\
React 16.8 이전에는 상태가 필요할 경우 클래스 컴포넌트로 작성해야했으나, Hooks의 등장으로 함수형 컴포넌트
에서도 다룰 수 있게 되었다.

- 사용법
```javascript
const [count, setCount] = useState(0)
```
`useState`는 **배열**을 반환하는데, 첫 번째 요소로는 현재 상태값, 두 번째 요소로는 상태를 업데이트하는 함수를 반환한다.
상태가 변경되면 컴포넌트는 **자동으로** 리랜더링된다.

**주요 사용처**
1. 사용자의 입력값 저장 (폼 데이터, 검색어 등)
2. UI 상태관리 (모달 창 열림/닫힘, 탭 선택 등)
3. 카운터, 토글 같은 간단한 상태
4, API 응답 저장용

- 내 블로그에서 사용 예시
```javascript
// 목차 리스트 상태관리
const [headings, setHeadings] = useState([])
// 현재 보고 있는 헤딩 ID
const [activeId, setActiveId] = useState("")
```

**1. `headings`**\
본문에서 긁어온 목차리스트이다. 이게 바뀌면 화면의 목록이 다시 그려진다(리렌더링)\
초기값을 배열로 둔 이유는 이후 함수에서 headings를 `map` 함수를 통해 순회하게 되는데, 이때 만약 배열이 아니라
`null`이나 빈 값을 둔다면 **TypeError**을 반환할 수 있고 이는 아무런 화면이 안 나오는 치명적인 에러로 이어질 수 있기 떄문에
빈 배열을 두어서 `map` 함수를 실행하되 아무런 행동을 하지 않고 이후 useEffect로 데이터를 채워넣은 후에 다시 리렌더링을 안전하게
수행할 수 있게 했다. 

**2. `activeId`**\
현재 보고 있는 섹션의 ID. 이게 바뀌면 해당 목차의 글씨가 파란색으로 바뀐다.\
초기값을 빈 문자열로 둔 이유는 **데이터 타입 일치** 때문이다. HTML 태그에 `id` 값은 항상 **문자열**이기 때문에
웹페이지에 처음 들어온 상태는 아직 스크롤을 하지 않았어서 아무것도 선택되지 않았음을 표현하기 위함이었다.
물론 `null`을 두어도 상관은 없으나 이후 타입 비교(===)를 사용할 때 타입이 꼬이지 않기 위해 빈 문자열을 넣었다.


#### 자주 사용되는 useState 초기값 정리
useState 초기값으로 자주 사용되는 값들과 그 용도에 대해서 표로 정리해봤다.

| 형태 | 코드 예시 | 사용 예시들 | 이유 |
| :--- | :--- | :--- | :--- |
| **빈 배열** | `useState([])` | 목록, 리스트, 게시글 목록 | `map`, `filter` 함수를 바로 써도 에러가 안 나게 하기 위해 |
| **빈 문자열** | `useState("")` | 검색어, ID, 사용자 입력값 | 텍스트 데이터를 다룰 때 타입 충돌을 막기 위해 |
| **숫자 0** | `useState(0)` | 카운터, 인덱스, 개수 | 덧셈, 뺄셈 등 수학 계산을 바로 하기 위해 |
| **Boolean** | `useState(false)` | 모달창 열림/닫힘, 로딩중 여부 | `true/false` 스위치 역할을 할 때 |
| **Null** | `useState(null)` | 사용자 정보(User), API 데이터 | "아직 데이터가 도착 안 함"을 명확히 구분해야 할 때 |

### 2. 부수 효과 관리자: useEffect
- 역할: 컴포넌트가 리렌더링된 **직후**에 해야할 일들(DOM 조작, 구독, 타이머)을 처리\
useEffect는 클래스 컴포넌트의 생명주기 메서드(componentDidMount, componentDidUpdate, componentWillUnmount)를
하나의 API로 통합하여 더 간결하게 사용할 수 있도록 만들어졌다. 렌더링과 직접 관련이 없는 작업들을 안전하게 처리할 수 있는 장소를 제공한다.

- 사용법
```javascript
useEffect(() => {
    // 부수 효과 실행
    console.log('컴포넌트가 렌더링')

    // 정리(cleanup) 함수 (선택적)
    return () => {
        console.log('컴포넌트가 언마운트되거나 재실행 전에 실행')
    }
}, [dependencies]) // 의존성 배열
```
**의존성 배열의 역할**
- `[]` 빈 배열: 컴포너트가 마운트 시 **한번만** 실행
- `[value]` : **value가 변경될 때마다** 실행
- 생략: **매 렌더링마다** 실행

**주요 사용처**
1. API 호출 및 데이터 fetching
2. DOM 직접 조작
3. 타이머 설정 (setTimeout, setInterval)
4. 이벤트 리스너 등록/해제
5. 외부 라이브러리와의 연동
6. 로컬 스토리지 접근
7. 구독 설정

- 내 블로그 사용 예시
```javascript
// 1. 헤딩 태그 id 찾기 
useEffect(() => {
    // 본문이 들어가있는 태그를 선택
    const contentArea = document.querySelector(".prose")

    if (!contentArea) return;

    // h2,h3 태그 수집
    const elements = contentArea.querySelectorAll("h2, h3")

    const headingData = []

    elements.forEach((el, index) => {
        headingData.push({
            id: el.id,
            text: el.innerText,
            // "H2", "H3"
            level: el.tagName,
            element: el,
        })
    }
    )

    setHeadings(headingData)

    // IntersectionObserver 로직...

    // CleanUp: 컴포넌트가 사라지면 감시 중단
    return () => {
        if (observerRef.current) observerRef.current.disconnect()
    }
}, []);
```

**1. DOM 직접 접근과 데이터 추출**\
React는 가상 DOM(Virtual DOM)을 사용해 화면을 그리지만, 실제 HTML 태그(`<h2>`, `<h3>`)의 위치나 속성을 가져오려면
브라우저의 실제 DOM에 접근해야 한다. `useEffect`는 컴포넌트가 화면에 **Mount된 직후**에 실행되므로, `document.querySelector`를 통해
안전하게 `.prose` 영역을 찾고 내부 헤딩 태그들을 수집할 수 있는 타이밍을 제공해준다.

**2. 의존성 배열([])의 의미**
이 로직에 의존성 배열을 빈 배열로 둔 이유는 **효율성** 때문이다.\
블로그 글의 본문 내용은 사용자가 페이지에 들어온 뒤로 변하지 않는다.(Static) 따라서 헤딩 태그들을 수집하고 `Observer`를 등록하는 무거운 작업은
**페이지가 처음 뜰 때 딱 한 번만** 수행하면 된다. 만약 배열을 생략했다면 상태(`activeId`)가 바뀔 때마다 불필요하게 DOM을 다시 탐색해서 성능 저하가 발생했을 것이다.

**3. CleanUp 함수와 메모리 누수 방지**\
`return` 문에 작성된 `Observer.disconnect()`는 컴포넌트가 화면에서 사라질 때(Unmount) 실행된다.\
만약 이 뒷정리를 생략한다면, 사용자가 다른 페이지에 이동한 뒤에도 브라우저는 여전히 스크롤 이벤트를 감시하려고 할 것이고, 이는 **메모리 누수**로 이어져 브라우저가 느려질 수도 있는 원인이 될 것이다. 따라서 사용이 끝난 `Observer`는 반드시 연결을 끊어주자.

### 3. 변하지 않는 저장소: useRef
- 역할: 리렌더링을 유발하지 않는 변수 저장소 + DOM 요소 접근\
useRef는 **렌더링에 영향을 주지 않으면서 값을 기억하거나 DOM 요소에 직접 접근**하기 위한 Hook이다.\
즉 2가지 목적을 갖고 만들어졌다.\
**1. DOM 요소에 직접 접근하기** - 클래스 컴포넌트의 `createRef()`를 함수형 컴포넌트에서도 사용 가능하게 한다.\
**2. 렌더링과 무관한 값 저장하기** - 값이 변경되어도 리렌더링을 트리거하지 않는 저장소를 제공한다.

#### useState와의 차이점
```javascript
// useState: 값이 변경되면 컴포넌트 재렌더링
const [count, setCount] = useState(0);
setCount(1); // 재렌더링 발생!

// useRef: 값이 변경되어도 재렌더링 안 됨
const countRef = useRef(0);
countRef.current = 1; // 재렌더링 발생 안 함!
```
useState는 모두 알아차리는 공공연한 값이라면 useRef는 private한 값이라고 생각하면 될 거 같다.

- 내 블로그 사용 예시
```javascript
// Observer를 저장할 ref (cleanup)
const observerRef = useRef(null)

// 2. IntersectionObserver로 현재 위치 감지 로직 구현
const handleObserver = (entries) => {
    entries.forEach((entry) => {
        // 헤딩이 화면의 특정 영역에 들어오면 activeId 변경
        if (entry.isIntersecting) {
            setActiveId(entry.target.id)
        }
    })
}

// rootMargin: '-10% 0px -80% 0px'
// -> 화면 상단 10 - 20 % 사이 좁은 구역을 지나갈 때만 감지
observerRef.current = new IntersectionObserver(handleObserver, {
    rootMargin: "-10% 0px -80% 0px",
    threshold: 0,
})

headingData.forEach((heading) => {
    observerRef.current.observe(heading.element)
})
```

**1. 불필요한 리렌더링 방지**\
`IntersectionObserver` 객체는 스크롤 감지라는 **기능**을 수행할 뿐, 그 객체 자체가 화면에 그려지는 UI는 아니다.\
만약 이를 `useState`에 저장했다면, 옵저버가 생성(`new IntersectionObserver`)되는 순간 `setObserver`가 실행되어
불필요한 리렌더링이 한 번 더 발생했을 것이다. `useRef`는 값이 할당되어도 리렌더링을 유발하지 않기 때문에 이런
**보이지 않는 기능성 객체**를 담아두기에 가장 적합하다!

**2. 컴포넌트 생명주기 동안 값 유지**\
만약 옵저버를 일반 변수(`let Observer`)로 선언했다면, 컴포넌트가 리렌더링될 때마다 변수가 초기화되어 감시 연결이 끊기거나, 새로운
옵저버가 계속 생성되는 문제가 발생했을 것이다.\
`useRef`는 컴포넌트가 마운트 해제될 때까지 그 값을 **기억**하기 때문에 `useEffect` 내부에서 생성된 옵저버 객체를 안전하게 보관했다가,
나중에 컴포넌트가 사라질 때(CleanUp 시점) `observe.current`로 접근해 `disconnect` 할 수 있었다.


### 마치며
블로그를 개발하면서 React와 기본 프론트 지식들을 차곡차곡 쌓아가는 게 맘에 든다.\
DOM의 생명주기를 예전에 공부하다가 말아서 기억이 가물가물한데 다음 번에는 이러한 기초 지식들을 공부해서 정리해야겠다.\
개발과 학습을 병행하다보니 하루 너무 짧다. 하지만 세세하게 개발한 내용에 대한 기록을 하지 않는다면\
개발하고 딱히 남는 게 없었던 적이 많았어서 스스로 정리하는 시간을 꼭 지키고 싶다!
