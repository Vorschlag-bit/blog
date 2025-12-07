---
title: "img와 alt, 엑박 피하기 & 시각장애인을 위한 배려"
date: "2025-12-07 21:30:11"
category: "HTML"
description: "이미지를 넣는 <img> 태그의 특성과 중요한 필드인 alt에 대해서 알아보자"
---

## <img\> 태그의 특징에 대해서 알아보자

이제까지 우리는 제목 태그(`h1`~`h6`)를 통해서 글의 뼈대를 세우는 방식을 배웠다.  
이 글은 줄글로 이뤄진 페이지에 내용을 더해주는 **이미지** 태그와 자주 빼먹지만 SEO 최적화에 정말 중요한 `alt`에 대해서 알아본다.
### 1. 닫는 태그가 없다(Void Element)
지금까지 배운 `<main>`, `<section>`, `<h1>` 태그들은 모두 `<태그>내용</태그>` 형태였다. 하지만 `<img>` 태그는 좀 다르다.
```HTML
<!-- 닫는 태그(</img>)가 없음! -->
<img src="사진주소.jpg" alt="설명">
```
`<img>` 태그는 텍스트를 감싸는 것이 아닌, 외부 파일을 불러와서 박아넣는 태그이기 때문에 닫는 태그가 필요없는 <strong>빈 태그(Void Element)</strong>이다.
### 2. 가장 중요한 2가지 속성: src & alt
`src`(Source)는 이미지의 주소이다.  
이미지 파일이 어디에 있는지를 알려주는 역할을 수행한다.
- 절대 경로: `https://mysite.com/image.jpg` (외부 이미지)
- 상대 경로: `./images/logo.png` (내 프로젝트 디렉토리 내부의 이미지)

`alt`(Alternative Text)는 대체 텍스트이다.  
**이미지가 화면에 나오지 않을 때** 대신 보여줄 텍스트이다.

보통 이미지는 다양한 이유로 인해서 나오지 않을 수 있다.
- 1. 서버 오류나 파일 경로 오타로 인해서(흔히 말하는 엑스박스)
- 2. 사용자의 인터넷이 너무 느려서 로딩 중
- 3. **시각 장애인이 '스크린 리더'를 사용할 때** (이미지를 볼 수 없으므로 `alt` 내용을 읽어준다)

### 3. 어떻게 해야 alt를 잘 작성할까?
많은 초보자가(나를 포함한) `alt`를 비워놓거나 무의미하게 작성한다. 이는 SEO가 아주 싫어하는 행동이다.

**나쁜 예시**
```HTML
<!-- 1. alt를 아예 안 씀 (최악) -->
<img src="cat.jpg"> 

<!-- 2. 파일명을 그대로 씀 -->
<img src="cat.jpg" alt="cat.jpg">

<!-- 3. 너무 단순함 -->
<img src="cat.jpg" alt="사진">
```
스크린 리더는 1번의 경우 파일명인 "cat 점 jpg"를 읽거나, 아예 "이미지"라고만 읽고 지나간다. 사용자는 이게 뭔지 전혀 알 수 없다.

**좋은 예시**
```HTML
<img src="cat.jpg" alt="햇살을 받으며 낮잠을 자고 있는 치즈 고양이">
```
이미지가 깨져도, 눈이 보이지 않아도 어떤 상황인지 머릿속에 그려지고 구글 이미지 검색에도 이 문장이 걸려서 노출될 확률이 높아진다.

**TMI**  
배경 무늬나 의미 없는 장식용 아이콘이라면? 스크린 리더가 굳이 읽을 필요가 없을 것이다.  
이때는 `alt` 값을 아예 비워두자. (속성 자체를 지우는 게 아니라, 빈따옴표 <strong>""</strong>를 작성)
```HTML
<!-- 스크린 리더가 "이건 무시해도 되는구나" 하고 넘어간다. -->
<img src="decoration-line.png" alt="">
```

### 4. 성능 향상을 위한 속성(width,height,loading)
`width`와 `height`는 반드시 작성해주자. 이미지 크기를 미리 지정하지 않는다면, 브라우저는 이미지를 다 다운받기 전까지 그 공간은 **0**으로 둔다.
그러다가 이미지가 로딩이 되면 화면이 순간적으로 밀려나는 <strong>CLS(Cumulative Layout Shift)</strong>현상이 발생한다.

```HTML
<!-- 브라우저에게 "이만큼 자리를 미리 비워둬!"라고 알려주는 셈이다. -->
<img src="photo.jpg" alt="풍경" width="500" height="300">
```

`loading = lazy`는 스크롤을 내려서 이미지가 화면에 보일 때쯤 로딩하게 만드는 속성이다. 초기 로딩 속도를 빠르게 해주는 데 중요한 역할.
```HTML
<img src="heavy-photo.jpg" alt="..." loading="lazy">
```

내가 사용하고 있는 `Next.js`의 `<Image />` 컴포넌트는 위에서 말한 `width`, `height`, `lazy loading`을 **자동으로** 처리해준다.
따라서 Next.js를 사용하는 개발자라면 일반 `img` 태그가 아니라 Next.js의 Image 컴포넌트를 반드시 사용하자.

### 5. figure와 figcaption
블로그 글을 작성할 때, 이미지 밑에 설명을 달고 싶을 때가 종종 있다.  
그럴 경우 `<p>`나 `<div>` 태그를 사용하지 말고 `<figure>` 태그를 사용해보자.
```HTML
<figure>
  <img src="code-screenshot.jpg" alt="VS Code 실행 화면">
  <figcaption>그림 1. 비주얼 스튜디오 코드 실행 모습</figcaption>
</figure>
```
이런 식으로 작성하면 SEO는 이미지와 설명글이 서로 강력하게 연관되어 있다는 걸 이해하게 된다.

이번 학습을 통해서 `alt` 속성의 중요성을 다시끔 깨닫게 되었다.. 사실 나역시 자주 빼먹는 게 습관화된 개발자 중 하나인데
SEO와 내 페이지를 방문할 시각장애인 분들을 위해서라도 앞으로 `alt` 속성을 알차게 채우는 습관을 들여야겠다!

<div class="flex items-center gap-2">
    <svg class="w-10 h-10 text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" fill="currentColor"/> </svg>
    <span class="font-bold text-2xl">
        글 요약
    </span>
</div>

1. `<img>`는 닫는 태그가 없다.
2. `alt` 속성은 선택이 아닌 필수이다. 이미지를 설명하는 구체적인 문장을 적자.
3. 장식용 이미지에 한해서는 `alt`를 비워놓자.(="")
4. `width`와 `height`로 이미지의 크기를 지정해 CLS 현상을 방지하자.