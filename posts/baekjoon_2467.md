---
title: "백준 2467번 용액 (python)"
date: "2025-12-23 13:59:17"
category: "코테"
description: "python으로 풀어보는 백준 2467"
---

## 코딩 테스트 풀이

!["문제사진"](/images/2467.png)
<a href="https://www.acmicpc.net/problem/2467" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 2467번 문제 풀이에 대한 해설.

### 나의 접근
<b>정렬된</b> 리스트와 유달리 큰 리스트 속 숫자들을 통해서 <b>이진 탐색</b>으로 풀이가 가능한 문제라고 생각을 했다.  
또한 양 끝에서부터 출발하는 <b>투 포인터</b>로도 풀이할 수 있을 것이다.

먼저 투 포인터로 푸는 법은 $$l,r$$을 각각 $$0$$과 $$n-1$$로 둔 후에 $$arr[l] + arr[r]$$의 합이
0 이상이면 알칼리를 줄이고($r - 1$), 음수일 경우 산성을 줄이는($l + 1$) while 문으로 풀이하면 된다.
이전의 합과 현재 합을 계속 비교해가면서 절댓값으로 줄어든 경우에만 정답으로 사용할 $l$,$r$만 새로 부여해주면 된다.

while문의 종료 조건은 모든 걸 탐색하는 `r > l`로 설정했다.

### 정답 코드 (투 포인터)
```python
from sys import stdin as input

n = int(input.readline())

# 산성 = 1부터 1-10억, 알칼리성 = -1부터 -10억
# 정렬된 순서로 산성,알칼리성 용액이 주어질 때 이 중 서로 다른 2개의 용액을 혼합했을 때 0에 가장 가까운
# 만들 수 있는 두 용액 return

arr = list(map(int,input.readline().split()))

# 1. 투 포인터로 풀어보자!
l = 0
r = n-1
ans = float('inf')
al = -1
ar = -1
while r > l:
    cur = arr[r] + arr[l]
    if abs(cur) > ans: pass
    else:
        ans = abs(cur)
        al = l
        ar = r
    # 현재 합이 0 이상이면 알칼리 줄이기
    if cur > 0:
        r -= 1
    # 음수면 산성줄이기
    else:
        l += 1
print(f'{arr[al]} {arr[ar]}')
```

이진 탐색으로 풀이할 경우에는 인덱스를 순회하면서 $-arr[i]$에 가장 가까운 값을 이진탐색으로 찾으면 된다.
다만 한 가지 주의해야 할 사항이 있는데, 보통 이진탐색은 `bisect_left`를 구현한다.  

즉, <b>배열에서 내가 찾고자 하는 값보다 크거나 같은 첫 번째 위치</b>를 반환한다.

예를 들어서 내가 찾고 싶은 이상적인 짝(`-arr[i]`)이 $50$이라고 가정해보자.  
하지만 배열에는 $[...48,55,...]$만 있을 경우, `bisect_left`의 결과로 나오는 인덱스는 $55$를 가리킨다.
하지만 실제적인 값에선 $48$과 가장 합리적이다. 따라서 `bisect_left`로 나오는 <b>인덱스-1</b>까지 함께 탐색을 해야 한다.

주의할 점은 `bisect_left`는 해당값이 배열에 없을 경우에는 배열의 길이를 return하므로 인덱스가 유효한지 신경을 써야 하며,
`idx-1`을 비교할 때도 $i$와 같을 수 있으니 인덱스에 신경을 많이 써야 한다.

참고로 `bisect_left`에 `lo` arg에 $i+1$을 넣으면 자기 자신 이후의 값부터 이진탐색을 수행하기 때문에 안정적인 인덱스 비교가
가능해진다.

그 외에 최솟값 갱신 로직은 투 포인터와 일치한다.
### 정답 코드 (이진 탐색)
```python
from sys import stdin as input
from bisect import bisect_left

n = int(input.readline())

# 산성 = 1부터 1-10억, 알칼리성 = -1부터 -10억
# 정렬된 순서로 산성,알칼리성 용액이 주어질 때 이 중 서로 다른 2개의 용액을 혼합했을 때 0에 가장 가까운
# 만들 수 있는 두 용액 return

arr = list(map(int,input.readline().split()))
l = 0
r = 0
ans = float('inf')
# 이진탐색
for i in range(n-1):
    idx = bisect_left(arr,-arr[i],i+1)
    if idx < n:
        cur = abs(arr[i] + arr[idx])
        if cur < ans:
            ans = cur
            l = i
            r = idx
    if idx - 1 > i:
        cur = abs(arr[i] + arr[idx-1])
        if cur < ans:
            ans = cur
            l = i
            r = idx-1
print(f'{arr[l]} {arr[r]}')
```