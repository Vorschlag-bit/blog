---
title: "<label>과 <input>: 폼을 만들 때 label을 꼭 써야 하는 이유"
date: "2025-12-21 15:19:38"
category: "HTML"
description: "사용자로부터 입력을 받는 form을 만들 때 사용하는 태그와 속성에 대해서 알아보자."
---

## Form 관련 태그들에 대해서 (<label\>, <input\>, <form\>)
웹 페이지에서 <b>사용자의 입력</b>을 받을 때는 form을 사용한다. 하나의 웹 페이지 안에는 다양한 form들이 존재한다.  
많은 초보 웹 개발자들이 단순히 `<input>`만 덩그러니 사용하는 실수를 저지를 때가 있다. 

이 글은 이러한 form과 관련된 태그와 그 태그들의 속성에 대해서 자세히 다루는 글.

#### 1. form을 만드는 태그 <form\>
폼을 만드는 가장 기본적인 태그로 기본적으로 열고 닫는 2개의 태그로 작성된다.
```HTML
<form>폼 요소</form>
```
#### 1-1. <form\> 태그의 속성들
`<form>` 태그는 여러 속성을 사용해서 입력받은 자료를 어떤 방식으로 서버에 넘길 건지, 서버에서 어떤 프로그램을 사용해 처리할 건지 지정할 수 있다.  
아래는 `<form>` 태그의 속성을 정리한 표이다.

<table>
    <caption> &lt;form&gt; 태그의 속성</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>method</b></td>
            <td>사용자가 입력한 내용을 서버에 넘길 HTML Method를 지정하는 속성이다. 사용 가능한 속성값은 <b>GET</b>과 <b>POST</b>이다.<br>
                <b>GET</b>: 데이터를 256 ~ 4096byte까지만 서버로 넘길 수 있다. url에 사용자가 넘긴 값이 그대로 노출된다.<br>
                <b>POST</b>: 입력한 내용의 길이에 제한이 없고, 사용자가 입력한 값도 url에 드러나지 않는다.
            </td>
        </tr>
        <!-- name -->
        <tr>
            <td><b>name</b></td>
            <td>자바스크립트로 폼을 제어할 때 사용할 폼의 이름을 지정하는 속성이다.</td>
        </tr>
        <!-- action -->
        <tr>
            <td><b>action</b></td>
            <td>&lt;form&gt; 태그 안의 내용을 처리할 서버 프로그램을 지정하는 속성이다.</td>
        </tr>
        <!-- target -->
        <tr>
            <td><b>target</b></td>
            <td><code>action</code> 속성에서 지정한 스크립트 파일을 현재 창이 아닌 다른 위치에서 열도록 한다.</td>
        </tr>
        <!-- autocomplete -->
        <tr>
            <td><b>autocomplete</b></td>
            <td>폼에 입력했던 예전 내용을 자동으로 표시해주는 기능(자동완성)을 on/off할 수 있는 속성. (기본 on)</td>
        </tr>
    </tbody>
</table>

### 2. 폼 요소를 그룹으로 묶는 <fieldset\>, <legend\> 태그
하나의 폼 안에서 여러 구역을 나누어 표시하고 싶을 때, `<fieldset>` 태그를 사용하면 된다.  
`<legend>` 태그는 `<fieldset>` 태그로 묶은 그룹에 제목을 붙이는 용도로 사용한다.

```HTML
<form>
    <fieldset>
        <legend>이름</legend>
    </fieldset>
    <fieldset>
        <legend>나이</legend>
    </fieldset>
</form>
```

### 3. 폼 요소에 레이블을 붙이는 <label\> 태그
`<label>` 태그는 `<input>` 태그와 같은 폼 요소에 레이블을 붙일 때 사용한다. <b>레이블</b>이란 입력란 가까이에 표시되는
텍스트를 의미한다. `<label>` 태그를 사용하면 폼 요소와 레이블 테스트의 연관관계를 웹 브라우저가 알 수 있게 한다.

`<label>` 태그없이 `<input>` 태그만을 사용해서 사용자 입력을 받는다고 가정해보자.
```HTML
<span>아이디:</span>
<input name="id_with_span" type="text">
```
<span>아이디:</span>
<input name="id_without_span" type="text" style="border: 2px solid black" >  

시각적으로는 <b>"아이디:"</b>라는 글자 옆에 입력창이 있으니 문제가 없어 보인다. 하지만 2가지 단점이 분명하게 존재한다.  
- 1. <b>UX 저하</b>: "아이디:"라는 글자를 클릭해도 입력창에 커서가 생기지 않는다. 사용자는 반드시 입력칸을 클릭해야만 한다. 이는 모바일 환경에선 더 불편해질 수 있다.
- 2. <b>웹 접근성 저하</b>: 스크린 리더는 입력창에 포커스가 갈 때, 그냥 "텍스트 입력창"이라고만 읽어준다. 시각 장애인은 이게 아이디 입력칸인지 비밀번호 인력칸이지 모를 것이다.

`<label>` 태그는 이러한 문제를 해결하기 위해 존재한다. `<input>` 태그에 이름표를 문자 그대로 붙여주는 기능을 하는 셈이다.  
이걸 사용하면 브라우저와 스크린 리더에게 `<input>` 태그의 목적에 대해서 명확히 알려줄 수 있게 된다.

#### 3-1. <label\> 태그의 사용 방법
`<label>` 태그는 2가지 방법으로 사용이 가능하다. 첫 번째는 태그 안에 폼 요소를 넣는 것이다.
```HTML
<label>레이블 명<input></label>
```
두 번째 방식은 `<label>` 태그와 폼 요소를 따로 사용하고 `<label>` 태그의 for 속성과 폼 요소의 id 속성을 이용해 서로 연결하는 것이다.  
즉 폼요소의 id 속성값을 레이블 태그의 for 속성에게 알려주는 방법이다.
```HTML
<label for="id">레이블 명</label>
<input id="id">
```
> <b>React/Next.js</b> 사용자의 경우 주의해야 할 점이 있다. React에선 <code>for</code>가 자바스크립트 반복문 키워드라
> 사용할 수 없다. 따라서 <code>htmlFor</code>를 사용해야 한다!

```javascript
<label> htmlFor="id"</label>
```

### 3-2. <labe\> 태그 사용 시 얻는 효용
<b>1. 클릭 영역이 넓어진다. (UX 향상)</b>  
가장 크게 체감되는 변화이다. 특히 <b>체크박스</b>나 <b>라디오 버튼</b>에서 효과적이다.
```HTML
<!-- 글자(동의합니다)를 눌러도 체크가 된다! -->
<label for="agree">
  <input type="checkbox" id="agree">
  이용 약관에 동의합니다.
</label>
```
<label for="agree">
  <input type="checkbox" id="agree">
  이용 약관에 동의합니다.
</label>

<code>&lt;label&gt;</code>를 사용하면 "이용 약관에 동의합니다."라는 글자를 클릭해도 체크가 된다. UX에 있어서 훨씬 큰 향상이다.  

<b>2. 스크린 리더가 똑똑해진다 (웹 접근성 향상)</b>  
각 장애인이 탭(Tab) 키로 입력창으로 이동하면, 스크린 리더가 연결된 label의 텍스트를 읽어준다.

> "아이디, 텍스트 입력 편집."

### 4. 사용자의 입력을 받는 <input\> 태그
웹 페이지에서 흔히 볼 수 있는 입력을 받는 칸은 폼을 사용해서 작성된 것이다.  
입력 칸에 마우스 우클릭을 누르고 <b>[검사]</b>를 누르면 해당 태그를 곧바로 확인할 수 있다.
<figure>
    <img src="/images/input_ex.png" alt="입력 칸에 마우스 우클릭 [검사]를 선택한 사진">
    <figcaption>개발자 도구 창에서 &lt;input&gt; 태그 확인</figcaption>
</figure>

### 4-1. <input\> 태그의 속성들
<code>input</code> 태그에서 입력 형태를 지정할 때 <b>type</b> 속성을 사용한다.  
아래 표는 <code>input</code> 태그에서 사용할 수 있는 다양한 type 속성을 정리한 것이다.  

<table>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>text</b></td>
            <td>한 줄짜리 텍스트를 입력할 수 있는 텍스트 박스 (기본값)</td>
        </tr>
        <tr>
            <td><b>password</b></td>
            <td>비밀번호를 입력할 수 있는 필드</td>
        </tr>
        <tr>
            <td><b>search</b></td>
            <td>검색할 때 입력하는 필드</td>
        </tr>
        <tr>
            <td><b>url</b></td>
            <td>URL 주소를 입력할 수 있는 필드</td>
        </tr>
        <tr>
            <td><b>email</b></td>
            <td>이메일 주소를 입력할 수 있는 필드</td>
        </tr>
        <tr>
            <td><b>tel</b></td>
            <td>전화번호를 입력할 수 있는 필드</td>
        </tr>
        <tr>
            <td><b>checkbox</b></td>
            <td>주어진 여러 항목에서 <b>2개 이상</b> 선택할 수 있는 체크박스</td>
        </tr>
        <tr>
            <td><b>radio</b></td>
            <td>주어진 여러 항목에서 <b>1개만</b> 선택할 수 있는 라디오 버튼</td>
        </tr>
        <tr>
            <td><b>number</b></td>
            <td>수량 숫자를 조절할 수 있는 스핀 박스</td>
        </tr>
        <tr>
            <td><b>range</b></td>
            <td>크기 숫자를 조절할 수 있는 슬라이드 막대</td>
        </tr>
        <tr>
            <td><b>date</b></td>
            <td>사용자 지역을 기준으로 날짜(연, 월, 일)를 넣음</td>
        </tr>
        <tr>
            <td><b>month</b></td>
            <td>사용자 지역을 기준으로 날짜(연, 월)를 넣음</td>
        </tr>
        <tr>
            <td><b>week</b></td>
            <td>사용자 지역을 기준으로 날짜(월, 주)를 넣음</td>
        </tr>
        <tr>
            <td><b>time</b></td>
            <td>사용자 지역을 기준으로 시간(시, 분, 초, 분할 초)를 넣음</td>
        </tr>
        <tr>
            <td><b>datetime-local</b></td>
            <td>사용자 지역을 기준으로 날짜와 시간(연, 월, 일, 시, 분, 초, 분할 초)를 넣음</td>
        </tr>
        <tr>
            <td><b>submit</b></td>
            <td>전송 버튼</td>
        </tr>
        <tr>
            <td><b>reset</b></td>
            <td>리셋 버튼</td>
        </tr>
        <tr>
            <td><b>image</b></td>
            <td>submit 버튼 대신 사용할 이미지</td>
        </tr>
        <tr>
            <td><b>button</b></td>
            <td>일반 버튼</td>
        </tr>
        <tr>
            <td><b>file</b></td>
            <td>파일을 첨부할 수 있는 버튼</td>
        </tr>
        <tr>
            <td><b>hidden</b></td>
            <td>사용자에게는 보이지 않으나 서버로 넘겨주는 값이 있는 필드</td>
        </tr>
    </tbody>
</table>

type 속성만 보아도 어떤 정보를 입력할 수 있는지 짐작할 수 있을 것이다. 자주 사용하는 type과 그 성질들을 보자.  

#### 4-1-1. 텍스트와 비밀번호 (text,password)
<code>text</code> 필드는 폼에세 가장 흔히 사용된다. 주로 아이디, 이름, 주소 등 한 줄짜리 일반 텍스트를 입력할 때 사용한다.  
<code>password</code> 필드는 입력하는 내용을 화면에 보여주고 싶지 않을 때 사용한다. <b>*</b>나 <b>●</b>로 표시된다.  
이 점을 제외하곤 텍스트 필드와 동일하다.
```HTML
<input type="text">
<input type="password">
```

<label>text 필드<input name="text_ex" type="text" style="border: 2px solid black"></label>
<label>password 필드<input name="pwd_ex" type="password" style="border: 2px solid black"></label>

텍스트 필드와 비밀번호 필드에서 사용하는 주요 속성도 존재한다.
<table>
    <caption>텍스트,비밀번호 필드에서 사용하는 수요 속성</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>size</b></td>
            <td>텍스트와 비밀번호 필드의 길이를 지정한다. 화면에 보이는 입력된 글자를 수를 지정.</td>
        </tr>
        <tr>
            <td><b>value</b></td>
            <td>텍스트 필드 요소가 화면에 표시될 때 텍스트 필드 부분에 보여주는 내용. 이 속성을 사용하지 않으면 빈 필드가 나온다.</td>
        </tr>
        <tr>
            <td><b>maxlength</b></td>
            <td>텍스트 필드와 비밀번호 필드에 입력할 수 있는 최대 글자를 지정.</td>
        </tr>
    </tbody>
</table>

#### 4-1-2. 검색,URL,이메일 (search,url,email)
텍스트 필드는 한 줄짜리 일반 텍스트를 입력한다. 하지만 폼을 만들다 보면 텍스트 필드를 세분화할 때가 있다.  
이 필드들은 텍스트 필드를 기본으로하기에 앞서 설명한 텍스트 필드와 비슷한 속성을 갖는다.

`type=search`를 사용하면 화면 상으론 그냥 텍스트 필드와 동일하나, 웹 브라우저나 스크린 리더는 이를 명확하게 검색을 위한 텍스트 필드라고 인식한다.
크롬이나 엣지를 비롯해 모바일 기기의 웹 브라우저에서 이 필드에 검색어를 입력하면 오른쪽에 <b>x</b>가 표시되어 입력한 검색어를 손쉽게 지울 수 있다.
```HTML
<input type="search" />
```
<label>검색 필드<input name="search_ex" type="search" style="border: 2px solid black"></label>

`type=url`은 웹 주소를 입력하는 필드이고, `type=email`을 이메일 주소를 입력하는 필드이다.  
이전 버전인 HTML4에선 입력한 값이 이메일 주소인지 URL 주소인지 자바스크립트를 이용해서 직접 확인해야 했으나, HTML5에선 각 필드에 맞게
작성만 하면 웹 브라우저가 알아서 확인한다. 만약 입력값이 저장한 형식에 맞지 않는다면 오류 메세지가 나온다.

`type=tel`은 전화번호를 나타내는 필드이다. 전화번호는 지역마다 형식이 다르므로 사용자가 입력한 값이 전화번호인지 아닌지 체크할 수 없다. 
모바일 기기에서 페이지에 이 값을 사용하면 곧바로 전화를 걸 수 있다.

이처럼 텍스트 필드에서 세분화된 필드는 PC용 웹 브라우저에선 큰 변화가 없어보이나, 모바일 기기의 웹 브라우저에서 확인하면 이메일 주소를 입력하거나
전화번호를 입력할 때 <b>가상 키보드 배열이 바뀌는 것</b>을 볼 수 있다.

#### 4-1-3. 체크 박스,라디오 버튼 (checkbox,radio)
체크 박스와 라디오 버튼은 여러 항목 중 원하는 항목을 선택할 때 사용하는 폼 요소이다. 이때 항목을 <b>1개만 선택</b>하려면 라디오 버튼을 사용하고,
<b>2개 이상</b> 선택하려면 체크 박스를 사용해야 한다. 라디오 버튼은 항목을 1개만 선택할 수 있으므로 이미 선택한 항목이 있을 경우 다른 항목을 선택 시
이전은 자동으로 취소가 된다.

```HTML
<input type="checkbox">
<input type="radio">
```

<ul>
    <li>
        <label for="check_ex1">
          <input name="check" type="checkbox" id="check_ex1">
          체크 박스 예시
        </label>
    </li>
    <li>
        <label for="check_ex2">
          <input name="check" type="checkbox" id="check_ex2">
          체크 박스 예시
        </label>
    </li>
</ul>

<ul>
    <li>
        <label for="radio_ex1">
          <input name="rad" type="radio" id="radio_ex1">
          라디오 버튼 예시
        </label>
    </li>
    <li>
        <label for="radio_ex2">
          <input name="rad" type="radio" id="radio_ex2">
          라디오 버튼 예시
        </label>
    </li>
</ul>

체크 박스와 라디오 번튼에서 사용할 수 있는 속성은 아래와 같다.
<table>
    <caption>체크 박스, 라디오 버튼에서 사용하는 속성</caption>
    <thead>
        <tr>
            <th>종류</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>value</b></td>
            <td>선택한 체크 박스나 라디오 버튼을 서버에게 알려줄 때 넘겨줄 값을 지정. 이 값은 영문/숫자여야하며 필수 속성</td>
        </tr>
        <tr>
            <td><b>checked</b></td>
            <td>체크 박스나 라디오 버튼의 항목에서 기본으로 선택해 놓고 싶은 항목에 사용. 속성값은 따로 없음</td>
        </tr>
        <tr>
            <td><b>name</b></td>
            <td>라디오 버튼과 체크 박스는 하나의 그룹으로 동작하기 때문에 name 속성을 일치시켜야 함</td>
        </tr>
    </tbody>
</table>

#### 4-1-4. 숫자 입력 필드들 (number, range)
텍스트 필드에 사용자가 숫자를 직접 입력할 수도 있지만, `type="number"`나 `type="range"`를 통해서도 선택할 수도 있다.  
`type="number"`는 스핀 박스를 사용해 숫자를 입력하고, `type="range"`는 슬라이드 막대를 사용해서 범위를 입력한다.

정확한 숫자가 필요한 경우에는 `type="number"`를 사용하고, 숫자가 정확할 필요가 없는 경우에는 `type="range"`를 통해 크고 작음만
직관적으로 표시가 가능하다.

```HTML
<input type="number">
<input type="range">
```

number와 range에서 사용 가능한 속성은 아래와 같다.
<table>
    <caption>숫자 입력 필드에서 사용하는 속성들</caption>
    <thead>
        <tr>
            <th>속성</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>min</b></td>
            <td>필드에 입력할 수 있는 최솟값을 지정. 기본값은 0</td>
        </tr>
        <tr>
            <td><b>max</b></td>
            <td>필드에 입력할 수 있는 최댓값을 지정. 기본값은 100</td>
        </tr>
        <tr>
            <td><b>step</b></td>
            <td>숫자 간격을 지정. 기본값은 1</td>
        </tr>
        <tr>
            <td><b>value</b></td>
            <td>필드에 표시할 초깃값</td>
        </tr>
    </tbody>
</table>

`type="number"`와 `type="range"`는 최신 HTML에 새로 추가된 것이기 때문에 웹 브라우저마다 화면에 그려지는 모습이 다르다.  
현재 나는 <b>크롬</b>을 기준으로 설명한다.

<label>number 예시<input type="number" min="1" max="123" step="2" style="border: 2px solid black"></label>

최솟값이 1이고 최댓값은 123이며 2씩 올라가는 number 박스이다.

<label>스핀박스 예시<input type="range" min="1" max="123" step="2" style="border: 2px solid black"></label>

마찬가지로 최솟값은 1, 최댓값 123, step 2이나 스핀 박스이다.

`type="range"`를 사용할 경우 값을 조절하더라도 <b>그 값이 화면에는 나타나지 않는다</b>는 특성이 있다. 값을 변경할 때마다 화면에 표시하고 싶다면
자바스크립트를 사용해야 한다.

<form>
    <input type="range" min="1" max="123" step="2" value="25" oninput="document.getElementById('selected-value').innerText = this.value">
    <span id="selected-value">25</span>
</form>

#### 4-1-5. 날짜 입력 필드들(date, month, week)
웹 문서나 App에 달력을 넣으려면 `type="date"`, `type="month"`, `type="week"` 같은 날짜 관련 속성을 이용해야 한다.  

```HTML
<!-- date로 지정하면 달력에서 날짜를 선택 가능해진다. 날짜 선택 시 필드에 'yyyy-mm-dd' 형식으로 표시된다. -->
<input type="date">
<!-- month로 지정하면 달력에서 월을 선택 가능해진다. 월 선택 시 필드에 'yyyy-mm' 형식으로 표시된다. -->
<input type="month">
<!-- week로 지정하면 달력에서 주를 선택 가능해진다. 주 선택 시 필드에 '1월 첫째 주를 기준으로 몇 번째 주인지' 계산된다. -->
<input type="week">
```

<label>date 예시<input type="date" style="border: 2px solid black"></label><br>
<label>month 예시<input type="month" style="border: 2px solid black"></label><br>
<label>week 예시<input type="week" style="border: 2px solid black"></label>

#### 4-1-6. 시간 입력 필드들 (time, datetime-local)
<b>시간을 지정</b>할 때는 보통 `type="time"`을 사용하고, <b>날짜와 시간을 함꼐 지정</b>할 때는 `type="datetime-local"`을 사용한다.
```HTML
<!-- time은 '시간'을 입력하게 함. 필드는 웹브라우저마다 조금씩 다르다, '오전/오후', '시', '분'으로 구성된다. -->
<input type="time">
<!-- datetime-local은 사용자가 웹 문서를 보는 '지역에 맞는 날짜와 시간'을 함께 입력 가능해진다. -->
<input type="datetime-local">
```
<label>time 예시<input type="time" style="border: 2px solid black"></label><br>
<label>datetime-local 예시<input type="datetime-local" style="border: 2px solid black"></label>

날짜/시간을 표시할 때도 숫자 입력 필드들과 똑같은 속성들을 사용해서 초깃값,최소/최소 등을 표시할 수 있다.

<table style="border-collapse: collapse;">
    <caption>날짜와 시간 입력 필드에서 사용하는 속성들</caption>
    <thead>
        <tr>
            <th>속성</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>min</b></td>
            <td rowspan="2">날짜나 시간의 범위를 제한할 때 사용. min은 범위의 시작 날짜나 속성을, max는 범위의 마지막 날짜나 시간을 지정한다.</td>
        </tr>
        <tr>
            <td style="border-right: 2px dashed #d1d5db; border-bottom: 2px dashed #d1d5db; padding-left: 16px; padding-right: 16px; vertical-align: middle;"><b>max</b></td>
        </tr>
        <tr>
            <td><b>step</b></td>
            <td>숫자 간격을 지정. 기본값은 1</td>
        </tr>
        <tr>
            <td><b>value</b></td>
            <td>필드에 표시할 초깃값</td>
        </tr>
    </tbody>
</table>

#### 4-1-7. 전송/리셋 버튼 (submit, reset)
전송 버튼을 나타내는 submit은 폼에 입력한 정보를 서버로 전송한다. 전달되는 곳은 `<form>` 태그의 action 속성에서 지정한 프로그램이다.
리셋 버튼은 `<input>` 태그에 입력한 요소를 모두 지운다. 그리고 `value` 속성을 사용해서 버튼에 표시될 내용을 지정할 수 있다.

```HTML
<input type="submit" value="버튼 표시 내용">
<input type="reset" value="버튼 표시 내용">
```

#### 4-1-8. 이미지 버튼 (image)
submit과 같은 기능이지만 이미지 버튼이다.
```HTML
<input type="image" src="이미지 경로" alt="대체 텍스트" >
```

#### 4-1-9. 기본 버튼 (button)
`<input` 태그에서 `type="button"`을 사용하면 기능이 없는 버튼 형태만 나온다. 주로 자바스크립트로 구현된 이벤트를 실행시킬 때 사용한다.  
```HTML
<input type="button" value="버튼 표시 내용">
```

#### 4-1-10. 파일 첨부 버튼 (file)
폼에서 사진이나 문서를 첨부하는 경우 사용하는 타입이다.  
`type="file"`을 사용하면 웹 브라우저 화면에 <b>[파일 선택]</b>이나 <b>[찾아보기]</b> 버튼 등이 표시된다.
```HTML
<input type="file" >
```
<input type="file" style="border: 2px solid black">

#### 4-1-11. 히든 필드 (hidden)
히든 필드는 화면의 폼에는 보이지 않으나, 사용자가 입력한 정보를 서버로 보낼 때 함께 전송되는 요소이다.  
사용자가 굳이 볼 필요없고 관리자는 알아야하는 정보를 보낼 때 사용한다.
```HTML
<input type="hidden" name="이름 정보" value="사용자 이름을 보냄">
```
이 필드는 주로 회원가입이나 쇼핑 구매 화면에서 많이 보인다. 

### 마무리 & 글 요약
<code>input</code>태그는 아무래도 웹 페이지에서 정말 중요하다보니 세세하게 작성할 거리가 너무 많았다.
사실 아직 남은 부분이 있어서 2개로 나눠서 작성을 하기 위해 여기서 멈춘다.

다음 글에선 <code>input</code> 태그 자체의 또 다른 속성들에 대해서 다룰 예정.

<div class="flex items-center gap-2">
    <svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/> </svg>
    <span class="font-bold text-2xl">
        글 요약
    </span>
</div>

1.  **`<form>` 태그**: 사용자 입력을 서버로 전송하는 껍데기.
    *   **`action`**: 어디로 보낼지(URL) 지정.
    *   **`method`**: 어떻게 보낼지(**GET**은 조회/노출, **POST**는 전송/숨김) 지정.
2.  **`<label>`의 중요성**: `input`의 이름표 역할을 하며 **웹 접근성**과 <b>UX(클릭 영역 확대)</b>를 위해 필수적으로 사용해야 함.
    *   연결 방법: `<label for="id">`와 `<input id="id">`를 일치시거나 label 태그로 input 태그 감싸기.
    *   <b>주의</b>: React/Next.js에서는 `for` 대신 <b>`htmlFor`</b>를 사용!
3.  **다양한 `<input>` 타입**:
    *   **텍스트**: `text`, `password`, `email`, `tel` (모바일 키패드 최적화)
    *   **선택**: `checkbox` (다중 선택), `radio` (단일 선택)
    *   **날짜/숫자**: `date`, `number`, `range` 등을 사용하면 브라우저가 알아서 달력이나 스핀 박스를 제공.
4.  **구조화**: `<fieldset>`과 `<legend>`를 사용하면 복잡한 폼 요소를 의미 있는 그룹으로 묶을 수 있음.