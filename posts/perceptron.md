---
title: "퍼셉트론(Perceptron)은 뭘까?"
date: "2026-01-01 16:08:22"
category: "딥러닝"
description: "딥러닝의 기초가 되는 퍼셉트론 알고리즘에 대해서 알아보자."
---

## 퍼셉트론
퍼셉트론은 프랭크 로젠블랫이 1957년에 고안한 알고리즘이다. 퍼셉트론은 신경망(딥러닝)의 기원이 되는 알고리즘이다.  
퍼셉트론은 다수의 신호를 입력으로 받아 하나의 신호를 출력한다. 여기서 신호란 전류처럼 <b>
정보를 실어서앞으로 전달</b>한다는 느낌이라고 생각하면 될 거 같다.

다만 실제 전류와 달리 퍼셉트론 신호는 흐른다/안 흐른다(1,0)로 2가지 값만 가질 수 있다.

<figure>
    <img src="/images/node_ex.png" alt="입력이 2개인 퍼셉트론 예시 그림">
    <figcaption>입력이 2개인 퍼셉트론 예시</figcaption>
</figure>

$x_1$과 $x_2$는 입력 신호, $y$는 출력 신호, $w_1$과 $w_2$는 가중치를 의미한다. 원은 <b>노드</b> 혹은 <b>뉴런</b>이라고 부른다.
입력 신호가 노드에 보내질 때는 각각 고유한 가중치가 곱해진다. ($w_1x_1, w_2x_2$)
뉴런에서 보내온 신호의 총합이 정해진 한계를 넘어설 때만 1을 출력한다. (뉴런 활성화) 그 한계를 <b>임곗값</b>이라고 하며 $\theta$(세타)로 나타낸다.

$$
y = 
\begin{cases} 
    0 & \text{if } w_1 x_1 + w_2 x_2 \le \theta \\
    1 & \text{if } w_1 x_1 + w_2 x_2 > \theta 
\end{cases}
$$

퍼셉트론은 복수의 입력 신호 각각에 고유한 가중치를 부여한다. 가중치는 <b>각 신호가 결과에 주는 영향력을 조절하는 요소로 작용</b>한다. 즉, 가중치가 클수록
신호가 크만큼 더 중요한 것.

### AND 게이트
AND 게이트는 입력이 2개이고 출력은 1개이다. 컴퓨터에서 & 연산과 동일하게 동작한다. 두 입력이 모두 1일 때만 1을 출력하고 나머진 전부 0을 출력한다.
<table>
    <caption>AND 게이트 연산 정리</caption>
    <thead>
        <tr>
            <th>x1</th>
            <th>x2</th>
            <th>y</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0</td>
            <td>0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>1</td>
            <td>0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>0</td>
            <td>1</td>
            <td>0</td>
        </tr>
        <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
        </tr>
    </tbody>
</table>

### NAND 게이트와 OR 게이트
NAND는 Not AND를 의미하고, AND 게이트와 반대되는 값을 출력한다. 즉 $x_1$과 $x_2$가 모두 1일 때만 0을 출력하고 그 외에는 전부 1을 출력한다.

<table>
    <caption>NAND 게이트 연산 정리</caption>
    <thead>
        <tr>
            <th>x1</th>
            <th>x2</th>
            <th>y</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0</td>
            <td>0</td>
            <td>1</td>
        </tr>
        <tr>
            <td>1</td>
            <td>0</td>
            <td>1</td>
        </tr>
        <tr>
            <td>0</td>
            <td>1</td>
            <td>1</td>
        </tr>
        <tr>
            <td>1</td>
            <td>1</td>
            <td>0</td>
        </tr>
    </tbody>
</table>

OR 게이트는 입력 신호 중 하나라도 1이면 출력이 1이 되는 논리 회로이다.

<table>
    <caption>OR 게이트 연산 정리</caption>
    <thead>
        <tr>
            <th>x1</th>
            <th>x2</th>
            <th>y</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0</td>
            <td>0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>1</td>
            <td>0</td>
            <td>1</td>
        </tr>
        <tr>
            <td>0</td>
            <td>1</td>
            <td>1</td>
        </tr>
        <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
        </tr>
    </tbody>
</table>

퍼셉트론의 매개변수 값을 결정하는 건 컴퓨터가 아니라 사람이다. 사람이 직접 위의 표들을 보면서 매개변수 값을 결정한다.
머신러닝 문제는 이 <b>매개변수의 값을 정하는 작업을 컴퓨터가 자동으로 하는 과정</b>이다. 학습이란 적절한 매개변수 값을 정하는 작업이고,
사람은 퍼셉트론의 모델을 고민하고 학습할 데이터를 주는 일을 한다.

위의 게이트를 통해 퍼셉트론의 모든 게이트가 같은 구조지만 매개변수(가중치와 임곗값)만 다르다는 것이다. 즉, 똑같은 구조의 퍼셉트론도 매개변수의 값만
조정하면 AND,NAND,OR로 바뀐다.

### 가중치와 편향 도입
앞서 정의한 퍼셉트론 공식에서 $\theta$를 $-b$로 치환하면 아래와 같이 바뀐다.

$$
y = 
\begin{cases} 
    0\ (b + w_1 x_1 + w_2 x_2 \le 0) \\
    1\ (b + w_1 x_1 + w_2 x_2 > 0)
\end{cases}
$$

여기서 $b$를 <b>편향(bias)</b>라고 한다. 퍼셉트론은 입력 신호에 가중치를 곱한 값과 편향을 합해서 그 값이 0을 넘으면 1을 출력하고,
그렇지 않으면 0을 출력한다.

```python
import numpy as np
x = np.array([0,1]) # 입력
w = np.array([0.5,0.5]) # 가중치
b = -0.7 # 편향

np.sum(w*x) + b
# -0.19999999999999996 대략 -0.2 (부동 소수점에 의한 오차)
```

`np.sum()`은 입력한 배열에 담긴 모든 원소의 합을 계산한다. 따라서 $w_1x_1\ +\ w_2x_2$의 값을 return하며 여기에 bias만 더하면 된다.

### 가중치와 편향 구현
'가중치와 편향을 도입한' AND 게이트는 아래와 같다.

```python
def AND(x1,x2):
    x = np.array([x1,x2])
    w = np.array([0.5,0.5])
    b = -0.7
    temp = np.sum(x*w) + b
    if temp > 0: return 1
    else: return 0
```

여기서 편향은 가중치와 기능이 명벽하게 다르다. 가중치는 <b>각 입력 신호가 결과에 주는 영향력(중요도)를 조절</b>하고 편항은 <b>뉴런이
얼마나 쉽게 활성화(1을 return)하느냐를 조정</b>하는 변수이다.

이이서 NAND 게이트와 OR 게이트를 구현해보자.

```python
def NAND(x1,x2):
x = np.array([x1,x2])
# AND와 가중치와 편향만 다르고 논리는 완전히 동일
w = np.array([-0.5,-0.5])
b = 0.7
temp = np.sum(x*w) + b
if temp > 0: return 1
else: return 0
```

```python
x = np.array([x1,x2])
# AND와 가중치와 편항만 다르고 논리는 완전히 동일
w = np.array([0.5,0.5])
b = -0.2
temp = np.sum(x*w) + b
if temp > 0: return 1
else: return 0
```

### XOR 게이트
XOR 게이트는 <a href="https://ko.wikipedia.org/wiki/%EB%B0%B0%ED%83%80%EC%A0%81_%EB%85%BC%EB%A6%AC%ED%95%A9" class="plink">
  배타적 논리합
</a>이라는 논리 회로이다. &x_1&과 $x_2$ 중 한 쪽이 1일 때만 1을 출력한다. (자신을 제외하곤 거부)

<table>
    <caption>XOR 게이트 연산 정리</caption>
    <thead>
        <tr>
            <th>x1</th>
            <th>x2</th>
            <th>y</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0</td>
            <td>0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>1</td>
            <td>0</td>
            <td>1</td>
        </tr>
        <tr>
            <td>0</td>
            <td>1</td>
            <td>1</td>
        </tr>
        <tr>
            <td>1</td>
            <td>1</td>
            <td>0</td>
        </tr>
    </tbody>
</table>

이러한 XOR 게이트를 퍼셉트론으로 구현하려면 어떻게 해야 할까? 지금까지 학습한 퍼셉트론만으론 안 될 것이다.  
왜 AND(NAND),OR은 되고 XOR은 만들 수 없는 걸까?

OR 게이트를 기준으로 생각해보자. 가중치 매개변수가 $(b,w_1,w_2)\ =\ (-0.5,1.0,1.0)$일 때 아래의 수식을 만족한다.  
$$
y = 
\begin{cases} 
    0\ (-0.5 + x_1 + x_2 \le 0) \\
    1\ (-0.5 + x_1 + x_2 > 0)
\end{cases}
$$
위 식의 퍼셉트론은 직선 그래프로 두 영역을 만든다. 

<figure>
    <img src="/images/p_g.png" alt="직선이 두 영역을 나눌 수 있음을 보여주는 그래프">
    <figcaption>이렇게 두 영역을 나눌 수 있다.</figcaption>
</figure>

그래프의 아래는 0을 출력하고 위 부분은 1을 출력한다. OR 게이트에선 (0,0)을 제외하고선 전부 1을 출력하므로
0과 1을 출력을 결정하는 거점 4가지((0,0), (1,0), (0,1), (1,1)) 중 0을 출력하는 (0,0)과 나머지를
하나의 직선으로 제대로 분리할 수 있어야 한다.

반면 XOR 게이트를 생각해보면 0을 출력하는 (0,0)과 (1,1)과 1을 출력하는 (1,0)과 (0,1)을 하나의 직선으로
영역을 분리할 수 없다.

하지만 직선이 아니라 <b>곡선</b>으로 나누면 어떨까?  

<figure>
    <img src="/images/c_g.png" alt="곡선이라면 두 영역을 나눌 수 있음을 보여주는 그래프">
    <figcaption>곡선이라면 두 영역을 나눌 수 있다.</figcaption>
</figure>

즉 퍼셉트론은 직선 하나로 나눈 영역만 표현할 수 있다는 한계가 존재한다. 위의 그래프와 같은 곡선을 표현할 수 없다는 뜻.
추가로 위 그래프 같은 곡선의 영역을 <b>비선형</b> 영역, 직선의 영역을 <b>선형</b> 영역이라고 부른다.

---

## 다층 퍼셉트론
현재까지 배운 퍼셉트론으론 XOR 게이트를 표현할 수 없다. 하지만 퍼셉트론은 <b>층을 쌓아 다층 퍼셉트론</b>을 만들 수 있다.

### 기존 게이트 조합하기
XOR 게이트를 만드는 방법은 다양한데, 그 중에선 앞서 만든 게이트들(AND,NAND,OR)을 조합하는 방법도 있다.
서로 다른 걸 0,1 넣을 때에만 1을 출력한다. 같은 걸 넣으면 0을 출력한다 

<figure>
    <img src="/images/xor.png" alt="xor 게이트 구현 회로 모습">
    <figcaption>x1,x2을 NAND와 OR 게이트에 각각 넣고 나온 출력 결과를 다시 AND 게이트에 넣으면 XOR 게이트가 된다.</figcaption>
</figure>

python으로 지금까지 구현한 AND,NAND,OR 함수를 사용해서 아래와 같이 XOR을 쉽게 구현 가능하다.
```python
def XOR(x1,x2):
    a = NAND(x1,x2)
    b = OR(x1,x2)
    y = AND(a,b)
    return y
```

<figure>
    <img src="/images/xor2.png" alt="xor 게이트 구현 회로 모습">
    <figcaption>XOR은 아래의 그림과 같이 <b>다층</b> 구조로 되어 있는 셈이다. 왼쪽부터 차례로 0,1,2층을 이룬다.</figcaption>
</figure>

위의 다층 퍼셉트론의 동작 과정을 상세하게 설명하면 아래와 같다.

1. 0층의 두 뉴런의 입력 신호를 받아 1층의 뉴런으로 신호(출력값)를 보낸다.  
2. 1층의 두 뉴런의 입력 신호를 받아 2층의 뉴런으로 신호(출력값)를 보낸다.  
3. 2층 뉴런은 y를 출력한다.

다층 퍼셉트론에서 가장 중요한 개념은 단층 퍼셉트론으로는 표현하지 못한 걸 구현할 수 있다는 점이다. 이렇게 퍼셉트론은 층을 늘려가면서
더 풍부한 값과 대상을 표현 가능해진다. 심지어는 2층 퍼셉트론으로 이론상 컴퓨터까지 구현이 가능하다. 물론 컴퓨터를 구성하는 각 부품을
모두 2층 퍼셉트론으로 구현하고 이 부품들이 다시 쌓이는 구조가 될 것이다.

---

<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800 dark:text-gray-200" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>

- 퍼셉트론은 입출력을 갖춘 알고리즘이다. 입력을 주면 정해진 규칙에 따른 값을 출력한다.
- 퍼셉트론은 '가중치'와 '편향'을 매개변수로 한다.
- 퍼셉트론은 AND,OR 게이트 등의 논리 회로를 표현할 수 있다.
- XOR 게이트는 단층 퍼셉트론으로 표현 불가능하다.
- XOR 게이트는 2층 퍼셉트론으로 표현 가능하다.
- 단층 퍼셉트론은 선형 영역만 표현할 수 있고, 다층 퍼셉트론은 비선형 영역도 표현할 수 있다.
