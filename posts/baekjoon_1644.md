---
title: "백준 1644번 소수의 연속합 (python)"
date: "2026-01-02 13:59:07"
category: "코테"
description: "python으로 풀어보는 백준 1644"
---

## 코딩 테스트 풀이

!["문제사진"](/images/1644.png)
<a href="https://www.acmicpc.net/problem/1644" class="plink">
  문제링크
</a>

백준 1644번 문제 풀이에 대한 해설.

### 나의 접근
<b>소수</b>라는 키워드와 <b>연속된</b>이라는 키워드를 통해서 이 문제가 에라토스테네스의 체와 투 포인터를 사용하는 문제라는 걸 파악해야 한다.

코딩 테스트에서 소수가 들어가면 당연히 에라토스테네스의 체를 사용하는 건 맞는데, 연속된이라는 키워드를 통해서 <b>투 포인터</b>임을 알아채는 것이
너무 어려웠다.

처음에는 연속된 소수의 합이라는 소리에 <b>DP(냅색 같은)</b>를 생각했었으나, 마지막으로 사용된 소수가 무엇인지를 계속 생각해야 하는 구조라서
매우 복잡해지고 단순히 소수의 배열에서 투 포인터를 사용해 `sum(arr[l:r])`이 $n$을 만족하는지 판별하면 훨씬 간단하게 풀 수 있다.

### 정답 코드
```python
from sys import stdin as input

n = int(input.readline())
# n까지 소수를 담을 배열
arr = []

check = [True] * (n+1)
check[0],check[1] = False,False
# 에라토스테네스의 체
for i in range(2,int(n**0.5)+1):
    if check[i]:
        for j in range(i*i,n+1,i):
            check[j] = False

for num in range(1,n+1):
    if check[num]: arr.append(num)

# 투 포인터
l = 0
cur = 0
ans = 0
for r in range(len(arr)):
    cur += arr[r]
    while cur >= n:
        if cur == n: ans += 1
        cur -= arr[l]
        l += 1
print(ans)
```
