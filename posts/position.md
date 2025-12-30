---
title: "웹 요소의 위치 지정 속성 알아보기"
date: "2025-12-30 21:27:13"
category: "CSS"
description: "웹 문서에서 요소의 위치를 지정하는 position 관련 속성들에 대해 알아보자."
---

## 웹 요소 위치 지정 속성 (position)
웹 문서에서 이미지나 글씨를 원하는 위치에 넣는 건 생각보다 쉽지 않다. 이럴 때 `position` 속성을 사용하면
웹 문서에서 요소의 위치를 자유롭게 지정이 가능해진다.

### left,right,top,bottom
`position` 속성에 대해 알기 위해선 웹 문서에서 요소를 원하는 곳에 갖다 놓기 위해 위치를 지정할 줄 알아야 한다.
이때 사용하는 속성들이 `left`, `right`, `top`, `bottom`이다. 즉, `position`으로 기준 위치를 정한 뒤
요소의 위치를 left, right, top, bottom 속성에서 선택해 지정하면 된다.

<table>
    <caption>left,right,top,bottom 속성</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>left</b></td>
            <td>기준 위치와 요소 사이에 왼쪽으로 떨어져 있는 정도를 숫자로 지정</td>
        </tr>
        <tr>
            <td><b>right</b></td>
            <td>기준 위치와 요소 사이에 오른쪽으로 떨어져 있는 정도를 숫자로 지정</td>
        </tr>
        <tr>
            <td><b>top</b></td>
            <td>기준 위치와 요소 사이에 위쪽으로 떨어져 있는 정도를 숫자로 지정</td>
        </tr>
        <tr>
            <td><b>top</b></td>
            <td>기준 위치와 요소 사이에 아래쪽으로 떨어져 있는 정도를 숫자로 지정</td>
        </tr>
    </tbody>
</table>

```CSS
.post1 {
    position: absolute;
    left: 50px;
    top: 50px;
}
```

---

### position
`position` 속성은 요소를 자유롭게 배치해 주므로 HTML과 CSS를 통해 웹 문서를 만들 때 매우 중요한 속성 중 하나이다.  
`position` 속성을 이용하면 텍스트나 이미지 요소를 나란히 배치할 수도 있고 원하는 위치를 선택할 수도 있다.  
이렇게 요소를 다양하게 배치하려면 `position` 속성에서 사용하는 속성값을 잘 알고 있어야 할 것이다. 아래의 표는
`position` 속성에서 사용할 수 있는 값을 정리한 것이다. `position:static`을 제외하면 `left`, `right`, `top`, `bottom`
속성을 사용해서 위치를 지정할 수 있다.

<table>
    <caption>position 속성값 정리</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>static</b></td>
            <td>문서의 흐름에 맞춰 배치. 기본값</td>
        </tr>
        <tr>
            <td><b>relative</b></td>
            <td>위칫값을 지정할 수 있다는 점을 제외하고선 static과 동일.</td>
        </tr>
        <tr>
            <td><b>absolute</b></td>
            <td>relative값을 사용한 상위 요소를 기준으로 위치를 지정해 배치.</td>
        </tr>
        <tr>
            <td><b>fixed</b></td>
            <td>브라우저 창을 기준으로 위치를 지정해 배치.</td>
        </tr>
    </tbody>
</table>

`position` 속성 중에서 `absolute`값을 사용할 때는 주의할 점이 있다. 이 값은 부모 요소 중 `position:relative`를 사용한 요소를
기준으로 위치를 결정한다. 만약 부모 요소 중에 없다면 상위 요소를 찾아보고, 그래도 없다면 더 위의 요소를 찾게 된다. 따라서
어떤 요소에 `position:absolute`를 사용하기 위해선 반드시 부모 요소에 `position:relative`를 사용해야 한다.

```HTML
<div id="content">
    <h1>title</h1>
</div>

<style>
    h1 {
        position: absolute;
        left: 50px;
        bottom: -50px;
    }

    #content {
        /* 부모에 반드시 relative 써 줘야 함 */
        position: relative;
    }
</style>
```

---

<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800 dark:text-gray-200" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>


- **위치 좌표 속성 (`top`, `bottom`, `left`, `right`)**: `position`으로 기준을 정한 뒤, 해당 방향에서 얼마만큼 떨어질지 수치로 지정하여 요소를 배치함.
- **`position` 속성값**:
    - **`static`**: 문서의 흐름에 따라 순서대로 배치되는 기본값. 좌표 속성이 적용되지 않음.
    - **`relative`**: 요소가 원래 있어야 할 위치를 기준으로 좌표값을 주어 이동시킴.
    - **`absolute`**: `position` 속성(주로 `relative`)을 가진 가장 가까운 상위 요소를 기준으로 배치함.
    - **`fixed`**: 브라우저 창(뷰포트)을 기준으로 위치를 고정하여 스크롤해도 움직이지 않음.
- **`absolute` 사용 시 주의점**: `absolute` 요소가 엉뚱한 곳에 가지 않도록 기준점을 잡으려면, 부모(또는 조상) 요소에 반드시 `position: relative`를 선언해야 함.