---
title: "웹 문서 레이아웃 관련 속성 정리"
date: "2025-12-30 16:46:06"
category: "CSS"
description: "웹 문서 요소의 레이아웃(배치) 관련 속성을 알아보자."
---

## 레이아웃(배치) 관련 속성 정리
박스 모델의 블록 레벨 특성과 인라인 레벨 특성을 안다면, 2가지 특성을 필요할 때 바꿔서 사용할 수도 있다.  
기본 위치에서 벗어나 왼쪽이나 오른쪽으로 배치하는 등 웹 문서의 레이아웃을 잡는 방법에 대해서 알아보자.

### display
`display` 속성을 사용하면 블록 레벨 요소와 인라인 레벨 요소를 서로 바꿔서 사용할 수 있다.  
`display` 속성은 웹 요소를 화면에 어떤 모양으로 보여줄지 지정하는 속성이다. `display` 속성에서 사용할 수 있는 값은 
매우 다양한데, 그 중에서 자주 사용하는 속성만 표로 정리해보았다.

<table>
    <caption>display 속성값</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>block</b></td>
            <td>블록 레벨 요소로 표시</td>
        </tr>
        <tr>
            <td><b>inline</b></td>
            <td>인라인 레벨 요소로 표시</td>
        </tr>
        <tr>
            <td><b>inline-block</b></td>
            <td>인라인 레벨처럼 나란히 배치하지만 블록 레벨처럼 너비와 높이를 지정할 수 있음.</td>
        </tr>
        <tr>
            <td><b>none</b></td>
            <td>해당 요소를 화면에 표시 X</td>
        </tr>
    </tbody>
</table>

예를 들어서 블록 요소를 사용해서 너비와 높이를 지정하고 싶지만, 가로로 배치하고 싶을 때는 `inline-block` 속성을 사용하면 된다.
```CSS
ul li {
    width: 200px;
    height: 100px;
    margin: 10px;
    display: inline-height;
}
```

---

### float
웹 문서를 만들다 보면 단락의 왼쪽이나 오른쪽에 이미지를 나란히 표시해야 할 경우가 있다. 하지만 `<p>` 태그는 블록 레벨 요소이기 때문에
구조적으로 이미지와 나란히 한 줄에 배치할 수 없다. 이럴 때는 `float` 속성을 사용해 이미지를 왼쪽이나 오른쪽으로 배치하고 그 주변에 텍스로
둘러싸도록 하면 된다.

<table>
    <caption>float 속성값</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>left</b></td>
            <td>해당 요소를 문서의 왼쪽에 배치</td>
        </tr>
        <tr>
            <td><b>right</b></td>
            <td>해당 요소를 문서의 오른쪽에 배치</td>
        </tr>
        <tr>
            <td><b>none</b></td>
            <td>해당 요소를 좌우 어느 쪽에도 배치하지 않음. 기본값</td>
        </tr>
    </tbody>
</table>

```CSS
<p>글 내용</p>
<img src="/images/ex.png" />
<p>이어지는 글 내용</p>
<p>이어지는 글 내용2</p>
```
이러한 HTML 구조가 존재하면 아래의 그림과 같이 배치될 것이다.

<img src="/images/p_img.png" alt="p 태그와 img 태그가 모두 한 줄씩 차지해서 모든 배치가 세로로된 모습">

하지만 여기서 `float`속성을 사용하면 이러한 기본 흐름을 바꿀 수 있다. 이미지에 `float: left` 속성을 주면 기본 흐름에서 두 번째
텍스트 단락을 표시할 곳에 이미지가 위치하게 된다.

<img src="/images/p_img2.png" alt="img 태그가 float로 인해서 겹치지 않으면서 왼쪽으로 p 태그는 오른쪽으로 배치된 모습"> 

여기에 이미지 태그에 `margin-right`을 좀 준다면 아주 그럴 듯하게 배치가 될 것이다.

### float를 활용한 가로 배치
`float` 속성을 사용하면 특정 요소를 문서의 기본 흐름과 상관없이 자유롭게 배치할 수 있기 때문에 웹 문서 전체 레이아웃을 `float`로 만들기도
했다. 하지만 최근에는 `flex` 박스 레이아웃이나 CSS 그리드 레이아웃같이 문서 레이아웃을 위한 표존이 등장하면서 `float` 속성으로 전체 레이아웃을
만드는 일이 줄어들고 있다.

대부분의 사이트에서 가로 메뉴를 많이 사용하는데, 그러한 메뉴 코드를 살펴보면 `<ul>`과 `<li>`를 통해 목록을 만들고, `float: left` 속성으로
가로로 배치한 걸 확인하 수 있다. 이렇게 비단 메뉴뿐만 아니라 다양한 웹 요소를 <b>가로 배치</b>할 때 `float` 속성은 매우 유용하다.

---

### clear
`float` 속성을 사용해 웹 요소를 왼쪽이나 오른쪽에 배치하면 그 다음에 넣는 다른 요소에도 똑같은 속성이 전달된다. `float` 속성으로 레이아웃을
만들다 보면 너으 부분에서는 기본 흐름으로 바꿔야 한다는 의미다. 따라서 `float` 속성이 더 이상 유용하다고 알려주는 속성이 있는데 그게 바로
`clear` 속성이다.

<table>
    <caption>clear 속성값</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>left</b></td>
            <td><code>float: left</code>를 해제</td>
        </tr>
        <tr>
            <td><b>right</b></td>
            <td><code>float: right</code>를 해제</td>
        </tr>
        <tr>
            <td><b>both</b></td>
            <td><code>float: left</code>와 <code>float: right</code>를 해제</td>
        </tr>
    </tbody>
</table>

`float: left`를 이용해 왼쪽 배치했다면 `clear: left`, `float: right`을 이용해 해제하고 오른쪽 배치했다면 `float: right`을 이용해 해제하면 된다.

#### display: inline-block과 float: left의 차이
둘 다 첫 번째 요소를 왼쪽으로 배치한다는 점에서 보여지는 화면은 동일하다. 하지만 `display: inline-block`은 가로로 배치하면서
기본 마진과 패딩이 있으나, `float: left`로 배치하면 가로로 배치될 때 요소에 기본 마진과 패딩이 없다. 따라서 필요하다면 별도로 마진과 패딩을
지정해야 한다. 또한 `float: left`를 사용하면 `clear` 속성으로 이후에 요소에선 플로팅을 해제해야 한다.

---

<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800 dark:text-gray-200" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>


- **`display`**: 요소를 블록이나 인라인 성질로 변경하여 배치 방식을 결정함. 특히 **`inline-block`**은 인라인처럼 한 줄에 나란히 배치되면서도 블록처럼 너비와 높이 값을 지정할 수 있어 유용함.
- **`float`**: 요소를 문서의 흐름에서 떼어내어 왼쪽이나 오른쪽으로 정렬함. 이미지 주변에 텍스트를 감싸게 하거나, 리스트를 가로로 배치할 때 주로 사용함.
- **`clear`**: `float` 속성은 이후 요소들에게도 계속 영향을 미치므로, 이를 해제하여 정상적인 배치 흐름으로 되돌릴 때 사용함. (`left`, `right`, `both`)
- **`inline-block` vs `float`**: 두 방식 모두 가로 배치가 가능하지만, `inline-block`은 요소 간에 기본 여백이 존재하고 `float`는 여백이 없어 별도 지정이 필요하며 반드시 `clear` 처리를 해야 한다는 차이가 있음.