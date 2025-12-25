---
title: "백준 1197번 최소 스패닝 트리 (python)"
date: "2025-12-25 15:01:13"
category: "코테"
description: "python으로 풀어보는 백준 1197"
---

## 코딩 테스트 풀이

!["문제사진"](/images/1197.png)
<a href="https://www.acmicpc.net/problem/1197" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 1197번 문제 풀이에 대한 해설.

### 나의 접근
최소 신장 트리(MST, Minimum Spanning Tree)란, <b>
  가중치가 있는 연결된 무방향 그래프에서 모든 정점을 연결하며, 동시에 간선들의 가중치 총합이 최소가 되도록
  선택된 사이클이 없는 부분 그래프</b>이다.

그래프를 사이클이 없는 트리 형태로 만드는 것이기 때문에 `visit` 배열을 활용해야 하며, 특정 노드에 도달할 수 있는 최소 비용을 구하기 위해
<b>Heap</b>을 사용해서 최소 비용을 보장하는 <b>프림(Prim)</b> 알고리즘이 대표적이다.

먼저 Heap은 MST와 연결된 간선 중 가장 최솟값을 Heap의 원리에 의해 가장 맨 위에 올려놓는다. (최소힙)  
따라서 Heap에서 나오는 순간이 현 시점에서 선택할 수 있는 해당 노드 최소 비용임을 보장한다.

`visit`(Boolean) 배열은 이 노드가 MST에 포함된 것인지 아닌지를 판별한다. Heap에서 꺼냈으나, 이미 방문한 노드일 경우 해당 노드는 이미
최소 비용을 보장하므로 다시 재방문할 필요가 없어진다.

### 정답 코드
```python
from sys import stdin as input
from collections import defaultdict
import heapq

n,e = map(int,input.readline().split())
graph = defaultdict(list)
m = float('inf')
for _ in range(e):
    a,b,c = map(int,input.readline().split())
    m = min(m,c)
    graph[a].append((b,c))
    graph[b].append((a,c))

# 최소 스패닝 트리 = 주어진 모든 정점들을 연결하는 부분 그래프 중에서 가중치 합이 최소인 트리
# 시작점 안 중요, 어차피 다 들릴 것.
# 특정 노드가 MST에 포함됐는지 안 됐는지 확인
visit = [False] * (n + 1)
ans = 0
q = []
# t,cur
heapq.heappush(q,(0,1))
while q:
    t,cur = heapq.heappop(q)
    if visit[cur]: continue
    visit[cur] = True
    ans += t
    for nxt,cost in graph[cur]:
        if not visit[nxt]:
            heapq.heappush(q,(cost,nxt))

print(ans)
```
