---
title: "백준 2239번 스도쿠 (python)"
date: "2025-12-26 10:39:10"
category: "코테"
description: "python으로 풀어보는 백준 2239"
---

## 코딩 테스트 풀이

!["문제사진"](/images/2239.png)
<a href="https://www.acmicpc.net/problem/2239" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 2239번 문제 풀이에 대한 해설.

### 나의 접근
이전에 풀었던 <a href="https://vorschlag-blog.vercel.app/posts/baekjoon_9663" class="plink">
  N-Queen
</a>과 비슷해 보이지만 오히려 N-Queen을 풀었던 경험이 고정관념으로 남았다.

N-Queen과 비슷하게 <b>한 행</b>을 기준으로 백트래킹을 하면 되지 않을까?하고 생각했으나 작업의 단위에 대한 정의를 제대로 하지 못 했다.
백트래킹 함수를 구현할 때는 <b>딱 하나의 결정</b>만을 내리도록 설계하는 것이 가장 중요한 것 같다.

N-Queen의 경우에는 한 행에는 무조건 하나의 Queen만 들어갈 수 있다는 규칙이 존재한다. 따라서 백트래킹 내부에서 작업 단위는
<b>특정 행을 기준으로 몇 번째 열에 둘 것인가를 결정</b>하면 된다. 

반면 이번 스도구 문제는 한 행에 숫자가 여러 개가 빌 수 있다. 만약 이러한 상황에서 행을 기준으로 짠다고 생각해보자.  

함수 내부에선 행의 각 열을 모두 순회하면서 빈 칸들을 모두 고려하면 로직이 너무 복잡해질 것이다. 해당 함수 하나가 너무 많은 일을 한다고 생각하면 빠르게 포기하자.

결론적으로 이번 스도쿠 문제는 <b>빈 칸 자체를 기준</b>으로 백트래킹을 수행해야 한다. 백트래킹을 수행하기 전 비어있는 칸을 모두 list에 담고
해당 리스트의 인덱스를 기준으로 백트래킹을 하고 모두 순회할 경우 한 가지의 정답을 찾은 셈이다.

격자형 백트래킹 문제에서 채워야할 곳이 드문드문 있거나 불규칙적일 경우에는 좌표 리스트를 먼저 만드는 게 정석이라고 외워도 좋을 거 같다.

물론 스도쿠의 특성인 각 행/열에는 1-9의 숫자가 하나씩만 들어가야 한다는 점을 체크하기 위해선 `rows` 배열과 `cols` 배열을 통해서
검증하고 문제의 조건인 81자리 숫자 중 최소를 출력하기 위해서 항상 1부터 9의 오름차순으로 빈 칸에 들어갈 숫자를 기준으로 반복문을 돌았다.

그렇게 한다면 첫 번째로 정답을 찾았을 때가 곧 정답이므로 출력 후 `exit()`으로 프로그램을 종료하기만 하면 된다. 

마지막으로 3 * 3의 내부 삼각형에서도
1-9까지의 숫자가 모두 들어가야 하는데 특정 행/열에 대한 3*3크기의 작은 사각형을 검증하기 위한 시작점($r$,$c$)을 $(row / 3) * 3$으로 구해서 완전탐색으로
해당 숫자가 들어갔는지 확인해주면 된다.

### 정답 코드
```python
from sys import stdin as input

arr = []
for _ in range(9):
    arr.append(list(map(int,input.readline().strip())))

# 특정 행,열에 특정 숫자가 사용 가능한지 확인
blank = []

rows = [[False] * 10 for _ in range(9)]
cols = [[False] * 10 for _ in range(9)]

for i in range(9):
    for j in range(9):
        if arr[i][j] == 0: blank.append((i,j))
        else:
            num = arr[i][j]
            rows[i][num] = True
            cols[j][num] = True


def dfs(idx):
    global blank,arr
    if idx == len(blank):
        for i in range(9):
            print(''.join(map(str,arr[i])))
        exit()
    # 3,4 => 33
    r,c = blank[idx]
    row,col = (r // 3) * 3, (c // 3) * 3
    # r,c에 1-9중 가능한 최소 수를 넣어야 함
    for num in range(1,10):
        if rows[r][num] or cols[c][num]: continue
        # 3 * 3에 해당 숫자 없는지 확인
        flag = True
        for i in range(3):
            if not flag: break
            for j in range(3):
                if arr[row+i][col+j] == num:
                    flag = False
                    break
        
        if not flag: continue
        rows[r][num] = True
        cols[c][num] = True
        arr[r][c] = num
        dfs(idx+1)
        rows[r][num] = False
        cols[c][num] = False
        arr[r][c] = 0

dfs(0)
```
