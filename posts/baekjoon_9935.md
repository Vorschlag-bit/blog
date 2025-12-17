---
title: "백준 9935번 문자열 폭발 (python)"
date: "2025-12-17 15:30:42"
category: "코테"
description: "python으로 풀어보는 백준 9935"
---

## 코딩 테스트 풀이

!["문제사진"](/images/9935.png)
<a href="https://www.acmicpc.net/problem/9935" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 9935번 문제 풀이에 대한 해설.

### 나의 접근
최대 $$N$$이 100만인데, 특정 문자열이 포함되는지 매 순간 순간 체크한다면 2초라는 시간 제한 내에 절대 통과하지 못 할 것이다.  
이럴 땐 보통 <b>stack</b>을 활용해서 $$O(N)$$이라는 시간복잡도 내에 통과해야 한다.  

또한 stack의 뒷부분(-1 인덱스)부터 `len(t)`만큼의 문자열을 비교할 때, 일일히 비교하는 것 역시 시간복잡도를 늘릴 수 있으므로 
<b>리스트 비교(슬라이싱 비교)</b>를 통해서 python 내부의 최적화된 비교를 하면 훨씬 빠르게 비교가 가능해진다!

마지막으로 문자열을 폭발시킬 때도, `pop()`을 통해서 방출하는 것보다 `del`을 사용해서 `len(t)`만큼 메모리에서 삭제시키는 것이 
시간복잡도를 훨씬 줄일 수 있다.  
이때는 슬라이싱을 통해 배열 재할당을 한다면 그건 깊은 복사를 흉내낸 것이기에 배열의 길이만큼의
시간복잡도가 존재한다.

### 정답 코드
```python
from sys import stdin as input

s = input.readline().rstrip()

t = list(input.readline().rstrip())

# 문자열이 폭자열을 포함하면 문자열 내 모든 폭자열은 사라지고 남은 거 이어붙이기.
# 폭자열이 사라질 때까지 반복

# 매번 100만을 체크할 순 없음
# stack
# stack의 길이가 len(t) 이상이고, stack[-1] == t[-1]일 때
# -1부터 -1 + len(t)만큼 체크 후, 존재하면 pop() 아니면 다음 문자열로 이동
# 시간 복잡도는? n

stack = []
for char in s:
    stack.append(char)
    if len(stack) >= len(t) and stack[-1] == t[-1]:
        if stack[-len(t):] == t:
            del stack[-len(t):]

if stack: print(''.join(stack))
else: print('FRULA')
```

