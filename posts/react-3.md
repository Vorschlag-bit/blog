---
title: "컴포넌트 생명주기(LifeCycle)와 상태(State)"
date: "2025-12-23 16:14:34"
category: "React"
description: "React의 핵심인 생명주기와 상태(State), 그리고 흔히 겪는 실수들"
---

## 컴포넌트는 순수 함수(Pure Function)이다.
React를 관통하는 가장 중요한 수학 공식이 존재한다.  
$$ UI = f(state) $$  
즉 <b>UI는 상태를 인자로 받아 화면(UI)을 출력하는 함수</b>라는 뜻이다.

### 순수 함수의 조건
React의 함수형 컴포넌트는 <b>순수 함수</b>처럼 동작하도록 설계되어 있다.  
1. <b>동일한 입력(Props, state)</b>이 들어오면 항상 <b>동일한 출력(JSX)</b>을 반환한다.
2. 함수 내부에서 외부의 변수를 바꾸거나, API를 호출하는 등 <b>부수 효과(Side Effect)</b>가 없어야 한다. (특히 렌더링 도중에)

### 왜 React StrictMode는 두 번 실행될까?
개발 모드에서 <code>console.log()</code>가 두 번 찍히는 걸 본 적이 있을 것이다. 이건 버그가 아니다.  
React는 개발자가 구현한 컴포넌트가 정말로 순수 함수로 동작하는지 검사한다. 만약 두 번 실행했을 때 결과가 다르거나 외부 변수가 엉망이 된다면, 그건 <b>순수하지 않은(Impure)</b> 컴포넌트이므로 수정해야 한다.

---

## State는 '스냅샷(Snapshot)'이다.
React를 처음 접하면 `useState`를 일반 변수처럼 생각하기 쉽다. 하지만 `useState`는 일반적인 변수와 완전히 다르다.

### 변수 vs State: 기억의 원리
일반적인 자바스크립트 함수 내의 변수(`let`, `const`)는 함수 실행이 끝나면 메모리에서 사라진다(증발). 
하지만 컴포넌트는 렌더링이 끝나도 그 값을 **기억**해야 한다.

React는 컴포넌트 함수가 다시 실행(리렌더링)되더라도 값을 유지하기 위해, <b>React 내부의 별도 저장소(Fiber Node)</b>에 값을 저장해둔다. 그리고 컴포넌트가 다시 호출될 때, 저장해둔 값을 꺼내서 반환해준다. 이것이 `useState`가 값을 <b>기억(Memoization)</b>하는 원리다.

### 스냅샷의 의미
React에서 <b>"렌더링한다"</b>는 의미는 곧 <b>"그 시점의 데이터를 사진 찍어서(Snapshot) 보여준다"</b>는 의미와 같다.

아래 코드를 보자. 버튼을 한 번 클릭하면 `number`는 몇이 될까?

```jsx
function Counter() {
    const [number, setNumber] = useState(0);

    return (
        <button onClick={() => {
            setNumber(number + 1);
            setNumber(number + 1);
            setNumber(number + 1);
        }}>
        {/* +3이 될까? 아니면 +1이 될까? */}
        </button>
    )
}
```

<b>정답은 1이다</b>. 3이 아니다.

#### 왜 이런 일이 발생할까?
렌더링 시점에서 `number`는 <b>0</b>으로 고정되어 있다. (스냅샷)  
사용자가 버튼을 클릭했을 때 실행되는 코드는 사실상 아래와 같다.

1. `setNumber(0 + 1)` -> React에게 "다음 렌더링 때 1로 바꿔"라고 요청
2. `setNumber(0 + 1)` -> React에게 "다음 렌더링 때 1로 바꿔"라고 요청
3. `setNumber(0 + 1)` -> React에게 "다음 렌더링 때 1로 바꿔"라고 요청

자바스크립트 실행 시점에서 `number`라는 변수는 계속 <b>0</b>인 상태이다. React는 들어온 주문들을 처리하고, 결과적으로 다음 렌더링 때 <b>1</b>을 보여줄 뿐이다.

이를 해결하기 위해선 <b>함수형 업데이트(Functional Update)</b>를 사용해야 한다.  
`setNumber(prev => prev + 1)`처럼 작성하면, React에게 "값을 1로 덮어써"가 아니라 <b>"이전 값을 가져와서 1을 더해"</b>라는 <b>명령(Instruction)</b>을 큐에 등록하게 된다.

---

## State 업데이트는 비동기처럼 보인다 (Batching)

### Batching이란?
React는 성능을 위해 `setState`가 호출될 때마다 즉시 렌더링하지 않는다.  
음식점에서 웨이터가 주문을 하나 받을 때마다 주방으로 뛰어가지 않고, 주문을 모아서 한 번에 전달하는 것과 같다. 이를 <b>Automatic Batching</b>이라 한다.

### 개발자가 겪는 문제 (Troubleshooting)
내가 직접 날씨 정보를 불러오는 기능을 만들면서 겪은 일이다.  
API로 데이터를 받아와서 `setWeather`로 상태를 업데이트하고, 바로 그 밑에서 콘솔 로그를 찍어보았다.

```javascript
const [weather, setWeather] = useState(null);

const fetchWeather = async () => {
    const data = await getAPI(); // 데이터 수신 완료
    
    // 1. 상태 업데이트 요청
    setWeather({ ...data }); 
    
    // 2. 확인 로그
    console.log("업데이트 직후 로그: ", weather); 
}
```

<figure>
    <img src="/images/state_1.png" alt="setWeather 직후 null이 찍힌 모습">
    <figcaption>분명 데이터를 넣었는데 null이 나온다.</figcaption>
</figure>

#### 원인: 업데이트 큐(Update Queue)
`setWeather`는 <b>"화면을 갱신해달라"는 요청을 큐(Queue)에 넣는 행위</b>일 뿐이다.  
아직 함수(컴포넌트)가 새로 <b>실행(리렌더링)</b>되지 않았다. 현재 실행 중인 `fetchWeather` 함수 안에서 `weather` 변수는 여전히 옛날 값(`null`)을 가리키고 있다.

변경된 값을 확인하고 싶다면?
1. <b>`useEffect` 사용:</b> `weather`가 바뀌어서 리렌더링이 완료된 시점을 감지한다.
2. <b>지역 변수 활용:</b> `data` 변수 자체를 확인한다.

### 심화: useEffect 무한 루프의 함정
`weather` 값이 바뀌는 것을 감지하기 위해 무심코 아래와 같이 코드를 짰다가 브라우저가 멈출 뻔했다.

```javascript
// ❌ 잘못된 코드: 무한 루프 발생
useEffect(() => {
    fetchWeather(); // 내부에서 setWeather를 호출함
}, [weather]); // weather가 바뀌면 다시 실행
```

1. `fetchWeather` 실행 -> `setWeather` 호출
2. State 변경 -> **리렌더링**
3. `useEffect`가 의존성 배열(`[weather]`) 검사
4. **객체는 매번 새로운 참조값(주소)을 가짐** -> "어? 값이 바뀌었네?" -> 다시 `fetchWeather` 실행
5. (무한 반복)

따라서 데이터를 가져오는(Fetching) 로직은 데이터 자체가 아니라, <b>"마운트 시점(`[]`)"</b>이나 **"검색 조건이 바뀌었을 때(`[location]`)"** 실행되도록 해야 한다.
