---
title: "백준 10942번 펠린드롬?  (python)"
date: "2025-12-28 14:25:45"
category: "코테"
description: "python으로 풀어보는 백준 10942"
---

## 코딩 테스트 풀이

!["문제사진"](/images/10942.png)
<a href="https://www.acmicpc.net/problem/10942" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 10942번 문제 풀이에 대한 해설.

### 나의 접근
python 기준으로 시간제한은 약 1.5초, 1억 5천만번의 연산을 수행할 수 있다.  
하지만 문제의 조건을 보면 수열의 길이는 최대 2000, 질문의 개수는 최대 100만이므로 일일히 질문에 맞춰 펠린드롬임을 파악하면
약 20억 번의 연산을 수행해야 한다.

따라서 생각을 좀 다르게 해볼 필요가 있다.  
미리 모든 구간 $s\ \sim e$에 대해서 해당 구간의 수들이 펠린드롬인지 아닌지를 모두 구해놓는다면 200만 번의 연산만 수행하면 될 것이다.  
특정 구간 $s\ \sim e$가 펠린드롬인지 아닌지를 어떻게 알 수 있을까? 

펠린드롬의 특성을 살펴보면 방법을 알 수 있다. 앞서 말했듯이 모든 구간에 대한 펠린드롬임을 파악할 때 가장 중요한 규칙이 있다.  
$s\ \sim e$의 구간이 펠린드롬하다면 $s\ -\ 1$부터 $e\ +\ 1$의 구간은 $arr[s-1]$과 $arr[e+1]$이 같다면 마찬가지로 펠린드롬하다는 것이다.

즉, 내부의 작은 문제가 해결되면 그 밖의 큰 문제가 해결되는 <b>DP</b>의 특징을 갖고 있다.  
DP인 걸 알았으니 DP 테이블은 아주 쉽게 정의할 수 있다. $dp[i][j]$는 $i$부터 $j$까지의 문자열이 펠린드롬한지 아닌지를 저장한다. (Boolean)  
점화식의 경우에는 일반적인 DP와 다르게 $i$와 $j$를 기준으로 반복문을 구성할 것이 아니라, <b>판단할 문자열의 길이</b>를 기준으로 보면 된다.

먼저 길이가 1인 문자열은 모두 펠린드롬하다, 따라서 $0\ \sim n-1$까지 $dp[i][i]$는 모두 `True`로 세팅한다.  
또한 길이가 2인 문자열은 <b>연속되고 서로 같은 숫자를 갖는다면</b> 펠린드롬하다.

길이가 3 이상일 때부터는 앞서 초기화한 값을 바탕으로 앞서 말한 펠린드롬 판단여부 공식을 사용하면 된다.

### 정답 코드
```python
from sys import stdin as input

n = int(input.readline())
arr = list(map(int,input.readline().split()))
m = int(input.readline())
q = []
# 0-based
for _ in range(m):
    s,e = map(int,input.readline().split())
    q.append((s-1,e-1))
# dp로 모든 인덱스에 대한 펠린드롬 여부
# dp[i][j] = i-j까지의 문자열이 펠린드롬인지 판단
dp = [[False] * n for _ in range(n)]
# 1자리,연속된 2자리 = 모두 펠린드롬
# 1자리
for i in range(n):
    dp[i][i] = True
# 연속된 2자리 -> 0,1 1,2 2,3
for i in range(n-1):
    if arr[i] == arr[i+1]:
        dp[i][i+1] = True
# 3자리부터 i = 0 ~ n-1까지 순회, j는 i+2부터 n-1까지
# i = 0, j = 2일 경우 dp[1][1] = True and arr[i] == arr[j]면 dp[i][j]도 True

for l in range(2,n):
    # 연속된 길이가 l+1인 것
    for i in range(n-l):
        if dp[i+1][i+l-1] == True and arr[i] == arr[i+l]: dp[i][i+l] = True

ans = []

for s,e in q:
    if dp[s][e] == True:
        ans.append(1)
    else: ans.append(0)

print('\n'.join(map(str,ans)))
```
