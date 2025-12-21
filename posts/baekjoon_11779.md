---
title: "백준 11779번 최소 비용 구하기 2 (python)"
date: "2025-12-21 15:09:34"
category: "코테"
description: "python으로 풀어보는 백준 11779"
---

## 코딩 테스트 풀이

!["문제사진"](/images/11779.png)
<a href="https://www.acmicpc.net/problem/11779" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 11779번 문제 풀이에 대한 해설.

### 나의 접근
특정 노드에 특정 노드로 향하는 가중치가 있는 그래프 문제에선 2가지 방법을 통해 최소 거리를 풀 수 있다.  
첫 번째는 <b>사이클이 없는 경우</b> 위상 정렬을 통해서 진입 차수 계산과 DP의 Memorization을 활용한 풀이이다. (ACM Craft 같은)  
두 번쨰는 <b>사이클이 있는 경우</b> 다익스트라를 통해 Heap을 활용한 최단 거리 계산 방법이다.  

이 문제는 $$A -> B$$라는 루트지만, 주어지는 값에서 $$1 -> 3$$과 $$3 -> 1$$이 함께 존재할 수 있기 때문에 사이클이 생겨서 위상 정렬로는
풀 수 없다. 따라서 다익스트라를 통해 풀면 된다.

최소 비용을 `visit` 배열을 통해서 쉽게 구하면 되고, 최단 루트와 방문한 노드의 개수를 출력하는 것은 최종 도착점 $$t$$로부터 다익스트라의 특성을
활용해 최소 비용으로 도달한 이전 노드의 번호를 기록한 배열인 `ex`를 통해서 역추적한 후 뒤집으면 된다.

### 정답 코드
```python
from sys import stdin as input
from collections import defaultdict
import heapq

n = int(input.readline())
m = int(input.readline())
graph = defaultdict(list)

for _ in range(m):
    a,b,c = map(int,input.readline().split())
    graph[a].append((b,c))

s,t= map(int,input.readline().split())

route = []
ans = float('inf')
visit = [float('inf')] * (n+1)
visit[s] = 0
q = []
heapq.heappush(q,(0,s))
ex = [float('inf')] * (n+1)
while q:
    til,cur = heapq.heappop(q)
    if visit[cur] < til: continue
    for nxt,cost in graph[cur]:
        total = til + cost
        if total >= visit[nxt]: continue
        visit[nxt] = total
        ex[nxt] = cur
        heapq.heappush(q,(total,nxt))

print(visit[t])

cur = t
route.append(t)
while cur != s:
    route.append(ex[cur])
    cur = ex[cur]

print(len(route))
print(' '.join(map(str,route[::-1])))
```