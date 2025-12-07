---
title: "백준 2666번 벽장문의 이동 (python)"
date: "2025-12-07 19:41:26"
category: "코테"
description: "python으로 풀어보는 백준 2666"
---

## 코딩 테스트 풀이

!["문제사진"](/images/2666.png)
<a href="https://www.acmicpc.net/problem/2666" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 2666번 문제 풀이에 대한 해설.

### 1. 재귀함수를 통한 완전탐색 풀이

단순한 재귀를 통해 푸는 방식을 먼저 생각했었다.  
임의의 함수 `solve()`를 재귀하면서 최소값을 완전 탐색하는 $$ 2^m $$ 시간복잡도를 가진 풀이였다.  
모든 인덱스를 탐색하면 최솟값을 갱신했고 누적값 역시 기존 값보다 클 경우 가지치기를 통해서 이후를 탐색하지 않도록 했다.

```python
from sys import stdin as input
# 벽장의 개수
n = int(input.readline())
# 초반에 열린 벽장의 번호(1-based)
f,s = map(int,input.readline().split())
# 사용할 벽장의 개수
m = int(input.readline())
l = []
for _ in range(m):
    l.append(int(input.readline()))

ans = float('inf')

# 현재 풀 idx, 열린 문 번호1, 열린 문 번호2
def solve(idx,o1,o2,s):
    global ans
    # 가지치기
    if s >= ans: return

    if idx == len(l):
        ans = min(ans,s)
        return
    
    t = l[idx]
    # t를 열기 위한 최소 횟수
    c1 = abs(t - o1)
    c2 = abs(t - o2)

    # 둘 다 시도
    solve(idx+1,o1,t,s + c2)
    solve(idx+1,o2,t,s + c1)

solve(0,f,s,0)
print(ans)
```

### 2. dp를 통한 중복계산을 줄인 풀이
앞서 풀이한 방식은 **중복계산**이 매우 많고 그 때문에 $$ 2^m $$이라는 시간복잡도를 갖게 된다.  
물론 문제에서 주어지는 m은 최대 20이기 때문에 2의 20승은 **1,048,576**으로 1초에 모든 값을 탐색하기엔 아주 충분하며,
더욱이 가지치기를 통해서 조금 덜 탐색하기 때문에 매우 안전하다.

하지만 최적화를 하는 건 항상 중요하고, 최악의 방식에서 최선의 방식으로 풀어봐야 DP를 푸는 실력이 느니까 dp를 통해서도 풀어보았다.  
먼저 dp 테이블의 정의는 `dp[i][j][k]`는 **i번째 벽장을 열 때, j와 k번이 열려있는 상태일 때의 최소 이동값**으로 정의했다.

그리곤 **반복문**을 통해서 완전탐색 비슷하게 수행하나, $$ log(m × n^2) $$의 값으로 탐색할 수 있게 하고,
dp 테이블을 `float('inf')`로 초기화하여, 재귀함수 풀이와 비슷하게 불가능한 값에 대한 건너뛰기를 수행했다.

또한 0번째 벽장에 한해서는 `dp[0][f][s]`와 `dp[0][s][f]` 모두 순서와 상관없이 가능하므로 0으로 초기화하고,
반복문을 통해 열린 2개의 문 중 하나를 조건문을 통해 검증하면서 최솟값으로 갱신했다.  

이 문제는 이전의 값으로부터 영향을 받는 건 너무 어렵기 때문에 **비트 마스킹**과 비슷하게 현재의 값이 미래에 미치는 걸
생각하는 **Push** 형석의 점화식을 사용했다.

```python
from sys import stdin as input
# 벽장의 개수
n = int(input.readline())
# 초반에 열린 벽장의 번호(1-based)
f,s = map(int,input.readline().split())
# 사용할 벽장의 개수
m = int(input.readline())
l = []
for _ in range(m):
    l.append(int(input.readline()))

ans = float('inf')
# dp[i][j][k] = i번째 벽장 차례에서 j,k번 벽장이 open된 상태에서 최솟값
dp = [[[float('inf')] * (n+1) for _ in range(n+1)] for _ in range(m+1)]
dp[0][f][s] = 0
dp[0][s][f] = 0

for i in range(m):
    # 목표 벽장
    t = l[i]
    for j in range(1,n+1):
        for k in range(1,n+1):
            # 도달할 수 없는 상태라면 pass
            if dp[i][j][k] == float('inf'): continue

            # j문을 이동
            mj = abs(j - t)
            if dp[i+1][t][k] > dp[i][j][k] + mj:
                dp[i+1][t][k] = dp[i][j][k] + mj

            # k문을 이동
            kj = abs(k - t)
            if dp[i+1][j][t] > dp[i][j][k] + kj:
                dp[i+1][j][t] = dp[i][j][k] + kj

for i in range(1,n+1):
    for j in range(1,n+1):
        ans = min(ans, dp[m][i][j])

print(ans)
```