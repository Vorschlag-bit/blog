---
title: "백준 1647번 도시 분할 계획 (python)"
date: "2025-12-25 15:22:50"
category: "코테"
description: "python으로 풀어보는 백준 1647"
---

## 코딩 테스트 풀이

!["문제사진"](/images/1647.png)
<a href="https://www.acmicpc.net/problem/1647" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 1647번 문제 풀이에 대한 해설.

### 나의 접근
<a href="https://vorschlag-blog.vercel.app/posts/baekjoon_1197" class="plink">
  최소 신장 트리
</a>문제와 동일한 문제지만 간선 비용 중 최댓값 하나만 모든 간선 비용에서 빼주기만 하면 된다.

그 외에 똑같이 <b>Prim</b> 알고리즘을 사용해서 전형적으로 풀이하면 되는 문제.  
시간 복잡도는 다익스트라와 프림 모두 $$O(ElogV)\ or\ O(ElogE)$$이며, $E$는 간선의 개수, $V$는 정점의 개수이다.
따라서 이 문제에서 100만 * 5인 500만으로 2초 내에 매우 넉넉하게 통과할 수 있다.

### 정답 코드
```python
from sys import stdin as input
from collections import defaultdict
import heapq

# n은 10만, m은 100만
# 집,길
n,m = map(int,input.readline().split())

graph = defaultdict(list)
for _ in range(m):
    a,b,c = map(int,input.readline().split())
    graph[a].append((b,c))
    graph[b].append((a,c))

m = 0
visit = [False] * (n+1)
q = []
ans = 0
heapq.heappush(q,(0,1))
while q:
    cost,cur = heapq.heappop(q)
    if visit[cur]: continue
    visit[cur] = True
    ans += cost
    m = max(m,cost)
    for nxt,co in graph[cur]:
        if not visit[nxt]:
            heapq.heappush(q,(co,nxt))
print(ans - m)
```
