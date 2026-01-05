---
title: "백준 2623번 음악프로그램 (python)"
date: "2026-01-05 14:49:41"
category: "코테"
description: "python으로 풀어보는 백준 2623"
---

## 코딩 테스트 풀이

!["문제사진"](/images/2623.png)
<a href="https://www.acmicpc.net/problem/2623" class="plink">
  문제링크
</a>

백준 2623번 문제 풀이에 대한 해설.

### 나의 접근
<b>"순서 정하기"</b>라는 키워드를 통해서 <b>위상 정렬</b>임을 눈치채면 쉽게 풀 수 있는 문제였다.

다만 일반적인 위상 정렬의 준비과정과는 좀 다르게 살짝 복잡한 게 어려웠다.
보통 위상 정렬은 깔끔한 그래프(특정 수 $n$ 앞에 몇 개의 수가 있는지 리스트로 제공)를 통해서

`defaultdict(list)`와 특정 노드의 위상 수를 알 수 있는 숫자 배열인 `tp[i]`를 통해서 풀어나갈 수 있는데,
이 문제의 경우는 수가 중복되어 위상의 앞 뒤에 존재할 수 있기 때문에 중복을 없애는 `set`을 통해 그래프에 대한
정보를 깔끔하게 얻어내는 게 중요했다.

먼저 `graph`라는 `dict`에는 특정 노드 $n$의 바로 다음에 오는 수(`nxt`)를 넣었다.
이를 통해 위상 정렬의 반복문에서 `nxt`에 대한 위상을 제거할 수 있기 떄문이다.

또한 위상에 대한 관리를 하는 `tp`라는 `dict`에는 반대로 `nxt`의 압장에서 자기 바로 앞에 오는 노드의 수를
세야 하기 때문에(위상 정렬의 특징) `tp[nxt]`에 $n$을 중복을 배제하는 집합의 형태로 넣었다.

예외로 노드가 1개만 주어지는 경우엔 마지막 노드에 대한 판단을 없애기 위해서 `continue`를 통해 넘어갔다.

마지막으로 순서를 정하는 것이 불가능하다는 것은 위상을 따라가다가 중간에 논리적으로 막혀서
모든 노드를 결국 순회하지 못 하고 순회가 멈추게 된다.

이때 정답 배열에 모든 노드를 순회하지 못 했다면 $0$을 출력하고 아닐 경우엔 순서대로 `'\n'`을 붙여서 출력하면 된다.

### 정답 코드
```python
from sys import stdin as input
from collections import defaultdict,deque
n,m = map(int,input.readline().split())
graph = defaultdict(set)
tp = defaultdict(set)

for _ in range(m):
    arr = list(map(int,input.readline().split()))
    # 마지막 노드 판정 무시하기 위한 continue
    if len(arr) == 2: continue
    for i in range(1,len(arr)-1):
        num = arr[i]
        nxt = arr[i+1]
        graph[num].add(nxt)
        # num의 set에 지금까지 쌓은 걸 union
        tp[nxt].add(num)
    # 마지막 원소
    last = arr[-1]
    last_ex = arr[-2]
    tp[last].add(last_ex)

q = deque()
ans = []
for num in range(1,n+1):
    if len(tp[num]) == 0:
        q.append(num)

while q:
    num = q.popleft()
    ans.append(num)
    for nxt in graph[num]:
        tp[nxt].discard(num)
        if len(tp[nxt]) == 0:
            q.append(nxt)

if len(ans) != n: print(0)
else:
    print('\n'.join(map(str,ans)))
```
