---
title: "텍스트 관련 스타일(text) 속성 정리"
date: "2025-12-24 21:45:22"
category: "CSS"
description: "글자와 단어, 글자로 구성된 단락의 스타일을 바꾸는 법을 알아보자"
---

## 글자 관련 스타일(text)
이전의 글꼴 스타일(font)을 지정하는 방법과 조금 다른 문단 스타일(text) 지정도 존재한다.  
이 글은 자주 사용되는 text 스타일 주요 속성에 대해서 조사하는 글.

### color 속성
웹 문서에서 문단이나 제목 등의 텍스트에서 글자색을 바꿀 때는 `color` 속성을 사용한다.  
`color`에서 사용할 수 있는 속성값은 16진수나 rgb(혹은 rgba), hsl(혹은 hsla) 또는 색상 이름(키워드)이다.

```CSS
p { color: red }
```
각 표기법은 단순히 텍스트뿐만 아니라 웹 문서에서 색상이 필요한 모든 곳에 적용할 수 있기 때문에 사용법을 더 구체적으로 이야기해보자.
#### 16진수 표기법
<b>#ffff00</b>처럼 샾(#) 기호 다음에 6자리 16진수로 표시하는 방법이다.  
포토샵 같은 그래픽 프로그램에서도 색을 지정할 때 사용하는 가장 기본적인 방법이다. 6자리 16진수는 앞에서부터 2자리씩 묶어 #RRGGBB 형식으로 표시한다.
여기서 R은 Red, G은 Green, B은 Blue의 양을 표시한다. 각 색마다 하나도 섞이지 않음을 표시하는 0부터 해당 색이 가득 섞였음을 표시하는 ff까지 표현이 가능하다.

만약 색상값이 #0000ff처럼 두 자리씩 중복이 될 경우(0,0,f), #00f로 줄여서 표기가 가능하다.
```CSS
p { color: #fff }
```

#### hsl(hsla)
CSS3에서는 hsl(hsla)를 사용해서 색상을 표기할 수 있다. hsl은 hue(색상), saturation(채도), lightness(명도)의 줄임말이다.  
hsla는 여기에 alpha(불투명도)까지 추가한 것을 의미한다.

hue는 각도를 기준으로 색상을 둥글게 배치한 색상환으로 표시한다. 0도와 360도에는 빨간색, 120도에는 초록색, 240도에는 파란색이 배치되고 그 사이사이에 나머지 색들이 배치된다. 채도는 퍼센트(%)로 표시되는데 아무것도 섞이지 않으면 채도가 가장 높은 상태이다. 채도에서 0%는 회색 톤이고, 100%는 원래 색으로 표시된다.
명도 또한 퍼센트(%)로 표시하는데 0%는 가장 어둡고 50%는 원래 색, 100%는 흰색으로 나타낸다.

#### 영문 이름
색상을 표기하는 또 다른 방법으로 `red`, `yellow`, `black`처럼 대표적인 색상들을 사용할 수 있다.  
너무 세부적인 색들은 기억하기 어려우므로 `white`, `red`, `black`과 같이 대표적인 색들일 경우 이름 그대로 사용할 수 있다.
```CSS
p { color: red}
```


#### rgb(rgba)
rgb는 red,green,blue의 줄임말로 앞에서부터 차례대로 빨간색,초록색,파란색이 들어 있는 값을 나타낸다. 하나도 섞이지 않을 때는 0, 가득 섞였을 때는 255로
표시하며 그 사이의 값으로 각 색상의 양을 나타낸다.
```CSS
p { color: rgb(0,0,0) }
```

그리고 rgba를 사용하면 rgb로 표현한 색상의 불투명도를 지정할 수 있다. rgba에서 맨 끝의 alpha는 불투명도 값을 나타내며 0에서부터 1의 값이 들어갈 수 있다.
1은 완전히 불투명한 것이며 0은 완전히 투명하다.

---

### text-align
`text-align` 속성은 단락의 텍스트 정렬 방법을 지저한다. `text-align` 속성을 사용하면 워드나 한글 문서에서 흔히 사용하는 왼쪽 정렬, 오른쪽 정렬, 가운데 정렬 등을
쉽게 할 수 있다.
```CSS
p { text-align: center || left || right }
```
<table>
    <caption>text-align 속성값</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>start</b></td>
            <td>현재 텍스트 줄의 시작 위치에 맞추어 단략을 정렬. 기본값.</td>
        </tr>
        <tr>
            <td><b>end</b></td>
            <td>현재 텍스 줄의 끝 위치에 맞추어 단락을 정렬.</td>
        </tr>
        <tr>
            <td><b>left</b></td>
            <td>왼쪽에 맞추어 단락을 정렬.</td>
        </tr>
        <tr>
            <td><b>right</b></td>
            <td>오른쪽에 맞추어 단락을 정렬.</td>
        </tr>
        <tr>
            <td><b>center</b></td>
            <td>가운데에 맞추어 단락을 정렬.</td>
        </tr>
        <tr>
            <td><b>justify</b></td>
            <td>양쪽에 맞추어 단락을 정렬.</td>
        </tr>
        <tr>
            <td><b>match-parent</b></td>
            <td>부모 요소에 따라 단락을 정렬.</td>
        </tr>
    </tbody>
</table>

#### left와 start의 차이점
<code>start</code>와 <code>end</code>는 비교적 최근에 도입된 값이다.  
대부분의 언어에서는 한글처럼 왼쪽에서 오른쪽으로 글을 읽어나가기 때문이다. (ltr, left to right) 하지만 아랍어나 히브리어는
오른쪽에서 왼쪽으로 글을 읽는다. (rtl, right to left) 따라서 start와 end는 언어의 텍스트 작성 방향과 상관없이 사용할 수 있도록
추가된 값이 문장의 시작과 끝을 나타내는 start와 end이다.
아랍계열의 언어까지 지원하는 웹 사이트라면 start와 end를 사용하는 게 올바른 선택일 것이다.

---

### line-height
한 문단이 두 줄을 넘으면 사이의 간격이 생긴다. 이때 줄 높이가 너무 높거나 낮으면 가독이성 현저히 떨어진다.
이때 `line-height` 속성을 사용하면 줄 높이를 원하는 만큼 줄이거나 늘릴 수 있다.
줄 높이는 정확한 단위(pixel)로 값을 지정하거나 단락의 글자 크기를 기준으로 몇 배수인지 백분율이나 숫자로 지정할 수도 있다.
```CSS
p { font-size: 12px; line-height: 24px }
p { font-size: 12px; line-height: 2.0; }
p { font-size: 12px; line-height: 200%; }
```
글자를 세로로 가운데 정렬을 하고 싶으면 영역의 `height`와 `line-height`를 일치시키면 된다.

---

### text-decoration
`text-decoration` 속성은 텍스트에 밑줄,윗줄을 긋거나 취소선을 표시한다. 텍스트에 하이퍼링크를 적용하면 기본적으로 밑줄이 생기는데,
`text-decoration` 속성을 사용하면 지울 수 있다.

```CSS
.plink {
    color: #2f9e44;
    text-decoration: none;
}
```
나 역시 하이퍼 링크(`<a>`)에 밑줄을 지우고 색상을 변경하기 위해 `global.css`에 위와 같은 설정을 해두었다.

---

### text-shadow
텍스트에 그림자 효과를 줄 수 있는 속성이다. `text-shadow` 속성은 텍스트에 그림자 효과를 주어 좀 더 입체감 나게 보여줄 수 있다.
```CSS
p { text-shadow: <가로 거리> <세로 거리> <번짐 정도> <색상>; }
p { text-shadow: 1px 1px 3px black; }
```
<table>
    <caption>text-shadow 속성값</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>&lt;가로 거리&gt;</b></td>
            <td>텍스트부터 그림자까지의 가로 거리를 의미하며 필수속성. 양수는 글자의 오른쪽, 음수는 글자의 왼쪽에 그림자를 만듦</td>
        </tr>
        <tr>
            <td><b>&lt;세로 거리&gt;</b></td>
            <td>텍스트부터 그림자까지의 세로 거리를 의미하며 필수속성. 양수는 글자의 아래쪽, 음수는 글자의 위쪽에 그림자를 만듦</td>
        </tr>
        <tr>
            <td><b>&lt;번짐 정도&gt;</b></td>
            <td>그림자가 번지는 정도. 양수는 그림자가 모든 방향으로 번져서 크게 표시. 음수는 그림자가 모든 방향으로 축소된다. 기본값은 0.</td>
        </tr>
        <tr>
            <td><b>&lt;색상&gt;</b></td>
            <td>그림자 색상을 지정. 한 가지만 지정할 수 있고 공백으로 구분해 여러 색상을 지정 가능. 기본값은 현재 글자색.</td>
        </tr>
    </tbody>
</table>

---

### text-transform
텍스트에서 영문자를 표기할 때 대소 문자를 원하는 대로 바꿀 수 있다. `text-transform` 속성은 텍스트를 대소 문자 또는 전각 문자로 변환한다.
이 속성은 오직 영문자에만 적용된다.

<table>
    <caption>text-transform 속성값</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>capitalize</b></td>
            <td>첫 번째 글자를 대문자로 변환</td>
        </tr>
        <tr>
            <td><b>uppercase</b></td>
            <td>모든 글자를 대문자로 변환</td>
        </tr>
        <tr>
            <td><b>lowercase</b></td>
            <td>모든 글자를 소문자로 변환.</td>
        </tr>
        <tr>
            <td><b>full-width<b></td>
            <td>가능한 모든 문자를 전각 글자로 변환.</td>
        </tr>
    </tbody>
</table>

### letter-spacing, word-spacing
`letter-spacing` 속성은 글자와 글자 사이의 간격(자간)을 조절하고 `word-spacing` 속성은 단어와 단어 사이의 간격을 조절하는데 CSS에서는
주로 `letter-spacing` 속성을 사용해 자간을 조절한다. 이 속성들은 px,em과 같은 단위와 퍼센트로 크기를 조절한다.
```CSS
p { letter-spacing: 0.5em }
p { letter-spacing: 50% }
```

---

<div class="flex items-center gap-2"><svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/></svg><span class="font-bold text-2xl">글 요약</span></div>

- **`color`**: 텍스트의 색상을 지정하는 속성. 16진수 표기법(`#RRGGBB`), RGB/RGBA, HSL/HSLA, 또는 색상 이름(Keyword)을 사용하여 값을 설정할 수 있음.
- **`text-align`**: 텍스트의 가로 정렬 방식을 결정. `left`, `center`, `right` 외에도 언어의 읽는 방향(LTR/RTL)에 따라 유동적으로 작동하는 `start`, `end` 값을 사용할 수 있음.
- **`line-height`**: 줄 간격(행간)을 조절하는 속성. 픽셀 단위뿐만 아니라 글자 크기에 비례하는 숫자나 퍼센트로 지정할 수 있으며, 요소의 높이와 값을 같게 하여 세로 중앙 정렬을 구현하기도 함.
- **`text-decoration`**: 텍스트에 밑줄, 윗줄, 취소선 등을 표시. 주로 하이퍼링크(`<a>`)의 기본 밑줄을 제거(`none`)할 때 자주 사용.
- **`text-shadow`**: 텍스트에 그림자 효과를 주어 입체감을 더함. 가로/세로 거리, 번짐 정도, 색상 순으로 값을 지정.
- **`text-transform`**: 영문 텍스트의 대소문자 형식을 변환. 첫 글자만 대문자(`capitalize`), 전체 대문자(`uppercase`), 전체 소문자(`lowercase`) 등으로 설정 가능.
- **`letter-spacing` / `word-spacing`**: 각각 글자 사이의 간격(자간)과 단어 사이의 간격을 조절하는 속성으로, CSS에서는 주로 자간을 조절하는 `letter-spacing`이 자주 사용.