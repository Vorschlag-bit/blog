---
title: "백준 9663번 N-Queen (python)"
date: "2025-12-18 15:37:17"
category: "코테"
description: "python으로 풀어보는 백준 9663"
---

## 코딩 테스트 풀이

!["문제사진"](/images/9663.png)
<a href="https://www.acmicpc.net/problem/9663" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 9663번 문제 풀이에 대한 해설.

### 나의 접근
퀸을 배치할 때는 반드시 1행에 1개, 1열에 1개만 배치할 수 있다.  
퀸을 0번 행부터 차례대로 배치한다고 가정할 때 특정 행 $$r$$에 배치하기 위해선 $$0~r-1$$행에 대해서 
열과 오른쪽 대각선(↗), 왼쪽 대각선(↘)만 확인하면 된다.  

열은 앞서 말했듯이 모든 열에 1개의 퀸만 배치될 수 있으므로 크기 $$N$$짜리 visit배열 하나로 체크가 가능하다.  

오른쪽 대각선은 행렬의 특징을 이용하면 된다.  
특정 좌표(r,c)에 대해서 오른쪽 위 대각선은 모두 같은 합을 같고 있다. (최소 0 ~ 최대 2 * N -1)
이 성질을 이용해서 $$r,c$$에 퀸을 둘 경우 이 행의 위쪽 오른쪽 대각선으로 다른 퀸이 없는지는 <code>visit[r+c]</code>를 통해서 알 수 있다.

마지막으로 오른쪽 아래 대각선은 <b>행 - 열의 값이 모두 일정한</b> 특성을 갖고 있다.   (최소 -N + 1 ~ 최대 n -1)
따라서 $$r - c + N$$을 통해 왼쪽 대각선에 다른 퀸이 없는지를 판단하면 된다.

### 정답 코드
```python
n = int(input())

visit_col = [False] * n
visit_d1 = [False] * (2*n)
visit_d2 = [False] * (2*n)

arr = [[0] * n for _ in range(n)]

ans = 0

# 현재 배치한 q 수, 배열
def dfs(r):
    global n,ans
    if r == n:
        ans += 1
        return
    
    for c in range(n):
        if not visit_col[c] and not visit_d1[r+c] and not visit_d2[r-c+n]:
            visit_col[c] = True
            visit_d1[r+c] = True
            visit_d2[r-c+n] = True
            dfs(r+1)
            visit_col[c] = False
            visit_d1[r+c] = False
            visit_d2[r-c+n] = False
dfs(0)
print(ans)
```
