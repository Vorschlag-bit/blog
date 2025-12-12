---
title: "DAG(Directed Acyclic Graph)와 위상정렬(Topological Sort)"
date: "2025-12-12 15:24:23"
category: "코테"
description: "DAG와 위상정렬의 개념과 코테에서 응용 방식에 대해서 알아보자."
---

## DAG(Directed Acyclic Graph)와 위상정렬(Topological Sort) 학습

이전까지 코테를 풀면서 그래프 유형을 많이 풀어봤지만, 위상정렬 문제를 많이 풀어보지 않았었다.(어쩌면 풀어봤는데 이게 위상정렬인지 몰랐나?)
그래서 확실히 익히고자 위상정렬과 관련된 **DAG**와 **위상정렬** 자체에 대해 학습하고 코테에서 어떻게 사용되는지 정리해봤다.

### DAG(Directed Acyclic Graph) - 방향성 비순환 그래프
이름은 복잡하게 생겼지만 한글로 해석하면 방향성이 있고 순환하지 않는 **트리**라고 생각하면 된다.  
사이클이 없기 때문에 **시작점**과 **끝점**이 명확하고, **순서**가 정해져 있다는 게 특징이다.

### 위상정렬(Topological Sort)
DAG인 그래프의 모든 노드를 **방향성을 거스르지 않도록 순서대로 나열**하는 것이다.  
만약 A -> B라는 간선 정보가 있다면, 정렬 결과 **A는 반드시 B 앞에 존재해야 한다**.  
특징으로는 **DAG에서만 가능한 정렬**이며, **답이 여러 개**일 수도 있다. (A,B가 상관없다면 순서 고려 X)

### 알고리즘 동작원리 (진입차수 방식)
위상정렬은 **BFS**와 비슷하지만, `visited` 배열 대신에 `indegree`(진입차수)를 사용한다는 점이 다르다.  
이 방식은 <strong>"선수 조건(내 앞에 있는 얘들)이 다 해결되었는가?"</strong>를 체크하는 과정이다.

**진입차수**  
- 나에게 들어오는 화살표의 개수이다.
- 진입차수가 0이라는 의미는 <strong>"나보다 먼저 해야할 일들이 다 끝남"</strong>을 나타낸다.

<strong>알고리즘(Kahn's algorithm)</strong>  

- 1. 모든 노드의 진입차수를 계산한다.
- 2. 진입차수가 **0**인 노드를 **Queue**에 다 넣는다.(시작 가능한 노드들)
- 3. Queue에서 노드를 하나 꺼내 결과 리스트에 담는다.
    - 해당 노드와 연결된 **다음 노드들의 진입차수를 1씩 뺀다**.
    - 만약 진입차수를 뺀 수가 **0이라면 Queue에 넣는다**.
- 4. Queue가 다 빌 때까지 반복

**python 코드 예시**
```python
import sys
from collections import deque

# v: 노드 개수, e: 간선 개수
v, e = map(int, sys.stdin.readline().split())

# 진입차수: 모든 노드에 대한 진입차수는 0으로 초기화
indegree = [0] * (v + 1)

# 간선 정보 리스트
graph = [[] for _ in range(v + 1)]

# 방향 그래프의 모든 간선 정보를 입력받기
for _ in range(e):
    a, b = map(int, sys.stdin.readline().split())
    graph[a].append(b) # A -> B
    indegree[b] += 1   # B의 진입차수 1 증가

def topology_sort():
    result = []
    q = deque()

    # 1. 처음 시작할 때 진입차수가 0인 노드를 큐에 삽입
    for i in range(1, v + 1):
        if indegree[i] == 0:
            q.append(i)

    # 큐가 빌 때까지 반복
    while q:
        # 큐에서 원소 꺼내기
        now = q.popleft()
        result.append(now)

        # 해당 원소와 연결된 노드들의 진입차수에서 1 빼기
        for next_node in graph[now]:
            indegree[next_node] -= 1
            # 2. 새롭게 진입차수가 0이 되는 노드를 큐에 삽입
            if indegree[next_node] == 0:
                q.append(next_node)

    # 결과 출력
    for i in result:
        print(i, end=' ')

topology_sort()
```

### 코딩 테스트 출제 유형
위상정렬은 문제에서 대놓고 "위상정렬 하세요"라고 주어기보단 <strong>'상황'</strong>으로 주어진다.  

#### 유형 1: 순서 정하기
- **키워드** : '순서', '차례', '줄세우기'
- **해법** : 그냥 위상 정렬 템플릿으로 풀기
- **대표 문제** : <a href="https://www.acmicpc.net/problem/2252" style="color: #2f9e44; text-decoration: none;">
  백준 2252번(줄세우기)
</a>

#### 유형 2: 선후 관계가 있는 작업의 최소 시간/비용 (DP + 위상정렬)
- **키워드** : '건설', '생산', '이거하려면 저거 끝나야 함'
- **해법**:
  - 단순히 순서만 중요한 게 아니라, **내 앞의 작업들 중 가장 오래 걸리는 작업**이 끝나야 내가 시작할 수 있음.
  - Queue에서 `next_node` 진입차수를 깎을 때, **DP 점화식**을 함께 사용한다.
  - `dp[next] = max(dp[next], dp[now] + time[next])`
- **대표 문제** : <a href="https://www.acmicpc.net/problem/1005" style="color: #2f9e44; text-decoration: none;">
  백준 1005번 ACM Craft
</a>

#### 유형 3: 특정 조건이 있는 순서 (Heap 사용)
- **상황** : "가능한 쉬운 문제부터(작은 번호부터) 풀기"
- **해법** : 일반 Queue 대신 `heapq`을 사용해서 풀면 된다. 진입차수가 0인 노드들 중 가장 작은 번호부터 꺼내기.
- **대표 문제** : <a href="https://www.acmicpc.net/problem/1766" style="color: #2f9e44; text-decoration: none;">
  백준 1766 문제집
</a>