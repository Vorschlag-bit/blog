---
title: "백준 27172번 수 나누기 게임 (python)"
date: "2025-12-31 12:49:42"
category: "코테"
description: "python으로 풀어보는 백준 27172"
---

## 코딩 테스트 풀이

!["문제사진"](/images/27172.png)
<a href="https://www.acmicpc.net/problem/27172" class="plink">
  문제링크
</a>

백준 27172번 문제 풀이에 대한 해설.

### 나의 접근
결국 특정 수의 $n$배수가 배열에 포함되어 있는지 아닌지를 확인하는 문제이므로, 에라토스테네스의 체를 활용하면
쉽게 풀 수 있는 문제였다.

배열 속 원소 $a$에 대해서 $a$의 $n$배수를 최댓값까지 돌리면서 해당 $n$배수가 배열에 포함되어 있는지는 `set`을 사용해
빠르게 찾으면 된다.

시간복잡도는 배열 속 최댓값인 $m$을 기준으로 $NlogM$을 만족하므로, 매우 널널하다.

### 정답 코드
```python
from sys import stdin as input
from collections import defaultdict

n = int(input.readline())
arr = list(map(int,input.readline().split()))
s = set(arr)
ans = defaultdict(int)
# 최댓값 100만
m = max(arr)

for ele in arr:
    # ele의 배수
    for num in range(ele * 2,m+1,ele):
        # ele의 배수가 집합에 있다면, ele += 1, num -= 1
        if num in s:
            ans[ele] += 1
            ans[num] -= 1

a = []
for ele in arr:
    a.append(ans[ele])
print(' '.join(map(str,a)))
```
