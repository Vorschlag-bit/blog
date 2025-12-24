---
title: "백준 15681번 트리와 쿼리 (python)"
date: "2025-12-24 13:23:05"
category: "코테"
description: "python으로 풀어보는 백준 15681"
---

## 코딩 테스트 풀이

!["문제사진"](/images/15681.png)
<a href="https://www.acmicpc.net/problem/15681" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 15681번 문제 풀이에 대한 해설.

### 나의 접근
방향성이 없다고 주어졌길래 그럼 모든 노드가 루트가 될 수 있는 거 아닌가? 싶었지만 루트 노드도 분명하게 제시하기 때문에 사실상
방향성이 있는 거 아닌가? 싶었다.

나름 생각을 해본 결과, 그래프 자체는 분명 방향성이 없도록 주어진 건 확실하다.  
$a,b$라는 간선 정보가 주어졌을 때, `graph[a].append(b)`, `graph[b].append(a)`를 하지 않으면 풀 수 없기 때문이다.

다만 그렇게 사이클이 있는 그래프를 $r$이라는 루트가 있는 트리로 만들어서 순회하는 게 핵심인 문제였다.

그래프 순회는 `visit` 배열을 사용해서 자식 -> 부모로 역주행만 하지 않게 하면 된다.  
또한 명확한 서브 트리 구분을 위해서 <b>DFS(재귀)</b>로 풀어야 하는데
재귀를 통해서 문제를 풀 경우, 문제의 최대 노드 수가 10만 개이기 때문에 재귀 제한 수를 늘려줘야 한다.  

### 정답 코드
```python
from sys import stdin as input
from collections import defaultdict
import sys
sys.setrecursionlimit(10**6)
n,r,q = map(int,input.readline().split())

# 정점 u를 루트로 하는 서브 트리에 속한 노드의 개수
cnt = [0] * (n+1)
visit = [False] * (n+1)
graph = defaultdict(list)

for _ in range(n-1):
    a,b = map(int,input.readline().split())
    graph[a].append(b)
    graph[b].append(a)

def countSub(node):
    global cnt,visit
    cnt[node] = 1
    for child in graph[node]:
        if not visit[child]:
            visit[child] = True
            countSub(child)
            cnt[node] += cnt[child]
result = []
visit[r] = True
countSub(r)
for _ in range(q):
    node = int(input.readline())
    result.append(cnt[node])
print('\n'.join(map(str,result)))
```
