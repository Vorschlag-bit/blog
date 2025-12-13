---
title: "백준 2252번 줄 세우기 (python)"
date: "2025-12-13 16:09:45"
category: "코테"
description: "python으로 풀어보는 백준 2252"
---

## 코딩 테스트 풀이

!["문제사진"](/images/2252.png)
<a href="https://www.acmicpc.net/problem/2252" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 2252번 문제 풀이에 대한 해설.

### 나의 접근
위상 정렬을 대표하는 문제.  
위상 정렬 템플릿을 연습하기 위해 풀어보았다. `indegree`를 사용해서 특정 노드 앞에 배치되어야 할 노드 개수를 계속 점검하면서
indegree가 0이 되는 순간 자신의 차례이므로 q와 result 배열에 들어가도록 구현했다.  

<a href="https://vorschlag-blog.vercel.app/posts/baekjoon_2157" style="color: #2f9e44; text-decoration: none;">
  백준 2157번 여행
</a>문제로 위상 정렬에 대한 개념을 학습한 김에 문제도 익혀보고 싶어서 풀게 되었다.

### 정답 코드
```python
from sys import stdin as input
from collections import defaultdict,deque
graph = defaultdict(list)
n,m = map(int,input.readline().split())

indegree = [0] * (n+1)

for _ in range(m):
    # a,b -> a가 b앞에 서야한다는 의미
    a,b = map(int,input.readline().split())
    indegree[b] += 1
    graph[a].append(b)

q = deque()
result = []
for i in range(1,n+1):
    if indegree[i] == 0:
        q.append(i)

while q:
    cur = q.popleft()
    result.append(cur)
    for nxt in graph[cur]:
        indegree[nxt] -= 1
        if indegree[nxt] == 0:
            q.append(nxt)

print(' '.join(map(str, result)))
```

