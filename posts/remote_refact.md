---
title: "PostRemoteController UI 리팩토링을 해보자"
date: "2026-01-02 15:47:06"
category: "개발"
description: "인기글 UI 이후 겹치는 리모컨 UI를 수정해보기"
---

## 서론: 아 '불편'하다..
긴 말이 필요없다. 당장 사진만 봐도 글 상세조회 시, 인기글을 볼 수 없어서 UX에 매우 치명적이다.

<figure>
    <img src="/images/cur_r.png" alt="목차(겸 리모컨)UI와 인기글 UI가 서로 겹치는 모습">
    <figcaption>불-편하다.</figcaption>
</figure>

물론 리모컨 UI의 위치를 바꿀 생각도 없기에 '닫힘' 버튼 하나를 추가해서 인기글도 누를 수 있게끔
수정하면 될 일이다. 

이렇게 생각하니 리팩토링보단 기능 추가에 가까운 거 같기도 하다;

