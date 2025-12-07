---
title: "명령형(Imperative) VS 선언형(Declarative) 차이점 알아보기"
date: "2025-12-07 23:32:21"
category: "React"
description: "React의 가장 큰 특징인 선언형 프로그래밍에 대해서 알아보자."
---

<img src="/images/react_icon.svg" alt="react 아이콘 사진" width="400" height="400" />

## 선언형(Declarative) VS 명령형(Imperative)
> <strong>"어떻게(How)할지 일일이 명령할 것인가, 무엇(What)을 원하는지 선언할 것인가"</strong>

React는 **선언형** 프로그래밍 라이브러리이다. 보통 프로그래밍을 배운다고 말하면 **명령형** 프로그래밍에 대해서 배우게 된다.  
어떤 변수를 선언하고 해당 변수가 들어갈 함수를 구현할 때, 변수가 거칠 **과정**을 정확히 구현하는 것이 명령형 프로그래밍의 핵심이다.  
반면 선언형 프로그래밍은 **결과**를 중심으로 구현된다. 결과를 선언하면 내부 로직은 라이브러리가 최적화를 하는 셈이다.

### 코드로 보는 차이(UI에 리스트 추가)
버튼을 누르면 `[사과, 바나나]` 리스트를 화면에 보여주는 기능을 구현한다고 가정해보자.  
명령형 프로그래밍(Vanilla JS)으로 구현한다면 **DOM**을 직접 조작해야할 것이다.

```javascript
// 데이터
const fruits = ['Apple', 'Banana'];

// 1. 부모 요소를 찾는다 (선택)
const list = document.getElementById('fruit-list');

// 2. 데이터를 순회하며 하나씩 만든다 (과정)
fruits.forEach(fruit => {
  // 3. 요소를 생성한다
  const item = document.createElement('li');
  // 4. 텍스트를 넣는다
  item.innerText = fruit;
  // 5. 부모에 갖다 붙인다
  list.appendChild(item);
});
```
위와 같은 코드는 읽을 때 **어떤 UI가 나올지** 쉽게 예측이 가지 않는다. 또한 로직이 복잡해질 경우 `appendChild`, `removeChild`, `classList.add` 등이 뒤섞여서 스파게티 코드가 될 가능성이 크다.

반면 선언형 프로그래밍은 <strong>화면에 보여야할 상태(State)</strong>만 정의하면 된다.
```Jsx
function FruitList() {
    const fruits = ['사과', '바나나'];

    return (
        // 이 데이터로 이런 UI를 그리라고 '선언'
        <ul>
            {fruits.map(fruit => (
                <li key={fruit}>{fruit}</li>
            ))}
        </ul>
    );
}
```
위와 같은 코드는 `<ul>` 안에 `<li>`가 반복되는 구조가 한 눈에 보인다. **DOM을 어떻게 생성하고 붙일지**는 React가 알아서 수행할 것이다.
<strong>UI는 State(상태)의 반영이다.</strong>라는 말을 그대로 적용한다.

물론 JS 실력을 늘리기 위해서 바닐라 JS로 구현하는 능력도 있긴 해야겠지만, 아무래도 프론트엔드에서 가장 중요한 작업인 DOM 조작을 직접 수행한다는 것은
어지간한 개발 실력을 갖추지 않는 한 큰 위험을 갖게 된다고 생각한다.