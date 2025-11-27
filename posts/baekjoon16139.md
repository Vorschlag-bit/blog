---
title: "백준 16139번 인간-컴퓨터 상호작용 (python)"
date: 2025-11-27 10:01:40
category: "코테"
description: "python으로 풀어보는 백준 16139"
---

## 코딩 테스트 풀이

!["문제사진"](/images/16139.png)
<a href="https://www.acmicpc.net/problem/16139" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 16139 문제 풀이에 대한 해설.

`q`가 최대 20만이고 `s`도 최대 20만이므로 완전탐색은 당연히 통과하질 않는다.\
처음에 생각한 건 `dict`을 사용해서 `key = 알파벳, value = [0] * (len(s)+1)`로 둔 후에
`enumerate`를 사용해 특정 알파벳이 등장한 인덱스 값을 +1 시킨 후 누적합을 시켜서
**r - (l-1)**로 개수를 세면 되겠다고 생각을 했었다.

주의할 점으로는 해당 문제는 **0-based**였기 때문에 1-based로 바꿔주고, **(r+1) - l** 개수를
세야한다는 점말고는 딱히 신경쓰지 않았었다.

### dict을 활용한 정답 코드(pypy만 통과)
```python
from sys import stdin as input

# 특정 문자열 s, 특정 알파벳 a와 문자열 구간[l,r]이 주어질 때
# S의 l~r 사이에 a가 몇 번 나타나는지 구하는 프로그램 작성

# 0-based, l,r 인덱스 포함
s = input.readline().strip()
q = int(input.readline())
cmd = []
for _ in range(q):
    a,l,r = input.readline().split()
    cmd.append((a,int(l),int(r)))

# q = 20만, 문자열 길이 = 20만
# a-z = key, [0] * len(s) = value
char = dict()
for i in range(26):
    c = ord('a') + i
    char[chr(c)] = [0] * (len(s) + 1)

# idx와 char를 통해, 해당 char아 char 등장 배열의 idx에 등장했음을 + 1
for i,c in enumerate(s):
    arr = char[c]
    arr[i+1] += 1

# 모든 알파벳 배열의 누적합
for i in range(26):
    num = ord('a') + i
    c = chr(num)
    arr = char[c]
    for j in range(len(s)):
        arr[j+1] += arr[j]
    
# cmd 배열을 순회하면서 계산
for a,l,r in cmd:
    arr = char[a]
    print(arr[r+1] - arr[l])
```

하지만 이 방식으로는 python으로 통과하지 못 해서 뭐가 문젤까 싶어서 몇 가지 수정을 거쳤다.\
먼저 `print`로 20만 번의 출력을 수행하는 게 문제일까 싶어서 배열에 담아서 `'\n'.join()`을 사용해서
하나의 문자열로 출력하는 방식을 적용했었다.

하지만 이래도 python으로는 통과하질 못 했고, 입출력의 문제가 아닌 거 같아서 다른 사람들의 방식을 찾아봤었다.\
그러다가 **리스트 슬라이딩[:]**을 적용한 풀이법을 발견했다.

### 리스트 슬라이딩을 적용한 정답 코드(python 통과)
```python
from sys import stdin as input

# 특정 문자열 s, 특정 알파벳 a와 문자열 구간[l,r]이 주어질 때
# S의 l~r 사이에 a가 몇 번 나타나는지 구하는 프로그램 작성

# 0-based, l,r 인덱스 포함
s = input.readline().strip()
n = len(s)
q = int(input.readline())
cmd = []

for _ in range(q):
    a,l,r = input.readline().split()
    cmd.append((a,int(l),int(r)))

# q = 20만, 문자열 길이 = 20만
# a-z
char = [[0] * 26]

# idx와 char를 통해, 해당 char아 char 등장 배열의 idx에 등장했음을 + 1
for i,c in enumerate(s):
    idx = ord(c) - 97
    cur = char[-1][:]
    cur[idx] += 1
    char.append(cur)
    
# cmd 배열을 순회하면서 계산
result = []
for a,l,r in cmd:
    idx = ord(a) - 97
    result.append(str(char[r+1][idx] - char[l][idx]))

print('\n'.join(result))
```
이 코드의 핵심은 내가 기존의 **26 x N**(알파벳 하나를 정해서 전체 시간(N)을 훑기)의 시간복잡도로 계산했다면\
이 방식은 **N * 26**의 시간복잡도를 리스트 슬라이싱을 적용해 for문의 오버헤드를 최소화한 것이다.\
파이썬의 for문은 인터프리터 오버헤드가 커서, C++ 등 컴파일 언어에 비해서 느린 편이다.\
이 코드에선 슬라이싱`[:]`을 적용해서 리스트를 통째로 복사해 내부적으로 C언어 수준의 메모리 복사를 수행하도록 했다.

다만 이렇게 수정하면서 기존의 행열이 [알파벳][문자인덱스]였던 게 [문자인덱스][알파벳]으로 바뀌었으므로 이 점만
나중에 정답을 계산할 때 신경쓰면 된다. 아래의 표로 좀 더 직관적인 이해가 되도록 정리했다.

#### "abc" 문자열 예시
| 인덱스 | 시점 | a (0) | b (1) | ... | 비고 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `counts[0]` | 시작 전 | 0 | 0 | ... | `[0]*26` |
| `counts[1]` | "a" | **1** | 0 | ... | `counts[0][:]` 복사 후 `a+=1` |
| `counts[2]` | "ab" | 1 | **1** | ... | `counts[1][:]` 복사 후 `b+=1` |
| `counts[3]` | "aba" | **2** | 1 | ... | `counts[2][:]` 복사 후 `a+=1` |

### 후기
코테(특히 백준..)에서 입력은 당연히 `sys.stdin.readline`을 통해서 매번 받는 습관이 되어있지만
출력에선 20만 같이 큰 숫자는 배열에 담아서 출력하는 습관을 가져야겠다.

그리고 python의 `for`문은 수십만건의 연산을 수행할 때는 생각보다 많이 느리다는 걸 알 수 있었다.\
내장 함수 기능(map, 슬라이싱 등)을 최대한 활용해서 **C 레벨 속도**를 빌려오는 게 생각보다 중요하다는 것도 배웠다.
솔직히 코딩 테스트의 본질인 **로직**(시간복잡도)뿐만 아니라 언어적 특성까지 생각해야 하는 문제라 상당히 짜증났지만
생각보다 이런 언어적 특성이 중요하다는 걸 알 수 있었던 문제였다.