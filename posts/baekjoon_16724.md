---
title: "백준 16724번 피리 부는 사나이 (python)"
date: "2026-01-07 15:19:13"
category: "코테"
description: "python으로 풀어보는 백준 16724"
---

## 코딩 테스트 풀이

!["문제사진"](/images/16724.png)
<a href="https://www.acmicpc.net/problem/16724" class="plink">
  문제링크
</a>

백준 16724번 문제 풀이에 대한 해설.

### 나의 접근
격자 탐색이라는 걸 통해서 <b>bfs</b>로 접근하면 된다고 생각했다.

다만 탐색을 통해 서로 범접하지 않는 최적의 공간을 나누는 방식을 어떻게 처리해야 할지를 몰라서
문제 분류 카테고리를 보았고, <b>분류 집합</b>이라는 키워드를 보게 되었다.

그렇다면 이 문제는 서로 같은 루트를 공유하는(같은 트리를 형성하는) 것끼리 집합으로 묶어서
집합의 총 개수를 세는 문제로 보면 될 것이다.

다만 그렇다고 일반적인 bfs의 `visit`배열을 사용하면 안 된다.

처음에는 보통의 bfs처럼 bool 타입의 `visit` 배열을 사용해서 재방문 금지 로직을 구현했었는데
아래와 같은 반례들이 존재했었다.

<b>1. 현재 탐색에서 이미 탐색한 곳을 다시 마주침</b>  
  - 'LLR' 같은 상황이다. 가장 왼쪽 'L'에서 탐색을 시작해서 마지막 'R'차례가 될 때, 다시 이전에 탐색한 가운데 'L'을 마주치게
  될 것이다. 이럴 경우에는 새로운 집합을 찾은 셈이다.

<b>2. 현재 탐색에서 이전에 bfs로 탐색한 곳을 마주침</b>
  - 'LLRL' 같은 상황이다. 맨 오른쪽의 L의 경우 탐색 시, 'LLR'이라는 집합을 마주치게 된다. 이럴 경우엔 맨 오른쪽의 'L' 역시
  'LLR'이라는 집합의 한 부분으로 들어가게 된다.

이런 반례들만 조심해서 코드를 구현하면 되는데, 이를 구현하기 위해서 일반적인 `bool` 타입 `visit` 배열을 쓴다면 매우 힘들다.

따라서 `int` 타입 방문 배열을 통해 매 bfs마다 `cnt`라는 변수를 통해 현재 이뤄지고 있는 탐색이 전체 bfs 중 몇 번째인지를
명확하게 판단하고 앞서 말한 조건의 경우에는 전체 집합에서 -1(이미 있던 집합이므로)을 해줘야 한다.

### 정답 코드
```python
from sys import stdin as input
from collections import deque

n,m = map(int,input.readline().split())
directions = [(0,1),(1,0),(-1,0),(0,-1)]
nd = { 'D':1, 'U':2, 'L':3, 'R':0 }
# 1000 * 1000 = 1000000(백만)
# bfs
visit = [[-1] * m for _ in range(n)]
ans = 0
arr = []
for _ in range(n):
    arr.append(list(map(str,input.readline().strip())))

def check(x,y): return 0 <= x < n and 0 <= y < m

def bfs(sx,sy,num):
    q = deque()
    visit[sx][sy] = num
    q.append((sx,sy))
    # 이전에 있던 집합과 연결되었는지를 판단해줄 flag
    flag = False
    while q:
        cx,cy = q.popleft()
        d = nd[arr[cx][cy]]
        nx,ny = cx + directions[d][0], cy + directions[d][1]
        if not check(nx,ny): continue
        if visit[nx][ny] == num: continue
        # 이전의 집합과 연결되는 탐색임
        if visit[nx][ny] != num and visit[nx][ny] != -1: 
            flag = True
            continue
        visit[nx][ny] = num
        q.append((nx,ny))
    return flag

cnt = 0
for i in range(n):
    for j in range(m):
        if visit[i][j] == -1:
            ans += 1
            cnt += 1
            # 이미 존재하는 집합과 연결되는 거면 -1
            if bfs(i,j,cnt): ans -= 1

print(ans)
```
