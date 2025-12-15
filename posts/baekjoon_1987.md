---
title: "백준 1987번 알파벳 (python)"
date: "2025-12-15 15:15:21"
category: "코테"
description: "python으로 풀어보는 백준 1987"
---

## 코딩 테스트 풀이

!["문제사진"](/images/1987.png)
<a href="https://www.acmicpc.net/problem/1987" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 1987번 문제 풀이에 대한 해설.

### 나의 접근
처음엔 머리를 비우고 bfs + set을 사용하되, 다음 방문 시도 시 `copy()` 함수를 통해 set을 복사해서
다른 방문 줄기로부터 영향을 받지 않게 했다.

하지만 그렇게 짜고나니 그냥 <b>dfs(backtracking)</b>로 푸는 게 정석이라는 걸 깨달았다.  
현재 루트에 대해 최대의 깊이로 탐색을 하고 불가능하면 최근 방문 기록을 지워서 새로운 탐색에 영향을 주지 않게 함으로써 
최대의 방문을 시도할 수 있는 것이다.

물론 생각하고, 처음에는 <b>dfs + set</b>의 조합으로 코드를 짰었다.
```python
for d in directions:
  nx,ny = cx + d[0], cy + d[1]
  if not check(nx,ny): continue
  char = arr[nx][ny]
  if char in visit: continue
  visit.add(char)
  # 다음 dfs 재귀 호출
  dfs()
  visit.remove(char)
```
대충 위와 같은 코드였다.  
하지만 시간초과로 통과하지 않아서, 최적화를 하기로 결정했고 알파벳은 최대 26개이므로 `visit = [0] * 26`이라는 26크기의 방문배열을
통해서 훨씬 빠른 속도로 방문 백트래킹을 시도했다.

하지만 이래도 python으로는 통과할 수 없다.  
python에서 <b>재귀는 오버헤드가 큰 작업이라 많이 느리다, 따라서 반드시 pypy3를 통해서 컴파일하자!</b>

### 정답코드
```python
from sys import stdin as input
import sys
sys.setrecursionlimit(10**5)
n,m = map(int, input.readline().split())
arr = []
for _ in range(n):
    arr.append(list(map(str,input.readline().rstrip())))

directions = [(0,1),(1,0),(0,-1),(-1,0)]
visit = [False] * 26

def check(a,b):
    return 0 <= a < n and 0 <= b < m

ans = 0
start = ord(arr[0][0]) - 65
visit[start] = True

def dfs(cx,cy,step,visit):
    global ans
    ans = max(ans, step)

    for d in directions:
        nx,ny = cx + d[0], cy + d[1]
        if not check(nx,ny): continue
        char = ord(arr[nx][ny]) - 65
        if visit[char]: continue
        visit[char] = True
        dfs(nx,ny,step+1,visit)
        visit[char] = False

dfs(0,0,1,visit)
print(ans)
```

### 후기
<b>재귀(Recursion)</b>문제를 python으로 풀 때는 반드시 <code>sys</code>를 통해서 재귀 depth를 넉넉하게 주고
pypy3를 컴파일러로 사용해야 한다는 걸 배울 수 있었다.