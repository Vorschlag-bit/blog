---
title: "백준 7453번 합이 0인 네 정수 (python)"
date: "2026-01-12 15:18:01"
category: "코테"
description: "python으로 풀어보는 백준 7453"
---

## 코딩 테스트 풀이

!["문제사진"](/images/7453.png)
<a href="https://www.acmicpc.net/problem/7453" class="plink">
  문제링크
</a>

### 나의 접근
이 문제는 배열이 4개($A, B, C, D$)이고, 배열의 크기($N$)가 최대 4,000이다. 만약 단순하게 4중 반복문(Brute Force)을 사용해 모든 경우의 수를 확인한다면 시간 복잡도는 $O(N^4)$가 되어, $4000^4$라는 천문학적인 연산 횟수로 인해 절대 통과할 수 없다.

따라서 4개의 배열을 <b>2개씩 묶어서 처리</b>하는 <b>Meet-in-the-middle(중간에서 만나기)</b> 전략을 사용해야 한다.

#### 1. 배열 합치기 (4개 $\rightarrow$ 2개)
$A, B, C, D$에서 각각 하나씩 뽑아 더한 값이 0이 되어야 한다는 식은 다음과 같다.
$$A + B + C + D = 0$$

이 식을 두 부분으로 이항하여 생각하면 다음과 같이 바꿀 수 있다.
$$(A + B) = -(C + D)$$

즉, 전체 문제를 다음과 같은 단계로 줄일 수 있다.
1.  $A$와 $B$ 배열의 모든 원소를 더해 만들 수 있는 합의 리스트 `AB`를 만든다. (크기 $N^2$)
2.  $C$와 $D$ 배열의 모든 원소를 더해 만들 수 있는 합의 리스트 `CD`를 만든다. (크기 $N^2$)
3.  이제 문제는 <b>"리스트 `AB`와 `CD`에서 하나씩 골라 더했을 때 0이 되는 경우의 수"</b>를 찾는 문제로 바뀐다.

#### 2. 탐색 알고리즘 선택 (Two Pointers vs Hash Map)
두 리스트 `AB`와 `CD`의 크기는 각각 $N^2$이므로 최대 $16,000,000$이다. 여기서 짝을 찾는 방법은 크게 두 가지가 있다.

*   **이분 탐색 / 투 포인터:** 두 배열을 정렬한 뒤 탐색한다. 하지만 정렬하는 데 $O(N^2 \log(N^2))$의 시간이 소요되며, 중복된 값 처리가 까다로울 수 있다.
*   **해시 맵 (Dictionary / Counter):** `AB` 배열의 합들을 미리 카운팅 해두고, `CD` 배열을 순회하며 매칭되는 값(`-val`)이 있는지 $O(1)$로 조회한다.

Python의 경우 `Dictionary`나 `collections.Counter`를 사용하는 것이 구현이 훨씬 직관적이고 빠르다.

#### 3. 최종 로직
1.  이중 반복문을 통해 $A[i] + B[j]$의 모든 합을 구해 리스트 `AB`에 넣는다.
2.  마찬가지로 $C[i] + D[j]$의 모든 합을 구해 리스트 `CD`에 넣는다.
3.  `collections.Counter`를 이용해 `AB` 리스트에 등장하는 **합의 빈도수**를 미리 계산해 둔다.
4.  `CD` 리스트를 순회하면서, 현재 값 `ele`와 더해서 0이 되는 값, 즉 `-ele`가 `AB` 리스트(Counter)에 몇 개 있는지 확인하여 정답에 더한다.

이 방식을 사용하면 전체 시간 복잡도를 $O(N^2)$ 수준으로 줄일 수 있어 시간 제한 내에 통과가 가능하다. (Python의 경우 연산량이 많으므로 `PyPy3`로 제출하는 것이 좋다.)

---

### 정답 코드
```python
from sys import stdin as input
from collections import Counter

n = int(input.readline())
a = []
b = []
c = []
d = []

for _ in range(n):
    a1,b1,c1,d1 = map(int,input.readline().split())
    a.append(a1)
    b.append(b1)
    c.append(c1)
    d.append(d1)

# ab와 cd로 만들어 질 수 있는 모든 경우의 수
ab = []
cd = []
for i in range(n):
    a1 = a[i]
    c1 = c[i]
    for j in range(n):
        b1 = b[j]
        d1 = d[j]
        ab.append(a1+b1)
        cd.append(c1+d1)

# AB 배열의 합의 빈도수를 미리 계산 (Hash Map 활용)
cnt = Counter(ab)
ans = 0

# CD 배열을 순회하며 (-값)이 AB에 존재하는지 확인
for ele in cd:
    ans += cnt.get(-ele, 0)
print(ans)
```