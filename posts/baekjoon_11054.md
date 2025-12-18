---
title: "백준 11054번 가장 긴 바이토닉 부분 수열 (python)"
date: "2025-12-18 15:25:13"
category: "코테"
description: "python으로 풀어보는 백준 11054"
---

## 코딩 테스트 풀이

!["문제사진"](/images/11054.png)
<a href="https://www.acmicpc.net/problem/11054" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 11054번 문제 풀이에 대한 해설.

### 나의 접근
처음에는 <b>부분 수열</b>이라는 키워드에 꽂혀서 <b>투 포인터</b> 알고리즘으로 풀어야 한다고 생각했었다.  
하지만 투 포인터는 주로 <b>연속된 부분 수열(Subarray)</b>을 구할 때 사용하는 알고리즘이다. 이 문제,
바이토닉 부분 수열은 숫자를 <b>중간 중간 건너뛰어도 되는 부분 수열(Subsequence)</b>이다.

이렇게 건너뛰는 게 허용되는 문제에서 투 포인터를 사용할 경우, 어떤 숫자를 취하고 버릴지 결정하는 경우의 수가 너무 복잡하고 어려워진다.  
이런 문제는 <b>LIS(Longest Increase Subsequence)</b>로 접근을 해야 한다.

바이토닉 부분 수열의 특징은 <b>산 모양</b>이라는 점이다. 올라갔다가(↗) 내려간다(↘).  
즉, 수열 내의 특정 수 $$k$$를 기준으로 증가하는 부분 수열과 감소하는 부분 수열이라는 소리다.  
감소하는 부분 수열이라는 의미는 역인덱스로 순회할 경우 증가하는 부분 수열이라는 의미이므로 lis 2번을 사용해서 $$arr[i]$$에 대한
2개의 부분 수열 길이의 합이 최대가 되는 게 정답이다.

물론 $$i$$에 대해서 2번의 중복된 계산을 한 셈이므로 -1만 해주면 된다.

### 정답 코드
```python
from sys import stdin as input

n = int(input.readline())

arr = list(map(int,input.readline().split()))

# lis 2개 섞어쓰기
# dp[i]가 곧 최정상의 k(k 미만은 전부 값이 작은 거)
# 정방향
dp1 = [1] * n
# 역방향
dp2 = [1] * n

for i in range(n):
    for j in range(i):
        if arr[i] > arr[j]:
            dp1[i] = max(dp1[i], dp1[j] + 1)

for i in range(n-1,-1,-1):
    for j in range(n-1,i,-1):
        if arr[i] > arr[j]:
            dp2[i] = max(dp2[i], dp2[j] + 1)
ans = 0
for i in range(n):
    ans = max(ans, dp1[i] + dp2[i])
# 중복된 k 하나 빼기
print(ans-1)
```