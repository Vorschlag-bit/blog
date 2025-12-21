---
title: "백준 1766번 문제집 (python)"
date: "2025-12-21 21:59:20"
category: "코테"
description: "python으로 풀어보는 백준 1766"
---

## 코딩 테스트 풀이

!["문제사진"](/images/1766.png)
<a href="https://www.acmicpc.net/problem/1766" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 1766번 문제 풀이에 대한 해설.

### 나의 접근
<b>반드시 먼저 풀어야 하는 순서</b>가 존재하고, 문제는 언제나 작은 번호부터 큰 번호로 증가하는 방향성을 가지므로  
<b>사이클이 없는 그래프</b>. 즉, <b>위상 정렬(Topological Sort)</b>을 활용한 문제라는 걸 알 수 있다.

다만 문제의 3가지 조건을 살펴보면, 가능한 <b>작은 번호</b>부터 풀면 된다는 조건이 있는데, 이 때문에 일반 Queue를 사용하는
위상 정렬과는 살짝 다르게 <b>Heap</b>을 사용해서 최소힙을 유지하며 노드를 순회하면 된다.

그 외에는 일반 위상 정렬과 완벽하게 동일한 템플릿.

### 정답 코드
```python
from sys import stdin as input
from collections import defaultdict
import heapq
# n개의 문제를 모두 풀어야 한다.
# 먼저 푸는 것이 좋은 문제가 있는 문제, 먼저 푸는 문제를 반드시 먼저 풀어야 한다.
# 가능하면 쉬운 것부터 풀어야 한다.

n,m = map(int,input.readline().split())
# a,b => a문제는 b번 문제보다 먼저 푸는 게 좋음

# heap을 사용한 위상 정렬
indegree = [0] * (n+1)
# graph[a] = [b] -> b를 풀기 위해선 a를 풀어야 한다.
graph = defaultdict(list)

for _ in range(m):
    a,b = map(int,input.readline().split())
    graph[a].append(b)
    indegree[b] += 1

ans = []
q = []
for i in range(1,n+1):
    # 진입차수가 0인 작은 문제부터 heap에 넣기
    if indegree[i] == 0:
        heapq.heappush(q,i)

while q:
    cur = heapq.heappop(q)
    # 최소 힙의 원리에 따라 최솟값부터 ans에 추가됌
    ans.append(cur)
    for nxt in graph[cur]:
        indegree[nxt] -= 1
        if indegree[nxt] == 0:
            heapq.heappush(q,nxt)

print(' '.join(map(str,ans)))
```
