---
title: "동기화(Sync)와 참조(Ref)"
date: "2025-12-24 15:51:40"
category: "React"
description: "외부 세계와 소통하는 법(Effect)과 랜더링 없이 값을 저장하는 법(Ref)에 대해서 알아보자."
---
<img src="/images/react_icon.svg" alt="React 로고" width="400" height="400" />

## 1. useEffect는 수명주기 훅이 아니라 <b>"동기화"</b>다.
React를 처음 배울 때 `useEffect`를 클래스형 컴포넌트의 생명주기 메서드와 1:1로 매칭해서 외우곤 한다.

> 빈 배열(`[]`)을 넣으면 `componentDidMount`(처음 한 번만 실행)이고, 배열에 뭘 넣을 경우 `componentDidUpdate`(업데이트될 때 실행)이다.

틀린 건 아니지만, `useEffect`를 완전히 이해하지 못한 위험한 암기 방식이라고 생각한다.  
React 개발팀은 `useEffect`를 <b>LifeCycle Event</b>가 아니라 <b>Synchronization(동기화)</b>라고 정의한다.

### 1-1. 동기화의 의미
React는 세상을 2가지로 바라본다.
1. <b>React의 내부</b>: <code>props</code>, <code>state</code>, <code>context</code>와 같이 React가 변화를 감지하고 통제하는 것들
2. <b>React의 외부(External World)</b>: DOM, 서버 API, 타이머(<code>setTImeOut</code>), 브라우저 이벤트(<code>window.addEventListener</code>)와 같이 통제 불가능한 것들

`useEffect`는 <b>"React 내부의 상태가 바뀔 때마다, 외부 세계를 그 상태와 일치(Sync)시켜"</b>달라는 명령서와 같다.  
즉, "마운트 될 때 실행해"가 아니라 <b>"데이터가 바뀌었으니 외부랑 동기화를 다시 해"</b>가 정확한 해석이다.

### 1-2. 뒷정리(CleanUp) 함수
`useEffect` 내부에서 `return` 하는 함수를 react 코드를 보면 많이 볼 수 있다. 이걸 <b>CleanUp</b> 함수라고 부른다.
```Jsx
useEffect(() => {
    console.log(`1. 구독 시작 (연결)`); // Setup

    return () => {
        console.log(`2. 구독 취소 (뒷정리)`); // CleanUp
        
    }
})
```
예를 들어 `count`(State)의 값이 바뀌면 React는 다음과 같은 순서로 동작한다.
1. <b>React</b>: 바뀐 count로 화면을 다시 그린다. (Render)
2. <b>Effect</b>: <b>이전 Effect의 청소(CleanUp) 함수를 실행</b>한다.
3. <b>Effect</b>: <b>새로운 Effect를 실행(Setup)</b>한다.

새로운 값을 받기 위해 기존의 값을 갈아치는 거라고 생각하면 좋을 거 같다.

### 1-3. useEffect 예시: 날씨 어플의 경쟁상태(race condition) 해결하기
이 CleanUp 개념을 모르면 치명적인 버그를 만들 수 있다. 대표적인 예가 경쟁 상태다.

예를 들어 날씨 어플에서 빠르게 지역을 <b>서울->대구->부산</b> 순으로 클릭했다고 가정해보자.  
네트워크 상황에 따라 요청 순서와 도착 순서는 다를 수 있다.

- 요청: 서울(1) -> 대구(2) -> 부산(3)
- 도착: 서울(1) -> <b>부산(3)</b> -> <b>대구(2)</b> (대구의 응답이 늦게 도착)

이러한 상황에서 CleanUp 함수를 활용해 <b>"이미 지나간 요청의 결과는 무시"</b>하도록 만들 수 있다.
```Jsx
// Flag 패턴
useEffect(() => {
    let ignore = false; // 1. 플래그 변수 생성 (초기값 false)

    async function fetchWeather() {
        const result = await api.get(city)
        if (!ignore) {
            // 3. 응답이 왔을 때, ignore가 false인 경우에만 상태 업에이트
            setWeather(result)
        }
    }

    fetchWeather()

    return () => {
        // 2. 다음 Effect가 실행되기 전(혹은 Unmount 시) ignore를 true로 바꿈.
        ignore = true
    }
},[city]);
```
React 컴포넌트가 렌더링 될 때마다 함수는 매번 새로 실행된다. 즉, <b>렌더링마다 고유의 스코프(Scope)가 생성</b>된다.  

1. <b>첫 번째 렌더링(서울)</b>: <code>Scope_1</code> 생성 -> <code>ignore_1</code> 변수 생성.
2. <b>두 번째 렌더링(부산)</b>: <code>Scope_2</code> 생성 -> <code>ignore_2</code> 변수 생성.

뒷정리(CleanUp) 함수는 자신이 태어난 스코프(`Scope_1`)를 기억하고 있다(Closure).  
따라서 뒷정리 함수가 `ignore = true`를 실행하면, 오직 <b>첫 번째 렌더링의 변수(`ignore_1`)</b>만 `true`로 바뀌고, 현재 렌더링의 변수에는 아무런 영향을 주지 않는다.

따라서 위 함수는 아래와 같이 동작한다.  
1. **[서울]** 클릭 -> Effect 실행 (`ignore = false`) -> API 요청 시작.
2. 응답 오기 전 **[부산]** 클릭 -> **[서울]의 CleanUp 실행** -> [서울]의 `ignore`가 `true`로 변함.
3. **[부산]** Effect 실행 (`ignore = false`) -> API 요청 시작.
4. 뒤늦게 **[서울] API 응답 도착** -> `if (!ignore)` 체크 -> `ignore`가 `true`이므로 <b>무시됨(상태 업데이트 안 함)</b>.
5. **[부산] API 응답 도착** -> `if (!ignore)` 체크 -> `ignore`가 `false`이므로 **정상 반영.**


## 2. useRef는 랜더링을 일으키지 않는 상태 보관소
`useState`는 값이 바뀌면 화면도 바뀌는(리랜더링) 상태값이다.  
하지만 개발을 진행하면 분명 <b>값은 저장하고 싶으나 화면을 다시 그릴 필요는 없는</b> 경우가 종종 있다. 이럴 때 `useRef`를 사용하면 된다.

### 2-1. Ref VS State
<b>State</b>는 값이 변경될 경우 해당 컴포넌트 함수를 재실행한 후 화면을 갱신한다. 따라서 보통 UI 관련 데이터들을 집어넣게 된다.  
반면 <b>Ref</b>는 변경되도 아무런 일이 일어나지 않는다. 따라서 당연히 UI와 관련이 없는 데이터 혹은 DOM에 직접 접근할 경우에 사용된다.

<b>useRef 구조</b>  

$Ref\ =\ \{current:\ baseValue\ \}$

`useRef`는 단순히 `current`라는 속성을 가진 자바스크립트 객체를 반환한다.  
이 객체는 <b>컴포넌트가 살아있는 한 주소값이 변하지 않는다</b>.  

### 2-2. useRef 예시1: DOM 요소 직접 조작
가장 흔한 `useRef`의 사용 방법이다. React는 가상 돔을 통해서 화면을 그리지만,  
가끔은 <b>직접</b> 건드려야 할 때가 있다.

`input` 창에 커서를 주기(autofocus), 비디오의 재생/정지, 특정 요소의 스크롤 위치 조작이나 캔버스(Canvas) 그리기와 같은 상황에서
React는 직접 DOM을 조작한다.

아래 코드는 자동 커서를 줄 때 어떤 식으로 React가 돔을 직접 건드리는 보여주는 예제이다.
```Jsx
function TextInput() {
    // 1. Reft 생성
    const inputRef = useRef(null);

    const focusInput = () => {
        // 3. .current를 통해 실제 DOM API 호출. focus()는 브라우저가 input 태그에 기본으로 제공하는 기능
        input.current.focus();
    }

    return (
        <>
            {/* 2. 태그에 Ref 속성으로 연결 */}
            {/* React가 이 input을 화면에 그릴 때, inputRef.current에 실제 DOM을 넣어준다. */}
            <input ref={inputRef} type="text" /> 
            <button onClick={focusInput}>입력창으로 이동</button>
        </>
    )
}
```
즉, `useRef`는 React의 통제 구역인 가상 돔에서 벗어나 <b>브라우저의 실제 기능</b>을 빌려쓸 수 있게 해주는 역할을 수행한다.

### 2-3. useRef 예시2: 변수 유지하되 랜더링 막기
타이머 ID 저장, 이전 값(previous Value) 기억하기 등에 사용된다.  
```Jsx
// 잘못된 예: 컴포넌트 내부에 일반 변수 사용할 경우
function Timer() {
    let cnt = 0; // 랜더링될 때마다 0으로 초기화
    // ..
}

// 올바른 예: Ref 사용
function Timer() {
    const cntRef = useRef(0);

    const handleClick = () => {
        // 값이 변경되도 리랜더링 발생 x
        cntRef.current += 1;
        console.log(cntRef.current);
        
    }
}
```
만약 `let count = 0`과 같은 일반 변수를 사용했다면, 컴포넌트가 리랜더링을 할 때마다 변수가 다시 $0$으로 초기화되어 상태보존이 유지되지 않았을 것이다.  