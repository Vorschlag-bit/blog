---
title: "백준 17404번 RGB거리 2 (python)"
date: "2025-12-29 00:30:41"
category: "코테"
description: "python으로 풀어보는 백준 17404"
---

## 코딩 테스트 풀이

!["문제사진"](/images/17404.png)
<a href="https://www.acmicpc.net/problem/17404" class="plink">
  문제링크
</a>

백준 17404번 문제 풀이에 대한 해설.

### 나의 접근
이전의 값이 이후에 영향을 주는 것으로 보이는 PUSH DP인 것으로 보이나, $i+1$라는 미래의 값에도 영향을 주는 것처럼 보이기 때문에
쉽사리 점화식을 찾기가 힘들다.

또한 $i+1$이라는 값 때문에 점화식이 꼬리에 꼬리를 무는 원형의 모습을 하고 있기 때문에 더더욱 헷갈릴 수 있다.
이럴 땐 <b>시작점을 하나로 고정하는</b> 방식이 제일 확실하다.

즉, 1번 집이 무슨 색일 때 가장 저렴한지 모르기 때문에 모든 색을 전부 시도해보는 것이다.  
예를 들어 1번 집이 빨간색으로 고정되어 있다고 가정하면, 1번집에 다른 색들을 칠할 수 없도록 초기값을 세팅할 경우 n번 집을 제외한
나머지 집은 빨,초,파의 모든 경우의 수를 누적시킨다. ($cost[color]\ +\ dp[ex][diffColor]$)

그 후에 맨 마지막 $n$번째 집은 1번에서 세팅한 해당 색만 안 되게끔 만들면 1번 집이 특정 색일 때의 최솟값을 알 수 있게 된다.

이를 쉽게 세팅하는 방법은 dp배열에서 1번 집의 색상 선택 비용을 결정한 색상을 제외하고 전부 `float('inf')`와 같이 선택 불가능한 수로 만드는 것이다.
`min` 함수를 통해서 최솟값을 선택할 때 무한대의 값은 절대 선택이 되질 않으므로, 자연스럽게 2번째 집의 색은 1번째와 같아지지 않을 것이다.

앞으로도 <b>원형</b> DP를 보게된다면 이 문제처럼 모든 경우의 수를 시도해보는 선형 DP로 바꾸는 걸 잊지 말아야겠다.

### 정답 코드
```python
from sys import stdin as input

n = int(input.readline())

# 0 = r, 1 = g, 2 = b
cost = []
for _ in range(n):
    cost.append(list(map(int, input.readline().split())))

# 1번 집은 2번과 n번과 같아선 안 된다.
# i번 째 집은 i-1,i+1과 같아선 안 된다.
ans = float('inf')
for i in range(3):
    # 1번집을 i로 고정
    dp = [[0] * 3 for _ in range(n)]
    for j in range(3): dp[0][j] = float('inf')
    dp[0][i] = cost[0][i]
    # dp[j] = min(dp[j-1])
    for j in range(1,n):
        # 0
        dp[j][0] = cost[j][0] + min(dp[j-1][1],dp[j-1][2])
        # 1
        dp[j][1] = cost[j][1] + min(dp[j-1][0],dp[j-1][2])
        # 2
        dp[j][2] = cost[j][2] + min(dp[j-1][0],dp[j-1][1])
    for k in range(3):
        if k != i:
            ans = min(dp[n-1][k], ans)

print(ans)
```
