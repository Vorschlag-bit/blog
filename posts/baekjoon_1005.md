---
title: "백준 1005번 ACM Craft (python)"
date: "2025-12-13 21:06:22"
category: "코테"
description: "python으로 풀어보는 백준 1005"
---

## 코딩 테스트 풀이

!["문제사진"](/images/1005.png)
<a href="https://www.acmicpc.net/problem/1005" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 1005번 문제 풀이에 대한 해설.

### 나의 접근
**줄 세우기**, **순서**라는 키워드를 통해서 **위상 정렬**이라는 걸 알아채야 한다.  
물론 단순한 위상 정렬 템플릿 코드만으로는 풀리지 않는다. **최솟값**이라는 키워드가 있으므로, **DP**를 통해서
값을 누적시키며 찾아나서야 한다.

문제의 예시로 점화식을 세워보려고 해보자.  
가장 마지막 건물인 4번 건물을 짓기 위해선 앞에 있는 모든 건물들이 다 완성이 되어 있어야 한다.  
또한 모든 건물들은 같은 레벨에 있을 경우 **동시에** 생성이 가능하다.
따라서 4번 건물을 지을 때 걸리는 시간은 앞선 건물들 중 가장 오래 걸리는 시간들의 합과 같다.  

즉, **1번** 건물을 $$level\ 1$$, **2,3번** 건물을 $$level\ 2$$, **4번** 건물을 $$level\ 3$$이라고 가정할 때, $$level\ 2$$ 건물들에선 최대 소요 시간인 **100**,
$$level\ 1$$ 건물에선 최대 소요 시간인 **10**의 합인 **110**이 4번 건물을 짓기까지 필요한 최소의 시간이고, 거기에 4번 자체의 소요 시간만 더해주면 된다.

이를 점화식으로 세우면 $$ dp[nxt] = max(dp[nxt], dp[cur] + time[cur]) $$로, 특정 노드 nxt과 연결된 진입 차수 노드들의
시간값을 계속 비교하면서 최댓값을 누적시켜 나가면 된다.

### 정답 코드
```python
from sys import stdin as input
from collections import deque,defaultdict
# 특정 건물까지 최소 시간
t = int(input.readline())
ans = []
for _ in range(t):
    # 건물 개수, 규칙 총 개수
    n,k = map(int,input.readline().split())
    # 건물 짓는 쇼요 시간
    time = [0] + list(map(int,input.readline().split()))
    graph = defaultdict(list)
    # x,y -> y가 x 앞에 위치해야 한다
    indegree = [0] * (n+1)
    for _ in range(k):
        x,y = map(int,input.readline().split())
        indegree[y] += 1
        graph[x].append(y)
        # graph[a] = (b,c) -> a로부터 b 노드가 c만큼의 가중치로 떨어져 있음.
    # 목표 건물
    w = int(input.readline())
    q = deque()
    # ingdegree가 0인 거 q에 넣기
    for i in range(1,n+1):
        if indegree[i] == 0:
            q.append(i)
    # 최소의 시간은 i를 지을 수 있는데까지 걸리는 데에 최대 시간 + 해당 소요 시간
    # dp[nxt] = max(dp[nxt], dp[cur] + time[cur])
    dp = [0] * (n+1)
    while q:
        cur = q.popleft()
        if cur == w:
            ans.append(dp[cur] + time[cur])
            break
        for nxt in graph[cur]:
            indegree[nxt] -= 1
            dp[nxt] = max(dp[nxt], dp[cur] + time[cur])
            if indegree[nxt] == 0:
                q.append(nxt)
print('\n'.join(map(str,ans)))
```