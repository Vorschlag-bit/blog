---
title: "백준 1106번 호텔 (python)"
date: "2025-12-24 15:15:04"
category: "코테"
description: "python으로 풀어보는 백준 1106"
---

## 코딩 테스트 풀이

!["문제사진"](/images/1106.png)
<a href="https://www.acmicpc.net/problem/1106" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 1106번 문제 풀이에 대한 해설.

### 나의 접근
막연히 생각을 해보았다. $C$라는 특정 고객 수를 모으기 위해선 어떤 도시들을 얼마만큼 홍보해야 할까?
그건 마치 $a$도시를 2번, $b$번 도시를 1번 $c$번 도시를 1번 등으로 구성되어 있을 것이다.
즉, 어떤 도시들의 적절한 방문 횟수의 <b>조합(Combination)</b>을 구하는 문제라는 걸 알 수 있었다. 

또한 조합 속에서 최솟값을 찾는 문제이므로, <b>DP</b>를 사용하여 조합을 만들면 된다고 생각했다.  
그러한 점에서 이 문제는 이전에 풀었던 <a href="https://vorschlag-blog.vercel.app/posts/baekjoon_2410" style="color: #2f9e44; text-decoration: none;">
  2의 멱수의 합
</a>과 비슷한 성질을 갖고 있었다.

먼저 `cost`라는 배열에 입력된 <b>(홍보 비용, 얻을 수 있는 고객 수)</b>를 튜플로 저장했다.  
그 후에 DP 배열을 $$DP[n] = min(cost\ for\ N)$$이라고 생각하고 구현 방향을 고민했다.

처음에는 DP 배열의 크기를 딱 $C$에 맞춰서 계산을 했었는데, <b>예제 2</b>를 보면서 **적어도 n명 늘이기 위해**라는 키워드의 의미를
파악할 수 있었다.

따라서 특정 도시의 얻을 수 있는 고객 수 중 최댓값만큼 $C$에서 더하면 깔끔하게 구할 수 있을 거라 생각해서 최대 크기를 $c + l + 1$로 잡았다.  
그 이후에는 각 도시마다 <b>해당 도시에서 얻을 수 있는 고객 수 ~ DP배열 길이</b>만큼을 순회하면서 
$$DP[i] = min(DP[i], DP[i-customer] + cost)$$를 통해서 최솟값을 갱신했다.  

또한 $i$가 $$C$$ 이상일 경우엔 정답에 대한 최솟값도 따로 갱신함으로써  
맨 마지막에 $$C\sim len(DP)$$를 굳이 순회하지 않도록 했다.

### 정답 코드
```python
from sys import stdin as input

c,n = map(int,input.readline().split())

cost = [0] * n
l = 0
for i in range(n):
    # 홍보 비용, 얻을 수 있는 고객 수
    co,cos = map(int,input.readline().split())
    l = max(l,cos)
    cost[i] = (co,cos)
# 적어도 c명 얻기 위해 사용할 최소 비용 출력 -> 조합
# 도시별로 모두 다 차곡차곡 쌓아보기
# dp[n] = n명 얻기 위한 최소 비용
dp = [float('inf')] * (c+l+1)
dp[0] = 0
ans = float('inf')
for i in range(n):
    # 홍보 비용, 얻을 수 있는 고객 수
    bill,cos_n = cost[i]
    for j in range(cos_n,len(dp)):
        dp[j] = min(dp[j], dp[j-cos_n] + bill)
        if j >= c:
            ans = min(ans,dp[j])
print(ans)
```
