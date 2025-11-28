---
title: "백준 21921번 블로그 (python)"
date: "2025-11-28 02:39:45"
category: "코테"
description: "python으로 풀어보는 백준 21921"
---

## 코딩 테스트 풀이

!["문제사진"](/images/21921.png)
<a href="https://www.acmicpc.net/problem/21921" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 21921 문제 풀이에 대한 해설.

**X라는 고정된 길이에 대한 합**을 구하는 것이므로, 슬라이딩 윈도우가 적절한 선택이었다.\
물론 누적합으로도 풀 수 있겠지만 누적합을 써도 어차피 슬라이딩 윈도우는 필수적이고
누적합 없이 변수 하나로 푸는 게 합리적일 것이다.

### 정답 코드
```python
from sys import stdin as input

n,x = map(int,input.readline().split())

# x일 동안 가장 많이 들어온 방문자 수 출력.
# 최대 방문자 수가 0이 아닌 경우 해당 날짜가 몇 개인지 개수 출력
arr = list(map(int,input.readline().split()))

ans = 0
l = 0
s = 0
cnt = 1
for r in range(len(arr)):
    s += arr[r]
    if r-l+1 == x:
        if ans < s:
            ans = s
            cnt = 1
        elif ans == s:
            cnt += 1
        s -= arr[l]
        l += 1

if ans == 0:
    print("SAD")
    exit()
else:
    print(ans)
    print(cnt)
```

