---
title: "백준 17425번 약수의 합 (python)"
date: "2025-12-07 21:04:44"
category: "코테"
description: "python으로 풀어보는 백준 17425"
---

## 코딩 테스트 풀이

!["문제사진"](/images/17425.png)
<a href="https://www.acmicpc.net/problem/17425" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 17425번 문제 풀이에 대한 해설.

### 나의 접근
우선 특정 수 A에 대한 약수의 합을 $$f(A)$$로 정의하고, 1부터 A까지 $$f(n)$$의 합을 $$g(A)$$로 정의했기 때문에
$$f(x)$$를 저장한 배열의 누적합을 통해서 $$g(A)$$를 빠르게 구하는 게 최선이라고 생각을 했다.

사실 이 문제에서 가장 어려웠던 건 특정 수 A에 대한 인수의 합인 $$f(A)$$를 구하는 것이었다.
이 문제의 특성 상 t개의 케이스가 있고 그 케이스 중 최댓값인 **m**이 최대 100만까지 가능하기 때문에 1부터 100만의 약수를 매번
구하는 것은 $$log(n × √n)$$의 시간복잡도를 나타낸다. 이는 100만 * 1000이므로 약 10억번의 연산을 거쳐야 한다.

따라서 **에라토스테테스의 체**를 활용한 관점을 바꾼 방식을 적용해야만 했었다.
에라토스테테스의 체는 보통 **소수**를 판별할 때 많이 사용하는 알고리즘이다.  
하지만 소수 판별기에 국한되지 않고
**배수 관계를 이용한 전체 범위 처리기**라는 개념이 더 올바른 개념이다.

이 문제를 예시를 보면, 특정 수 A에 대한 모든 약수를 구하는 것보다 1~A까지 수 x에 대해서 **x의 N배수**가 A이하에 몇 개가 포함되는지를
세는 게 훨씬 빠르다.  
즉 <strong>"숫자 i는 누구의 약수가 될까?"</strong>로 접근을 해서 $$log(N log N)으로 접근하는 것이다!

### 정답 코드
```python
# x보다 작거나 같은 모든 자연수 y의 f(y) (= y의 모든 약수를 더한 값)를 g(x)라고 부른다.
# g(n)을 구해보자
from sys import stdin as input
t = int(input.readline())

arr = []
m = 0
for _ in range(t):
    n = int(input.readline())
    m = max(m,n)
    arr.append(n)

f = [1] * (m+1)
for num in range(2,m+1):
    # num이 약수가 되는 수의 g[x]에 num 더하기
    for nxt in range(num, m+1, num):
        f[nxt] += num

# f에 대한 누적합(g)
for i in range(1,m):
    f[i+1] += f[i]

result = []
# 각 케이스별로 정답 출력
for n in arr:
    a = f[n]
    result.append(f[n])

print('\n'.join(map(str, result)))
```

`python`으로 하면 시간초과가 나오므로 꼭 `pypy3`로 실행시키자.