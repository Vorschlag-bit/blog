---
title: "백준 2342번 Dance Dance Revolution (python)"
date: "2026-01-03 14:26:12"
category: "코테"
description: "python으로 풀어보는 백준 2342"
---

## 코딩 테스트 풀이

!["문제사진"](/images/2342.png)
<a href="https://www.acmicpc.net/problem/2342" class="plink">
  문제링크
</a>

백준 2342번 문제 풀이에 대한 해설.

### 나의 접근
마치 수많은 경우의 수를 계산해야 할 것 같아 보이지만, 최대한 중복 계산을 줄이는 방법을 생각하면 <b>DP</b>가
최적화된 알고리즘이라는 걸 알 수 있다.

먼저 dp 테이블은 다음과 같이 정의했다.
$$
dp[i][j][k]=i턴에\ 왼발이\ j,\ 오른발이\ k일\ 때\ 최솟값
$$
그리곤 문제에서 주어진대로 현재 위치에서 다음 위치로 넘어갈 때 `cost`를 계산하는 `get_c()` 함수를 구현했다.
이건 뭐 간단한 내용이니 쉽게 구현하면 된다.

최대 10만 * 5 * 5의 반복문을 탐색하기 때문에 2초라는 시간은 매우 넉넉할 것이다.  
문제의 조건에서 나온 <b>양 발이 같은 위치 불가(0,0일 때 제외하고)</b> 조건과  
`dp[i][r][l] == float('inf')`일 경우는
곧 해당 스텝이 불가능한 경우의 수라는 의미이므로 가지치기로 넘어간다면 더 빠른 탐색이 가능할 것이다.

### 정답 코드
```python
from sys import stdin as input

cmd = list(map(int,input.readline().split()))

# 중앙에 있는 발이 움직이면 2
# 인접한 곳 이동이면 3(왼->위/아래, 위->오른/왼)
# 반대편으로 이동하면 4(왼->오른, 위->아래)
# 같은 지점이면 1

# DP
# dp[i][j][k] = i턴에 왼발이 j, 오른발이 k인 상태
dp = [[[float('inf')] * 5 for _ in range(5)] for _ in range(len(cmd))]
# 위 = 1, 왼쪽 = 2, 아래 = 3, 오른쪽 = 4, 가운데 = 0
def get_c(cur,nxt):
    # 제자리
    if cur == nxt: return 1
    if cur == 0: return 2
    # 반대
    if (cur+2)%4 == nxt%4: return 4
    # 인접
    else: return 3

dp[0][0][0] = 0
for i in range(len(cmd)-1):
    nxt = cmd[i]
    for r in range(5):
        for l in range(5):
            # 둘 다 같은 발이면 안 됌
            if r != 0 and l != 0 and r == l: continue
            # 해당 스탭이 애초에 불가능한 경우면 pass
            if dp[i][l][r] == float('inf'): continue
            l_c = get_c(l,nxt)
            r_c = get_c(r,nxt)
            # 왼발
            dp[i+1][nxt][r] = min(dp[i][l][r] + l_c, dp[i+1][nxt][r])
            # 오른발
            dp[i+1][l][nxt] = min(dp[i][l][r] + r_c, dp[i+1][l][nxt])

ans = float('inf')
for r in range(5):
    for l in range(5):
        ans = min(ans, dp[len(cmd)-1][r][l])

print(ans)
```
