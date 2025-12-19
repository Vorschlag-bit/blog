---
title: "백준 30805번 사전 순 최대 공통 부분 수열 (python)"
date: "2025-12-19 16:10:09"
category: "코테"
description: "python으로 풀어보는 백준 30805"
---

## 코딩 테스트 풀이

!["문제사진"](/images/30805.png)
<a href="https://www.acmicpc.net/problem/30805" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 30805번 문제 풀이에 대한 해설.

### 나의 접근
문제에 제시된 <b>'사전 순'</b>이라는 의미를 보면 결국 두 배열의 공통으로 들어가는 수들 중 <b>최댓값</b>을 넣고, 
해당 최댓값 인덱스 이후에 또 공통 최댓값을 넣으면 된다.  

문제 속 $$N$$과 $$M$$이 둘 다 최대 100밖에 안 되므로, <code>while</code>을 통해서 구간을 점프해나가면서 줄어든 구간의 배열 속
최댓값을 게속 찾아나기기만 하면 된다.

### 정답 코드
```python
from sys import stdin as input

n = int(input.readline())
arr1 = list(map(int,input.readline().split()))
m = int(input.readline())
arr2 = list(map(int,input.readline().split()))

# a,b 공통 부분 수열 중 사전 순으로 가장 나중인 수열의 크기
ans = []
a1 = 0
a2 = 0
while True:
    MAX = 0
    li = 0
    lj = 0
    for i in range(a1,n):
        for j in range(a2,m):
            if arr1[i] == arr2[j]:
                if MAX < arr1[i]:
                    MAX = arr1[i]
                    li = i
                    lj = j
    if MAX == 0: break
    ans.append(MAX)
    a1 = li + 1
    a2 = lj + 1

if not ans:
    print(0)
    exit()
print(len(ans))
print(' '.join(map(str,ans)))
```

