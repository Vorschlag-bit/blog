---
title: "렌더링 최적화(Optimization)"
date: "2025-12-26 21:26:07"
category: "React"
description: "렌더링 최적화에 자주 쓰이는 훅들(useMemo, useCallback, React.memo)에 대해서 알아보자."
---
<img src="/images/react_icon.svg" alt="React 로고" width="400" height="400" />

## 1. React가 렌더링되는 조건(복습)
React 컴포넌트는 언제 다시 그려질까?
- 1. <b>State</b>가 바뀔 때
- 2. <b>Props</b>가 바뀔 때
- 3. <b>부모 컴포넌트</b>가 바뀔 때 (자식 컴포넌트도 함께 모두 다시 그려짐)

3번의 조건은 유일하게 해당 컴포넌트가 직접적인 변화가 아닌 상태임에도 화면이 다시 그려지는 상황이다.  
부모가 리렌더링된다고 반드시 모든 자식까지 리렌더링해야 하는 상황이 항상 있을까? 아닐 것이다.
## 2. React.memo
자식 컴포넌트 입장에서 받은 데이터(Props)는 그대로인데 화면을 다시 그려야 하는 경우, 매우 큰 손해일 것이다.  
이럴 때 사용하는 것이 바로 `React.memo`이다.

```Jsx
// 자식컴포넌트
function Child({ name }) {
    console.log(`자식 컴포넌트 렌러딩`);
    return <div>{name}</div>
}

// React.memo 사용 예시 (props가 바뀌지 않으면, 자식에게 화면을 그대로 유지하기 위함)
export const MemorizedChild = React.memo(child)
```
위의 코드와 같이 `React.memo`는 부모가 아무리 리렌더링되어도 props(여기선 `name`)가 바뀌지 않았다면 자식 컴포넌트는 다시 그려지지 않는다.

## 3. useMemo & useCallback
하지만 `React.memo`에는 치명적인 약점이 있다. 바로 <b>자바스크립트의 참조타입(객체,배열,함수) 문제</b>이다.  
### 객체는 매번 새로 만들어진다.
```Jsx
function Parent() {
    // 변수명은 같지만, 주소값은 매번 다른 객체가 매번 생성됌.
    const user = { name: 'John doe' }

    const handleClick = () => { console.log(`클릭`); // 함수도 마찬가지, 매번 새로 만들어진다.

    return <MemorizedChild user={user} onClick={handleClick} />
    }
}
```
`React.memo`를 활용한 위와 같이 작성된 코드가 있다고 가정해보자.  
부모가 리렌더링되면 `user` 객체와 `handleClick` 함수는 매번 새롭게 생성된다. `React.memo`는 이들에 대해서 <b>주소값</b>을 기반으로 판별하기 때문에
다른 데이터라고 판단하고 결국 <b>자식까지 다 새로 리렌더링</b>할 것이다. (최적화 실패)

이럴 때 사용하는 것이 바로 `useMemo`와 `useCallback`이다.

## 4. useMemo: Value를 얼리기
```Jsx
// 렌더링되도 다시 안 만듦. (의존성 배열의 값에만 영향받음)
const user = useMemo(() => ({ name: 'John doe' }),[])
```
useMemo는 보통 객체에 대한 캐시를 보관할 때 사용한다. 내 블로그의 검색 모달을 개발할 때도 검색 엔진 객체인 `Fuse`와 검색 결과 객체(`results`)를
useMemo로 사용해서 검색 엔진 자체 생성비용이라는 큰 비용과 이미 찾아놓은 결과에 대한 재연산(결과 리스트가 나왔다고 사라질 때 검색어가 같다면 그대로 사용)을 방지했다.

```Jsx
const fuse = useMemo(() => {
    return new Fuse(posts, {
        keys: [
            { name: 'title', weight: 1 },       // 가중치 1
            { name: 'content', weight: 0.3 },   // 가중치 0.3
            { name: 'category', weight: 0.5 }
        ],
        includeScore: true, // 유사도 점수 포함
        threshold: 0.4
    })
}, [posts])

// 검색어 결과에 따라 필터링
const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query).map(result => result.item);
}, [query, fuse])
```


## 5. useCallback: Function을 얼리기
```Jsx
// 렌더링 돼도 함수 재생성하지 않고 재사용
const handleClick = useCallback(() => {
    console.log(`Click!`);
},[])
```

이런 식으로 값(`useMemo`) 혹은 함수(`useCallback`)를 `React.memo`에게 넘겨주면 React는 다시 자식에 대한 리렌더링을 하지 않게된다.

## 6. 최적화의 대원칙: 아직은 하지 말자
그렇다고 무턱대고 모든 함수를 `useCallback`으로 감싸게 되면 어떻게 될까? <b>최적화는 결코 공짜가 아니다</b>.  
Memorization 역시 결국 <b>메모리에 저장하고 비교하는 연산을 수행하는 비용</b>이 든다.  
가벼운 컴포넌트(단순한 구조, `<div>` 몇 개로 구성된)는 그냥 다시 그리는 게 저장/비교 연산 로직보다 저렴할 수도 있다.

그렇다면 언제 사용하는 게 올바를까? 몇 가지 대표적인 예시들이 존재한다.  
1. <b>화면이 버벅일 때 (Profilling 후)</b>  
2. <b>데이터 시각화(차트, 그래프)처럼 한 번 그리는 비용이 비싼 컴포넌트일 때</b>  
3. <b><code>useEffect</code>의 의존성 배열에 객체나 함수를 넣어야 할 때 (무한 루프 방지)</b>  