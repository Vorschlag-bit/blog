---
title: "백준 12015번 가장 긴 증가하는 부분 수열 2 (python)"
date: "2026-01-21 14:07:08"
category: "코테"
description: "python으로 풀어보는 백준 12015"
---

## 코딩 테스트 풀이

!["문제사진"](/images/12015.png)
<a href="https://www.acmicpc.net/problem/12015" class="plink">
  문제링크
</a>

백준 12015번 문제 풀이에 대한 해설.

### 나의 접근
가장 긴 부분 수열을 푸는 방법의 정석적인 방식은 <b>이분탐색</b>을 사용하는 것이다.  

가장 먼저 정답 수열을 저장할 배열에 `arr[0]` 값을 넣어둔다.

그 후에는 인덱스 1부터(0부터 해도 상관없음) 끝까지 순회하면서 `arr[i]`에 대해서 다음의 로직으로 증가하는 배열을 판단하면 된다.

1. `arr[i]`가 `ans[-1]`보다 큰 경우: 배열이 증가하므로 `ans.append()`를 하면 된다.
2. `arr[i]`가 `ans[-1]` 이하인 경우: 지금까지 만든 `ans` 배열에서 `arr[i]`가 들어갈 위치를 <b>이분탐색</b>을 통해 찾은 후 대체한다.

이게 가능한 이유는 이분탐색(특히 `bisect_left`)의 특성 때문이다.  
이분탐색은 찾고자하는 값 미만의 수 중에서 가장 큰 수의 위치를 `return`한다.

따라서 기존 `ans` 배열에서 `arr[i]`가 오름차순을 깨트리지 않으면서 더 상위호환으로 정확하게 대체될 수 있도록 만들어준다.

### 정답 코드
```python
from sys import stdin as input
from bisect import bisect_left

n = int(input.readline())
arr = list(map(int,input.readline().split()))

ans = [arr[0]]

for i in range(n):
    num = arr[i]
    if num > ans[-1]:
        ans.append(num)
    else:
        idx = bisect_left(ans,num)
        ans[idx] = num

print(len(ans))
```
