---
title: "오차역전법에 대해서 알아보자"
date: "2026-01-19 22:17:32"
category: "딥러닝"
description: "순전파와 오차역전법은 무엇이 다른 걸까?"
---

## 오차역전법
앞 학습에서 신경망의 가중치 매개변수의 기울기(가중치 매개변수에 대한 손실 함수의 기울기)를 수치 미분을 통해서 구했다. <b>수치 미분은 단순하고 구현하기 쉬우나 계산 시간이 오래 걸린다는 게 단점</b>이다. 하지만 <b>오차역전법</b>을 사용하면 가중치 매개변수의 기울기를 효율적으로 계산할 수 있다.

### 계산 그래프
계산 그래프는 계산 과정을 표현한 그래프이다. 그래프는 컴퓨터 자료구조의 그래프로 여러 <b>node</b>와 <b>edge</b>로 구성된다. 계산을 그래프로 한다는 말은 뭔가 어색하다. 구체적으로 어떻게 하는 건지 실제 예시를 통해 알아보자.

> 문제 예시: 경석이는 슈퍼에서 1개에 100원인 호두를 2개 구매했다. 소비세 10%를 부과한 지불 금액은?

계산 그래프는 계산 과정을 노드와 화살표로 표현한다. 위 문제를 계산 그래프로 풀면 아래와 같을 것이다.

```mermaid
flowchart LR
    A[Walnut] -- 100 --> B((x 2))
    B -- 200 --> C((x 1.1))
    C -- 220 --> D((answer))
```
위 플로우 차트처럼 처음에 호두의 100원이 $x 2$ 노드로 흐르고, 200원이 된 후 다음 노드에 전달된다.
200원은 $x1.1$ 노드를 거쳐 220원이 되고 이게 최종 정답이다.

위 차트에선 $x2$와 $x1.1$을 각각 하나의 연산으로 취급했지만, 곱셉인 $x$만을 연산으로 생각할 수도 있다.

그렇게 되면 아래처럼 $2$와 $1.1$은 각각 '사과의 개수'와 '소비세' 변수가 되어 원 밖에 표기된다.

```mermaid
flowchart LR
    A[walnut] -- 100 --> Mul1((×))
    B[walnut count] -- 2 --> Mul1
    Mul1 -- 200 --> Mul2((×))
    C[tax] -- 1.1 --> Mul2
    Mul2 -- 220 --> D[answer]
```

좀 더 복잡한 문제에 대해서 시도를 해보자.

> 문제 예시: 경석이는 호두를 2개, 피스타치오를 3개 구매했다. 호두는 1개에 100원, 피스타치오는 1개에 150원이다. 소비세 10%를 포함한 지불금액은?

```mermaid
flowchart LR
    %% 입력 변수
    W[walnut]
    WC[walnut count]
    P[pistachio]
    PC[pistachio count]
    Tax[tax]
    Ans[answer]
    
    %% 연산자 노드
    Mul1((×))
    Mul2((×))
    Add((+))
    Mul3((×))

    %% 호두 계산 흐름 (상단)
    WC -- 2 --> Mul1
    W -- 100 --> Mul1
    Mul1 -- 200 --> Add

    %% 피스타치오 계산 흐름 (하단)
    P -- 150 --> Mul2
    PC -- 3 --> Mul2
    Mul2 -- 450 --> Add

    %% 합산 및 최종 계산
    Add -- 650 --> Mul3
    Tax -- 1.1 --> Mul3
    Mul3 -- 715 --> Ans
```

이 문제에선 덧셈 노드인 $'+'$가 새로 등장해 호두와 피스타치오의 금액을 합산한다. <b>계산 그래프는 왼쪽에서 오른쪽</b>으로 계산한다. 

지금까지 살펴본 것처럼 계산 그래프를 이용한 문제풀이는 아래의 흐름으로 진행한다.

1. 계산 그래프를 구성한다.
2. 그래프에서 계산은 왼쪽에서 오른쪽으로 진행한다.

이 2단계에서 왼쪽에서 오른쪽으로 진행하는 단계를 <b>순전파(forward propagation)</b>라고 한다.  
순전파는 계산 그래프의 출발점부터 종착점으로의 전파이다. 순전파의 반대, 즉 오른쪽에서 왼쪽으로의 전파는 <b>역전파(backward propagation)</b>라고 한다. 역전파는 미분을 계산할 때 중요한 역할을 한다.

#### 국소적 계산
계산 그래프의 특징은 '국소적 계산'을 전파함으로써 최종 결과를 얻는다는 점에 있다. 국소적이란 '자신과 <b>직접 관계된</b> 작은 범위'라는 의미다. 따라서 국소적 계산은 전체에서 어떤 일이 벌어지든 상관없이 자신과 직접 관계된 정보만을 결과로 출력한다.

예를 들어 복잡한 계산 결과와 호두 2개인 200원을 거기에 더하는 그래프를 상상해보자. 복잡한 계산의 결과가 얼마가 됐던 '덧셈 노드'는 그냥 두 숫자(a + 200)를 더할 뿐이다.

이처럼 계산 그래프는 국소적 계산에 집중한다. 전체 계산이 아무리 복잡해도 각 노드는 자신과 직접 관계를 맺는 노드와 국소적으로 계산할 뿐이다. 국소적 계산은 단순하나 그 결과를 전달함에 있어 전체를 구성하는 복잡한 계산이 수행된다.

#### 왜 계산 그래프를 쓰는가
지금까지 살펴본 계산 그래프 예시로 이점을 알 수 있다. 하나는 '국소적 계산'이다. 전체 연산이 아무리 복잡해도 각 노드 입장에선 국소적인 연산만을 수행해 문제를 단순화시킨다.

또 다른 이점은 <b>계산 그래프는 중간 계산 결과를 모두 보관</b>할 수 있다는 점이다. 앞서 보여준 그림처럼 중간 계산값($200, 650, 715$)을 전부 알 수 있었다.

하지만 이 정도로는 계산 그래프 이점이 와닿지만은 않는다. 가장 큰 이유는 역전파를 통해 미분을 효율적으로 계산할 수 있다는 점에 있다.

계산 그래프의 역전파를 설명하기 위해서 1번 문제를 다시 살펴보자. 1번 문제는 호두를 2개사서 소비세를 포함한 최종 금액을 구하는 것이었다. 

여기서 호두 가격이 오르면 최종 금액에 어떤 영향을 미치는지 알고 싶다고 해보자. 이는 <b>'호두 가격에 대한 지불 금액의 미분'</b>을 구하는 문제에 해당한다.

수식으로 표현하면 호두를 $x$, 지불 금액을 $L$이라 했을 때 $\frac{\partial L}{\partial x}$을 구하는 것이다.
이 미분값은 호두 값이 '정말 미세하게' 상승했을 때의 최종 지불 금액 증가량을 나타낸다.

앞에서 말했듯이 미분은 그래프에서 역전파를 통해 구할 수 있다. 결과만 보면 아래의 그림처럼 나타낼 수 있다.

```mermaid
flowchart LR
    W[walnut]
    WC[walnut count]
    Tax[tax]
    Ans[answer]
    M1((×))
    M2((×))

    W -- 100 --> M1
    WC -- 2 --> M1
    M1 -- 200 --> M2
    Tax -- 1.1 --> M2
    M2 -- 220 --> Ans

    Ans -- 1 --> M2
    M2 -- 1.1 --> M1
    M1 -- 2.2 --> W

    linkStyle 5,6,7 stroke:red,stroke-width:2px,color:red;
```

위 그림처럼 역전파는 순전파와 반대 방향의 화살표로 그렸다. 이 전파는 '국소적 미분'을 전달하고 그 미분 값은 화살표의 아래에 적었다. 이 예시는 $1 -> 1.1 -> 2.2$순으로 미분 값을 전달한다.

 이 결과로부터 '호두 가격에 대한 지불 금액의 미분'은 2.2라는 걸 알 수 있다. 호두가 1원 오르면 최종 금액은 2.2원 오르는 것이다. (정말 미세하게 오른 $h$값에 $2.2h$만큼 상승)

 여기선 호두 가격에 대한 미분만 구했으나, '소비세에 대한 지불 금액의 미분' 혹은 '호두 개수에 대한 지불 금액의 미분'도 똑같이 구할 수 있다. 그리고 그때는 중간까지 구한 미분 결과를 공유해서 다수의 미분을 효율적으로 계산할 수 있다.

 이처럼 계산 그래프의 이점은 순전파와 역전파를 활용해 각 변수의 미분을 효율적으로 구할 수 있다는 것이다.

### 연쇄 법칙
순전파는 왼쪽에서 오른쪽으로 계산 결과를 전달했고, 역전파는 그 반대로 오른쪽에서 왼쪽으로 전달했다.

또한, 이 '국소적 미분'을 전달하는 원리는 연쇄법칙에 따른 것이다. 연쇄 법칙은 무엇이고 그것이 계산 그래프 상에서 역전파와 같다는 사실을 알아보자.

#### 계산 그래프의 역전파
$y=f(x)$라는 계산의 역전파를 생각해보자. 
```mermaid
flowchart LR
    L[ ] 
    F((f)) 
    R[ ]

    %% 순전파 (Forward - 검은색)
    L -- "x" --> F
    F -- "y" --> R

    %% 역전파 (Backward - 붉은색)
    R -- "E" --> F
    F -- "E ∂y/∂x" --> L

    style L fill:none,stroke:none
    style R fill:none,stroke:none

    linkStyle 2,3 stroke:red,stroke-width:2px,color:red;
```
위 그림과 같이 신호 $E$에 노드의 국소적 미분($\frac{\partial y}{\partial x}$)을 곱한 후 다음 노드로 전달하여 역전파를 계산한다. 여기서 국소적 미분은 순전파의 $y=f(x)$ 계산의 미분을 구한다는 의미이며, 이는 $x$에 대한 $y$의 미분($\frac{\partial y}{\partial x}$)을 구한다는 뜻이다.

그리고 이 국소적인 미분을 상류에서 전달된 값(여기선 $E$)에 곱해 안쪽 노드로 전달하는 것이다.

이게 역전파의 계산 순서인데, 이러한 방식에 따르면 목표로 하는 미분 값을 효율적으로 구할 수 있다는 점이 이 전파의 핵심이다. 그리고 이는 연쇄법칙의 원리로 설명이 가능하다.

#### 연쇄법칙이란?
연쇄법칙을 설명하기 위해선, 합성 함수에 대한 이야기를 해야 한다.

함성 함수란 여러 함수로 구성된 함수이다. 예를 들어 $z = (x+y)^2$와 같이 $z = t^2$과 $t = x+y$로 2개 이상의 함수로 구성된 함수를 말한다.

<b>연쇄법칙은 함성 함수의 미분에 대한 성질이며 합성 함수의 미분은 합성 함수를 구성하는 각 함수의 미분 곱으로 나타낼 수 있다</b>.

위 식을 예로 설명하면 $\frac{\partial z}{\partial x}$($x$에 대한 $z$의 미분)은 $\frac{\partial z}{\partial t}$($t$에 대한 $z$의 미분)과 $\frac{\partial t}{\partial x}$($x$에 대한 $t$의 미분)의 곱으로 나타낼 수 있다는 것이다.

수식적으로는 아래와 같다.

$$
\frac{\partial z}{\partial x} = \frac{\partial z}{\partial t}\frac{\partial t}{\partial x}
$$

위 식은 약분에 의해서 $\partial t$를 지울 수 있다.  
합성함수의 미분을 이용해서 먼저 $\frac{\partial z}{\partial t}$과 $\frac{\partial t}{\partial x}$을 구하면 된다. (각각의 편미분)
$$

\frac{\partial t}{\partial x} = 1 \\
\frac{\partial z}{\partial t} = 2t
$$

따라서 $\frac{\partial z}{\partial x}$는 이 두 미분에 대한 곱이다.
$$
\frac{\partial z}{\partial x} = \frac{\partial z}{\partial t}\frac{\partial t}{\partial x} = 2t * 1 = 2(x+y)
$$

#### 연쇄법칙과 계산 그래프
위 식을 계산 그래프로 나타내보자. 2제곱 계산을 $**2$ 노드로 표현하면 아래의 그림처럼 된다.
```mermaid
flowchart LR
    %% 노드 정의
    X[ ]
    Y[ ]
    Plus((+))
    Pow(("**2"))
    Z[ ]

    %% 순전파 (Forward)
    X -- "x" --> Plus
    Y -- "y" --> Plus
    Plus -- "t" --> Pow
    Pow -- "z" --> Z

    %% 역전파 (Backward)
    Z -- "∂z/∂z" --> Pow
    Pow -- "∂z/∂z · ∂z/∂t" --> Plus
    Plus -- "∂z/∂z · ∂z/∂t · ∂t/∂x" --> X

    %% 스타일
    style X fill:none,stroke:none
    style Y fill:none,stroke:none
    style Z fill:none,stroke:none
    linkStyle 4,5,6 stroke:red,stroke-width:2px,color:red;
```

중요한 건 순전파와는 반대 방향으로 국소적 미분을 곱하면서 전달한다는 것이다.  
$y = f(x)$의 국소적 미분이 $\frac{\partial y}{\partial x}$인 것처럼 각 함수 $t = x +y$와 $z = t^2$에 대한 미분이 서로 곱한 것이다.

$z$의 경우에는 출력층이므로 미분할 경우 $\frac{\partial z}{\partial z}$가 된다.

결국 중요한 건 맨 왼쪽 역전파의 결과이다. $\frac{\partial z}{\partial z}\frac{\partial z}{\partial t}\frac{\partial t}{\partial x} = \frac{\partial z}{\partial x}$가 성립되어 $x$에 대한 $z$의 미분인 것은 변치 않는다.

즉, <b>역전파가 하는 일은 연쇄법칙의 원리와 동일하다</b>.

### 역전파
앞에서 계산 그래프의 역전파가 연쇄법칙에 따라 진행되는 모습을 알아보았다. 이번에는
$+$와 $×$ 연산에 따른 예시로 역전파 구조를 알아보자.

#### 덧셈 노드의 역전파
$z = x + y$라는 식을 예시로 역전파가 어떻게 진행되는지 보자.
먼저 $z = x + y$의 $x$와 $y$에 대한 각각의 편미분으로 아래와 같이 표현 가능하다.
$$
\frac{\partial z}{\partial x} = 1 \\
\frac{\partial z}{\partial y} = 1
$$

둘 다 지수가 1이기 때문에 미분 시, 모두 1이 된다. 계산 그래프로는 아래와 같다.

```mermaid
flowchart LR
    %% 투명 노드 클래스 정의
    classDef hidden fill:none,stroke:none,color:none;

    %% 1. 순전파 그래프 (왼쪽)
    subgraph Forward [순전파]
        direction LR
        Lx[ ]:::hidden
        Ly[ ]:::hidden
        P1((+))
        Lz[ ]:::hidden

        Lx -- x --> P1
        Ly -- y --> P1
        P1 -- z --> Lz
    end

    %% 2. 역전파 그래프 (오른쪽)
    subgraph Backward [역전파]
        direction RL  %% 흐름을 오른쪽->왼쪽으로 강제
        Rx[ ]:::hidden
        Ry[ ]:::hidden
        P2((+))
        R_in[ ]:::hidden

        %% 미분 값 입력
        R_in -- "∂L/∂z" --> P2
        
        %% 미분 값 분배 (덧셈은 그대로 흘려보냄)
        P2 -- "∂L/∂z · 1" --> Rx
        P2 -- "∂L/∂z · 1" --> Ry
    end

    %% 역전파(오른쪽 그래프)의 선 색상 변경 (빨간색)
    linkStyle 3,4,5 stroke:red,stroke-width:2px,color:red;
```

위 그림에서 역전파는 상류에서 전해진 미분($\frac{\partial L}{\partial z}$)에 1을 곱해 하류로 보낸다. 덧셈 노드의 역전파는 1을 곱할 뿐(국소적 계산) 입력된 값을 다음 노드로 전달한다.

여기서 상류에서 전해진 미분을 $\frac{\partial L}{\partial z}$라고 했는데, 이는 이 계산 그래프가 더 거대한 구조라서 $z$가 출력층이 아닌 하나의 중간 노드라고 생각할 경우 최종적으로 $L$이라는 값을 출력하는 계산 그래프라는 가정을 한 것이다.

따라서 $z$도 하나의 중간 노드일 뿐이고, $\frac{\partial L}{\partial z}$을 상류로부터 전달 받았고 이를 하류에 각각 $\frac{\partial L}{\partial x}$와 $\frac{\partial L}{\partial y}$로 전달한다.

결론적으로 덧셈 노드의 역전파에선 입력 신호(상류의 미분값)를 그냥 그대로 다음 노드로 전달하면 된다.

#### 곱셈 노드의 역전파
$z = xy$라는 곱셈식에 대한 예시로 역전파를 알아보자. 이 식의 미분은 아래와 같다.
$$
\frac{\partial z}{\partial x} = y \\
\frac{\partial z}{\partial y} = x
$$
둘은 각각 $x,y$에 대한 편미분이며 합성함수의 미분에 따라 두 미분의 곱이 곧 $z$의 미분이 될 것이다. 이걸 계산 그래프로 그리면 아래와 같다.

```mermaid
flowchart LR
    %% 투명 노드 클래스
    classDef hidden fill:none,stroke:none,color:none;

    %% 1. 순전파 (Forward)
    subgraph Forward [순전파]
        direction LR
        Lx[ ]:::hidden
        Ly[ ]:::hidden
        M1((×))
        Lz[ ]:::hidden

        Lx -- x --> M1
        Ly -- y --> M1
        M1 -- z --> Lz
    end

    %% 2. 역전파 (Backward)
    subgraph Backward [역전파]
        direction RL
        Rx[ ]:::hidden
        Ry[ ]:::hidden
        M2((×))
        R_in[ ]:::hidden

        %% 오른쪽에서 들어오는 입력
        R_in -- "∂L/∂z" --> M2
        
        %% 서로 바뀐 입력값(flip)을 곱해서 전달
        M2 -- "∂L/∂z · y" --> Rx
        M2 -- "∂L/∂z · x" --> Ry
    end

    %% 역전파 링크(3,4,5번) 빨간색 적용
    linkStyle 3,4,5 stroke:red,stroke-width:2px,color:red;
```

곱셈 노드의 역전파는 합성 함수의 미분에 따라서 $x$는 $x$에 대한 편미분인 $y × 1$을 $y$는 $y$애 대한 편미분인 $x × 1$을 상류에서 전달받은 미분값에 곱해서 전달시킨다. 즉, 서로 입력 신호를 바꿔서 하류로 전달한다.

이렇게 곱셈 노드의 역전파에선 덧셈 노드와는 다르게 순전파 입력 신호의 값이 필요하다. 그래서 곱셈 노드를 구현할 때는 순전파 입력 신호를 반드시 변수에 저장해야 한다.

#### 호두 쇼핑 예시
이전에 계산 그래프에 대한 설명으로 호두 구매에 대한 예시가 있었다.

이 문제에서는 호두의 가격, 호두의 개수, 소비세라는 세 변수가 최종 금액에 어떻게 영향을 주는지 알아내는 것이 목적이었다. 이는 곧 '호두 가격에 대한 지불 금액의 미분', '호두 개수에 대한 지불 금액의 미분', '소비세에 대한 지불 금액의 미분'을 구하는 것이다.
```mermaid
flowchart LR
    W[walnut]
    WC[walnut count]
    Tax[tax]
    Ans[answer]
    M1((×))
    M2((×))

    W -- 100 --> M1
    WC -- 2 --> M1
    M1 -- 200 --> M2
    Tax -- 1.1 --> M2
    M2 -- 220 --> Ans

    Ans -- 1 --> M2
    M2 -- 1.1 --> M1
    M1 -- 2.2 --> W

    linkStyle 5,6,7 stroke:red,stroke-width:2px,color:red;
```
지금까지 설명한 바와 같이 곱셈 노드의 역전파에선 입력 신호를 서로 바꿔서 하류로 전달한다. 
그림의 결과를 보면 호두 가격의 미분은 2.2, 호두 개수의 미분은 110, 소비세의 미분은 200이다.

이는 소비세와 호두 가격이 같은 양만큼 오르면 최종 금액에는 소비세가 200의 크기로, 호두 가격이 2.2 크기로 영향을 준다고 해석할 수 있다. 단, 소비세와 사과 가격은 '단위'가 다르니 주의하자.

### 단순한 계층 구현하기

이번 절에서는 지금까지 보아온 지금까진 본 '호두 쇼핑'을 python으로 구현해본다. 여기서 계산 그래프의 곱셈 노드는 `MulLayer`, 덧셈 노드를 `AddLayer`라는 이름으로 구현한다.

#### 곱셈 계층
모든 계층은 `forward()`와 `backward()`라는 함수를 갖도록 인터페이스를 기반으로 구현할 것이다.  
이름 그대로 `forward()`는 순전파, `backward()`는 역전파를 처리한다.

```python
class MulLayer:
    def __init__(self):
        self.x = None
        self.y = None
    
    def forward(self, x, y):
        self.x = x
        self.y = y
        out = x + y

        return out
    
    def backward(self, dout):
        dx = dout * self.y
        dy = dout * self.x

        return dx,dy
```

생성자인 `__init()__`에선 인스턴스 변수인 $x,y$를 초기화한다. `forward()`에선 $x,y$를 파라미터로 받아 두 수를 곱한 걸 `return`하고, `backward()`에선 상류에서 넘어온 `dout`이라는 미분값에 순전파 파라미터를 서로 반대로 곱해 `return`하면 된다.

이 `MulLayer`를 사용해서 '호두 쇼핑'을 구현해보자. 호두 쇼핑의 계산 그래프는 앞에서 계속 봤던 그 그래프이다.
```mermaid
flowchart LR
    W[walnut]
    WC[walnut count]
    Tax[tax]
    Ans[answer]
    M1((×))
    M2((×))

    W -- 100 --> M1
    WC -- 2 --> M1
    M1 -- 200 --> M2
    Tax -- 1.1 --> M2
    M2 -- 220 --> Ans

    Ans -- 1 --> M2
    M2 -- 1.1 --> M1
    M1 -- 2.2 --> W

    linkStyle 5,6,7 stroke:red,stroke-width:2px,color:red;
```

```python
walnut = 100
w_cnt = 2
tax = 1.1

mul_wal = MulLayer()
mul_tax = MulLayer()

# 순전파
wal_price = mul_wal.forward(walnut, w_cnt)
total = mul_tax.forward(wal_price, tax)

print(total) # 220
```

각 변수에 대한 미분은 `backward()`를 통해 구할 수 있다.

```python
# 역전파
dprice = 1
dwal_price, dtax = mul_tax.backward(dprice)
dwal,dw_cnt = mul_wal.backward(dwal_price)

print(dwal_price, dw_cnt, dtax) # 2.2 110 220
```

`backward()` 함수의 호출 순서는 `forward()`와는 정반대이며, 받는 파라미터 역시 '<b>순전파의 출력에 대한 미분</b>'임에 주의해야 한다.

#### 덧셈 계층
덧셈 노드 역시 아래와 같이 구현하면 된다.
```python
class AddLayer:
    def __init__(self):
        pass

    def forward(self,x,y):
        self.x = x
        self.y = y

        return x + y
    
    def backward(self,dout):
        dx = dout * 1
        dy = dout * 1

        return dx,dy
```

덧셈 계층에선 초기화가 필요없다. `backward()` 호출 시, 순전파의 값을 기록할 필요가 없기 때문이다. `forward()`에선 두 파라미터를 더하고, `backward()`에선 앞에서 전달받은 미분값을 그대로 
`return`하면 된다.

위 두 계층(덧셈,곱셈)을 활용해서 호두 2개와 피스타치오 3개를 구매하는 아래의 그래프를 코드로 구현해보자.

```mermaid
flowchart LR
    %% 입력 변수
    W[walnut]
    WC[walnut count]
    P[pistachio]
    PC[pistachio count]
    Tax[tax]
    Ans[answer]
    
    %% 연산자 노드
    Mul1((×))
    Mul2((×))
    Add((+))
    Mul3((×))

    %% 호두 계산 흐름 (상단)
    WC -- 2 --> Mul1
    W -- 100 --> Mul1
    Mul1 -- 200 --> Add

    %% 피스타치오 계산 흐름 (하단)
    P -- 150 --> Mul2
    PC -- 3 --> Mul2
    Mul2 -- 450 --> Add

    %% 합산 및 최종 계산
    Add -- 650 --> Mul3
    Tax -- 1.1 --> Mul3
    Mul3 -- 715 --> Ans
```

```python
walnut = 100
w_cnt = 3
pistachio = 150
p_cnt = 2
tax = 1.1

# 계층
mul_wal = MulLayer()
mul_pis = MulLayer()
mul_tax = MulLayer()
add_wal_pis = AddLayer()

# 순전파
wal_p = mul_wal.forward(walnut,w_cnt)
pis_p = mul_pis.forward(pistachio,p_cnt)
total = add_wal_pis.forward(wal_p,pis_p)
price = mul_tax.forward(total, tax)

# 역전파
dprice = 1
dtotal, dtax = mul_tax.backward(dprice)
dwalnut_price,dpistachio_price = add_wal_pis.backward(dtotal)
dwalnut,dw_cnt = mul_wal.backward(dwalnut_price)
dpistachio,dp_cnt = mul_pis.backward(dpistachio_price)

print(price) # 715
print(dwalnut,dpistachio,dw_cnt,dp_cnt,dtax) # 2.2 3.3 110 165 650
```

필요한 계층을 만들어 순전파를 먼저 호출하고 그 후에 역전파를 순전파의 반대 순서로 호출하면 원하는 값을 모두 구할 수 있다.  
이처럼 계산 그래프에서 계층은 쉽게 구현이 가능하며, 이를 통해 복잡한 미분도 쉽게 계산할 수 있다.

### 활성화 함수 계층 구현
계산 그래프를 이제 '신경망'에 도입해볼 차례다. 여기선 신경망을 구성하는 계층을 각각 하나의 클래스로 구현한다. 우선 활성화 함수인 ReLU와 Sigmoid 함수를 구현한다.

#### ReLU 계층
활성화 함수로 사용되는 ReLU의 수식은 아래와 같다.
$$
y = 
\begin{cases} 
    0\ (x \le 0) \\
    x\ (x > 0)
\end{cases}
$$

위 식에서 $x$에 대한 $y$의 미분은 아래와 같다.

$$
\frac{\partial y}{\partial x} = 
\begin{cases} 
    0\ (x \le 0) \\
    1\ (x > 0)
\end{cases}
$$

순전파의 입력값인 $x$가 0보다 크면 역전파는 상류의 값을 그대로 하류로 보낸다. 반면 0 이하이면 아무것도 하류로 보내지 않는다. (0을 보냄)
계산 그래프로는 아래와 같이 그려질 것이다.

```mermaid
flowchart LR
    %% 투명 노드 클래스
    classDef hidden fill:none,stroke:none,color:none;

    %% 1. x > 0 인 경우
    subgraph Case1 ["x > 0"]
        direction LR
        L1[ ]:::hidden
        ReLU1((relu))
        R1[ ]:::hidden

        %% 순전파
        L1 -- "x" --> ReLU1
        ReLU1 -- "y" --> R1

        %% 역전파 (그대로 전달)
        R1 -- "∂L/∂y" --> ReLU1
        ReLU1 -- "∂L/∂y" --> L1
    end

    %% 2. x <= 0 인 경우
    subgraph Case2 ["x ≤ 0"]
        direction LR
        L2[ ]:::hidden
        ReLU2((relu))
        R2[ ]:::hidden

        %% 순전파
        L2 -- "x" --> ReLU2
        ReLU2 -- "y" --> R2

        %% 역전파 (0으로 전달)
        R2 -- "∂L/∂y" --> ReLU2
        ReLU2 -- "0" --> L2
    end

    %% 역전파 링크(돌아오는 화살표) 빨간색 지정
    linkStyle 2,3,6,7 stroke:red,stroke-width:2px,color:red;
    style Case1 fill:#f9f9f9
    style Case2 fill:#f9f9f9
```

ReLU를 구현한 클래스는 아래와 같다.
class ReLU:
    def __init__(self):
        self.mask = None

    def forward(self, x, y):
        self.mask = (x <= 0)
        out = x.copy()
        out[self.mask] = 0

    return out

    def backward(self, dout):
        dout[self.mask] = 0
        dx = dout

        return dx

ReLU 클래스는 `mask`라는 인스턴스 변수를 갖는다. `mask`는 `True/False`로 구성된 넘파이 배열로, 순전파의 입력인 $x$의 원소 값이 0 이하인 인덱스는 `True`로, 그 외에는 `False`로 저장한다.
이를 통해 역전파 함수인 `backward()`를 호출할 때는 `mask`의 인덱스 값이 `True`인 곳에는 상류에서 전파된 `dout`을 0으로 한다.

문법적으로는 <b>Numpy 배열</b>에서만 동작하는 <b>Boolean Indexing</b>이며, 내부 동작은 <b>C언어</b>로 작성된 아래와 같은 반복문이다.


```c
/* 실제 NumPy 내부 구현의 개념적 형태 (C언어) */
void set_masked_values_to_zero(double* dout, bool* mask, int size) {
    // CPU가 처리하기 가장 좋은 형태의 단순 반복문
    for (int i = 0; i < size; i++) {
        if (mask[i]) {   // mask가 1(True)이면
            dout[i] = 0; // 바로 0으로 덮어씀
        }
    }
}
```

#### Sigmoid 계층
시그모이드 함수는 수식적으로 아래와 같다.

$$
y = \frac{1}{1+exp(-x)}
$$

Sigmoid 함수를 순전파 계산 그래프로 표현하면 아래와 같을 것이다.

```mermaid
flowchart LR
    %% 스타일 정의 (노드: 흰색 원, 투명 노드 등)
    classDef op fill:#lelele,stroke:#lelele,stroke-width:1px;
    classDef hidden fill:none,stroke:none,color:none;
    classDef inputParam fill:none,stroke:none;

    %% 노드 생성
    Start[ ]:::hidden
    Mul((×)):::op
    Param1[-1]:::inputParam
    
    Exp((exp)):::op
    
    Add((+)):::op
    Param2[1]:::inputParam
    
    Div((/)):::op
    End[ ]:::hidden

    %% 연결 및 라벨
    Start -- "x" --> Mul
    Param1 --> Mul
    
    Mul -- "-x" --> Exp
    Exp -- "exp(-x)" --> Add
    
    Param2 --> Add
    Add -- "1+exp(-x)" --> Div
    
    %% 마지막 결과 라벨 (수식 표현 근사)
    Div -- "y = 1 / (1+exp(-x))" --> End
```

여기선 $×$과 $+$ 노드 외에 $exp$와 $/$ 노드가 새로 등장했다. $exp$ 노드는 $y = exp(x)$ 계산을 수행하고, $/$ 노드는 $y = \frac{1}{x}$ 계산을 수행한다.

Sigmoid의 역전파 흐름을 순서대로 정리하면 아래와 같다.

1. '$/$' 노드 ($y = \frac{1}{x}$)의 미분
$$
\frac{\partial y}{\partial x} = -\frac{1}{x^2} = -y^2
$$

위 수식에 따르면 역전파에선 상류에선 넘어온 값에 순전파 출력의 제곱에 마이너스를 붙인 값을 곱해서 하류로 전달하면 된다. 계산 그래프로는 아래와 같다.

```mermaid
flowchart LR
    %% 스타일 정의
    classDef op fill:#lelele,stroke:#lelele,stroke-width:1px;
    classDef hidden fill:none,stroke:none,color:none;
    classDef inputParam fill:none,stroke:none;

    %% 노드 생성
    Start[ ]:::hidden
    Mul((×)):::op
    P1[-1]:::inputParam
    Exp((exp)):::op
    P2[1]:::inputParam
    Add((+)):::op
    Div((/)):::op
    End[ ]:::hidden

    %% 순전파 흐름
    Start -- "x" --> Mul
    P1 --> Mul
    Mul -- "-x" --> Exp
    Exp -- "exp(-x)" --> Add
    P2 --> Add
    Add -- "1+exp(-x)" --> Div
    Div -- "y" --> End

    %% 역전파 흐름 (수식 근사 표기)
    End -- "∂L/∂y" --> Div
    Div -- "- ∂L/∂y · y²" --> Add

    %% 역전파 링크 스타일 (붉은색)
    linkStyle 7,8 stroke:red,stroke-width:2px,color:red;
```

2. '$+$' 노드 (상류의 값을 그대로 내보냄)
```mermaid
flowchart LR
    %% 스타일 정의
    classDef op fill:#lelele,stroke:#lelele,stroke-width:1px;
    classDef hidden fill:none,stroke:none,color:none;
    classDef inputParam fill:none,stroke:none;

    %% 노드 생성
    Start[ ]:::hidden
    Mul((×)):::op
    P1[-1]:::inputParam
    Exp((exp)):::op
    P2[1]:::inputParam
    Add((+)):::op
    Div((/)):::op
    End[ ]:::hidden

    %% 순전파 흐름
    Start -- "x" --> Mul
    P1 --> Mul
    Mul -- "-x" --> Exp
    Exp -- "exp(-x)" --> Add
    P2 --> Add
    Add -- "1+exp(-x)" --> Div
    Div -- "y" --> End

    %% 역전파 흐름 (수식 근사 표기)
    End -- "∂L/∂y" --> Div
    Div -- "- ∂L/∂y · y²" --> Add
    Add -- "- ∂L/∂y · y²" --> Exp

    %% 역전파 링크 스타일 (붉은색)
    linkStyle 7,8,9 stroke:red,stroke-width:2px,color:red;
```

3. '$exp$' 노드
$y = exp()x$ 연산을 수행하고 그 미분은 아래와 같다.
$$
\frac{\partial y}{\partial x} = exp(x)
$$

계산 그래프 상에선 상류의 값에 순전파 출력($exp(-x)$)을 곱해 하류로 전달한다.

```mermaid
flowchart LR
    %% 스타일 정의
    classDef op fill:#lelele,stroke:#lelele,stroke-width:1px;
    classDef hidden fill:none,stroke:none,color:none;
    classDef inputParam fill:none,stroke:none;

    %% 노드 생성
    Start[ ]:::hidden
    Mul((×)):::op
    P1[-1]:::inputParam
    Exp((exp)):::op
    P2[1]:::inputParam
    Add((+)):::op
    Div((/)):::op
    End[ ]:::hidden

    %% 순전파 흐름
    Start -- "x" --> Mul
    P1 --> Mul
    Mul -- "-x" --> Exp
    Exp -- "exp(-x)" --> Add
    P2 --> Add
    Add -- "1+exp(-x)" --> Div
    Div -- "y" --> End

    %% 역전파 흐름 (수식 근사 표기)
    End -- "∂L/∂y" --> Div
    Div -- "- ∂L/∂y · y²" --> Add
    Add -- "- ∂L/∂y · y²" --> Exp
    Exp -- "- ∂L/∂y · y² · exp(-x)" --> Mul

    %% 역전파 링크 스타일 (붉은색)
    linkStyle 7,8,9,10 stroke:red,stroke-width:2px,color:red;
```

4. '$x$' 노드
'$x$' 노드는 순전파의 입력값을 서로 바꾼다.
```mermaid
flowchart LR
    %% 스타일 정의
    classDef op fill:#lelele,stroke:#lelele,stroke-width:1px;
    classDef hidden fill:none,stroke:none,color:none;
    classDef inputParam fill:none,stroke:none;

    %% 노드 생성
    Start[ ]:::hidden
    Mul((×)):::op
    P1[-1]:::inputParam
    Exp((exp)):::op
    P2[1]:::inputParam
    Add((+)):::op
    Div((/)):::op
    End[ ]:::hidden

    %% 순전파 흐름
    Start -- "x" --> Mul
    P1 --> Mul
    Mul -- "-x" --> Exp
    Exp -- "exp(-x)" --> Add
    P2 --> Add
    Add -- "1+exp(-x)" --> Div
    Div -- "y" --> End

    %% 역전파 흐름 (수식 근사 표기)
    End -- "∂L/∂y" --> Div
    Div -- "- ∂L/∂y · y²" --> Add
    Add -- "- ∂L/∂y · y²" --> Exp
    Exp -- "- ∂L/∂y · y² · exp(-x)" --> Mul
    Mul -- "∂L/∂y · y² · exp(-x)" --> Start

    %% 역전파 링크 스타일 (붉은색)
    linkStyle 7,8,9,10,11 stroke:red,stroke-width:2px,color:red;
```

위의 그림을 보면 최종 출력인 $\frac{\partial L}{\partial y}y^2exp(-x)$의 값이 하류 노드로 전파되는 걸 볼 수 있다.
이 그래프는 순수하게 $x$와 $y$만으로 계산이 가능한 그래프이기 때문에 아래와 같이 간단하게 표현이 가능하다.

```mermaid
flowchart LR
    %% 스타일 클래스
    classDef hidden fill:none,stroke:none,color:none;
    classDef op fill:#lelele,stroke:#333,stroke-width:1px;

    %% 노드
    Input[ ]:::hidden
    Sig((sigmoid)):::op
    Output[ ]:::hidden

    %% 순전파
    Input -- "x" --> Sig
    Sig -- "y" --> Output

    %% 역전파
    Output -- "∂L/∂y" --> Sig
    Sig -- "∂L/∂y · y² exp(-x)" --> Input

    %% 스타일 적용 (역방향 화살표 붉은색)
    linkStyle 2,3 stroke:red,stroke-width:2px,color:red;
```

또한 $\frac{\partial L}{\partial y}y^2exp(-x)$는 아래와 같이 정리해서 작성이 가능하다.

$$
\frac{\partial L}{\partial y}y^2exp(-x) = \frac{\partial L}{\partial y}\frac{1}{(1+exp(-x))^2}exp(-x) = \frac{\partial L}{\partial y}\frac{1}{(1+exp(-x))}\frac{exp(-x)}{(1+exp(-x))} = \frac{\partial L}{\partial y}y(1-y)
$$

즉, sigmoid의 역전파는 순전파의 출력($y$)만으로도 계산할 수 있다.  
sigmoid 계층을 python으로 구현하면 아래와 같다.

```python
class Sigmoid:
    def __init__(self):
        self.out = None
    
    def forward(self,x):
        out = 1 / (1 + np.exp(-x))
        self.out = out

        return out
    
    def backward(self, dout):
        dx = dout * (1.0 - self.out) * self.out

        return dx
```

순전파의 출력을 인스턴스 변수 `out`에 보관했다가 역전파 계산 시, 사용하는 것이 핵심이다.

### Affine/Softmax 계층
#### Affine계층
신경망의 순전파에서는 가중치 신호의 총합을 계산하기 때문에 행렬의 곱(`np.dot()`)을 사용했다.

이 계산은 입력과 가중치 두 행렬을 서로 곱한 후, 편향을 더하는 방식으로 순전파가 진행되었고, 그 출력을 활성화 함수로 변환해 다음 층으로 전파는 게 신경망 순전파의 흐름이었다.