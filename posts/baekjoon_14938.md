---
title: "백준 14938번 서강그라운드 (python)"
date: "2025-12-20 15:04:42"
category: "코테"
description: "python으로 풀어보는 백준 14938"
---

## 코딩 테스트 풀이

!["문제사진"](/images/14938.png)
<a href="https://www.acmicpc.net/problem/14938" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 14938번 문제 풀이에 대한 해설.

### 나의 접근
<b>방향성이 없고 가중치가 있는 그래프에 대한 탐색</b>이므로, 다익스트라를 쉽게 떠올릴 수 있다.

최대로 얻을 수 있는 아이템은 모든 노드를 시작점으로 했을 때, 해당 노드에서 최대한 많은 노드를 방문하면
아이템을 얻을 수 있을 것이다. 

따라서 다익스트라로 모든 노드를 시작점으로 최소 거리로 최대 노드를 방문한 후
방문 가능한 노드를 기준으로 획득 아이템 양을 계산하고 이 중 최댓값을 출력하면 된다.

### 정답 코드
```python
from sys import stdin as input
from collections import defaultdict
import heapq

n,m,r = map(int,input.readline().split())
# 1-based
cost = [0] + list(map(int,input.readline().split()))
graph = defaultdict(list)

for _ in range(r):
    a,b,l = map(int,input.readline().split())
    graph[a].append((b,l))
    graph[b].append((a,l))

# 어느 노드에 최소 비용으로 노달하면 최대한 먼 거리를 도달 => 최대 개수 보장
# 모든 지점을 시작점으로 했을 때 최댓값
ans = 0

def dijkstra(start):
    global ans,cost,graph,n,m
    visit = [float('inf')] * (n+1)
    q = []
    heapq.heappush(q,(start,0))
    visit[start] = 0
    while q:
        cur,til = heapq.heappop(q)
        if til > visit[cur]: continue

        for nxt,c in graph[cur]:
            total = til + c
            if total > m: continue
            if visit[nxt] >= total:
                visit[nxt] = total
                heapq.heappush(q,(nxt,total))

    # 방문 가능한 모든 노드 방문 후, 최댓값 계산
    cnt = 0
    for node in range(1,n+1):
        if visit[node] != float('inf'):
            cnt += cost[node]
    ans = max(ans,cnt)

for node in range(1,n+1):
    dijkstra(node)

print(ans)
```

