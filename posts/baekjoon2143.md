---
title: "baekjoon2143"
date: "2025-11-25 03:09:52"
category: "코테"
description: "python으로 풀어보는 백준 2143번"
---

## 코딩 테스트 풀이
!["문제_사진"](/images/2143.png)
<a href="https://www.acmicpc.net/problem/2143" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 2143번 문제 풀이에 대한 해설.

이번 문제는 당장 이전에 풀어봤던
<a href="https://vorschlag-blog.vercel.app/posts/baekjoon10986" style="color: #2f9e44; text-decoration: none;">
  나머지 합
</a>
이 생각이 나서 수학적으로 좀 생각을 해보려고 노력했다.

먼저 A(혹은 B)의 부분 누적합의 총 경우의 수가 얼마가 될지 생각을 해보면(최대 1000이므로 1000기준)\
1000은 1부터 1000까지 총 1000개의 부분 합이 존재하고, 999는 999개이므로\

$$ 1000 + 999 + ... + 1 = (1000 * 999) % 2 $$

대략 50만 개의 경우의 수가 존재한다.

따라서 이 두 누적합의 모든 조합을 생각하면 50만 * 50만이므로 완전탐색은 절대로 불가능하다.\
이 문제를 식으로 나타내면 간단하게 아래와 같다.

$$ Asum + Bsum = t $$

여기서 Asum이나 Bsum을 오른쪽으로 이동시키면

$$ Bsum = t - Asum $$

즉, **Bsum의 배열에서 t - Asum을 만족하는 수의 개수를 세는** 문제라는 걸 파악할 수 있다!

여기까지 생각을 하고나면 문제를 풀 수 있는 방식은 크게 2가지가 존재한다.

먼저 **딕셔너리**를 활용해서 **key=A(B)의 누적합 배열의 누적합, value=그 누적합의 개수**로 빠르게 연산하는 방법과 **이진탐색**을 활용해 A(B) 배열을 정렬하고 B(A)sum 배열에서 순회하면서 t - B(A)sum를 만족하는 값의 첫 등장과 마지막 등장 인덱스를 계산해서 총 개수를 세는 방법이다.

말로 설명하니 복잡하고 현학적이므로 코드로 봐보자.

### 정답 코드 1(dict)
```python
from sys import stdin as input

t = int(input.readline())

n = int(input.readline())
A = list(map(int,input.readline().split()))

m = int(input.readline())
B = list(map(int,input.readline().split()))

# A의 부 배열의 합 + B의 부 배열의 합 = t가 되는 모든 부 배열의 쌍 개수
ans = 0
# A,B의 부 배열의 모든 경우의 수는 1000 * 999 // 2 => 대략 50만
# A + B = t -> A = t - B or B = t - A를 만족하는 특정값이 존재하는지 판단하는 문제
bSum = []

# k = A 부 배열의 합, v = 그 합의 개수
Ad = dict()

for i in range(n):
    s = 0
    for j in range(i,n):
        s += A[j]
        Ad[s] = Ad.get(s,0) + 1


for i in range(m):
    s = 0
    for j in range(i,m):
        s += B[j]
        bSum.append(s)

# bSum을 순회하면서 B - t가 Ad에 몇 개 있는지 카운트
for num in bSum:
    tx = t - num
    ans += Ad.get(tx,0)

print(ans)
```
뒤에 나올 이진탐색은 n*logn인 반면 이 코드는 n번으로 탐색이 끝나 더 빠르다.

### 정답 코드 2(이진탐색)
```python
from sys import stdin as input
from bisect import bisect_left,bisect_right

t = int(input.readline())

n = int(input.readline())
A = list(map(int,input.readline().split()))

m = int(input.readline())
B = list(map(int,input.readline().split()))

ans = 0
bSum = []
aSum = []

for i in range(n):
    s = 0
    for j in range(i,n):
        s += A[j]
        aSum.append(s)

for i in range(m):
    s = 0
    for j in range(i,m):
        s += B[j]
        bSum.append(s)

aSum.sort()

# bSum을 순회하면서 B - t가 Ad에 몇 개 있는지 카운트
for num in bSum:
    tx = t - num
    l = bisect_left(aSum,tx)
    r = bisect_right(aSum,tx)
    ans += (r - l)

print(ans)
```
python의 경우 라이브러리로 `bisect_left`와 `bisect_right`를 모두 지원하기 때문에 구현의 부담감이 적어서 푸는 속도는 1번과 2번 둘 다 큰 차이는 없겠지만 시간 복잡도를 따졌을 때 1번이 훨씬 좋기 때문에 되도록 1번을 지향하자!

### 결과
!["2143결과"](/images/2143result.png)

시간 복잡도가 낮은 쪽이 dict을 활용한 풀이이다. 확실히 훨씬 더 빠른 걸 볼 수 있었다.

이번 문제도 정말 훌륭한 문제였다고 생각한다.\
문제를 수식화하고 그걸 변형에서 **반으로 쪼개서** 따로 구한 뒤 맞추는 전략을 배울 수 있었던 문제였다!