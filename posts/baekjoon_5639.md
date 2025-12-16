---
title: "백준 5639번 이진 탐색 트리 (python)"
date: "2025-12-16 20:22:13"
category: "코테"
description: "python으로 풀어보는 백준 5639"
---

## 코딩 테스트 풀이

!["문제사진"](/images/5639.png)
<a href="https://www.acmicpc.net/problem/5639" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 5639번 문제 풀이에 대한 해설.

### 나의 접근
이진 탐색 트리(Binary Search Tree, BST)의 특성을 알고 있어야 하는 문제.  
이진 탐색 트리는 <b>Root 노드를 기준으로 Root보다 작은 노드는 전부 왼쪽 서브 트리에 위치하고 큰 노드는 오른쪽 서브 트리에 위치한다.</b>  

문제의 요구사항인 <b>후위 순회</b>는 루트,왼쪽서브,오른쪽서브 트리 구성으로 이뤄진 트리를  
왼쪽 서브, 오른쪽 서브, 루트 순으로 탐색하는 것이기 때문에  
이렇게 나눠진 서브 트리를 해당 순서에 맞게 재귀적으로 탐색하기만 하면 끝!

물론 문제의 예시처럼 완전 이진 탐색 트리는 아니기 때문에 Nil 노드로 값이 없는 게 채워진 상태는 아니라서 재귀적으로 탐색 전에 배열의 길이만 체크
하면 된다.

### 정답 코드
```python
from sys import stdin as input
import sys
sys.setrecursionlimit(10**6)
# 이진 트리를 전위 순회한 걸 바탕으로 후회 순회한 걸로 return
# bst의 특징 = root보다 작은 값은 전부 왼쪽 서브 트리, 큰 건 오른쪽 서브 트리
arr = list(map(int,input.readlines()))

# 후위 순회 재귀 함수(왼,오른,루트)
# 재귀의 흐름 -> 1. 0번 인덱스는 루트이다. 루트를 기준으로 왼/오른 서브 트리를 나눈다.
# 2. 트리의 노드가 1개면 출력하고 return
def rec(arr):
    if len(arr) == 1:
        print(arr[0])
        return

    root = arr[0]
    left = []
    right = []
    for e in arr[1:]:
        if e < root : left.append(e)
        else: right.append(e)

    # left,right,root 순
    if left: rec(left)
    if right: rec(right)
    print(root)

rec(arr)
```