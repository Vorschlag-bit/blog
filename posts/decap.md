---
title: "Vscode markdown preview에 CSS 입히기"
date: "2026-01-14 23:07:48"
category: "개발"
description: "Vscode의 마크다운 글 미리보기에 CSS를 입혀보자"
---

## 서론: 좀 아쉬워요

마크다운으로 글을 많이 작성하다보니 이젠 일반 에디터로 글을 작성하는 게 오히려 불편하다.

특히 Vscode 같은 IDE 에디터 기능(드래그한 문자를 쉽게 감싸기나 나만의 Snippet 등)들이 워낙 강력하다보니까 Vscode로 글을 작성하는 게 제일 편하다.

하지만 유일한 단점이 있다면 Vscode는 CSS가 반영되지 않는다는 점이다.

내 블로그 글은 <a class="plink" href="https://quiple.dev/galmuri">
  galmuri
</a>폰트가 기본 폰트인데, 마크다운 preview로 보면 그냥 일반 글꼴이 나와서 좀 아쉬울 때가 많았다.

이럴 땐 vscode의 extensions인 <b>Markdown Preview Enhanced</b>를 사용하면 된다.

## 적용 방법


<figure>
    <img src="/images/md_en.png" alt="Yiyi Wang의 extension 사진" />
    <figcaption>Yiyi Wang의 'Markdown Preview Enhanced'</figcaption>
</figure>

위의 extension을 설치를 해보자.

그 후에 수정하고 있는 마크다운 파일을 연 상태에서 `ctrl + k v`를 입력하면(혹은 그냥 마우스 우클릭하고 Markdown Enhanced Preview: Open Preview to the Side) 우측 화면에 아래와 같이 extension 기반의 마크다운 preview가 나온다.

<figure>
    <img src="/images/md_en1.png" alt="Yiyi Wang의 extension으로 열린 preview 사진" />
    <figcaption>일반 마크다운 preview창의 아이콘과 다르다.</figcaption>
</figure>

이 상태에서 `F1`키나 `Crtl` + `Shift` + `P` 키를 누르고, markdown이라고 치면 아래 사진과 같이 Markdown Enhanced Preview에 대한 다양한 설정 옵션들이 나온다.

<figure>
    <img src="/images/md_en2.png" alt="다양한 설정 옵션들 사진" />
    <figcaption>설정 옵션이 정말 다양하다.</figcaption>
</figure>

중요하게 볼 건 2가지이다.  
1. `Markdown Enhanced Preview: Customize CSS (global)`: 모든 마크다운 글에 대한 CSS를 설정할 수 있는 파일을 연다. 마크다운 파일을 위한 global.css를 만드는 거라고 생각하면 된다.
2. `Markdown Enhanced Preview: Customize CSS (workspace)`: 현재 프로젝트의 마크다운 글에만 적용할 CSS를 설정한다. 클래스 연산자정도로 생각하면 될 듯?

나는 굳이 전역적으로 설정할 필요까진 없어서 workspace에만 설정했다.

이걸 누르면 `style.less`라는 파일이 열린다.

파일에는 `markdown-preview.markdown-preview` 라는 클래스 연산자 css 태그만 덩그러니 있는데 여기에 CSS 문법으로 내가 적용하고 싶은 CSS와 특정 태그에 대한 스타일을 지정하면 된다.

```CSS
/* 1. 폰트 불러오기 (최상단에 위치) */
@import url('https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css');

.markdown-preview.markdown-preview {
  /* 2. 전체 폰트 및 기본 설정 */
  font-family: 'Galmuri11', sans-serif !important;
  padding: 2rem;
  color: #1a1a1a;
  line-height: 1.6;
  

  /* 3. 헤딩 태그 스타일 */
  h1, h2, h3, h4 {
    font-weight: bold;
    color: #000;
    margin-top: 2em;
    margin-bottom: 0.5em;
    padding-bottom: 0.3em;
  }

  h1 { font-size: 2.25em; border-bottom-style: double; border-bottom-width: 4px; }
  h2 { font-size: 1.75em; }
  h3 { font-size: 1.5em; border-bottom-style: dashed; }
  h4 { font-size: 1.25em; border: none; color: #555; }

  /* 4. 이미지 레트로 스타일 */
  img {
    display: block;
    max-width: 80% !important; 
    height: auto;
    
    /* 레트로 테두리 & 그림자 */
    border: 2px solid currentColor; 
    box-shadow: 4px 4px 0px 0px currentColor;
  }

  /* 5. 인용구 (Blockquote) */
  blockquote {
    border-left: 4px solid currentColor;
    background-color: rgba(0,0,0,0.05);
    padding: 1rem;
    font-style: italic;
    margin: 1rem 0;
    color: inherit;
  }

  /* 6. 다크모드 대응 */
  &[data-theme="dark"] {
    color: #e5e5e5;
    
    img {
        box-shadow: 4px 4px 0px 0px rgba(255, 255, 255, 0.5);
        color: rgba(255, 255, 255, 0.8);
    }
  }
}
```

나 같은 경우에 위와 같이 설정했고, 글꼴과 이미지에 대한 설정정도만 했다.

<figure>
    <img src="/images/md_en3.png" alt="css가 적용된 md 파일 사진" />
    <figcaption>대강 요런 식으로 보인다.</figcaption>
</figure>

아쉽게도 사진 같은 경우에는 외부 이미지가 아닌 이상 엑박이 나올 수밖에 없다.

하지만 `Symlink`를 사용해서 루트에 가짜 `/images` 폴더를 만들고 실제 내 사진이 저장된 디렉토리(`/public/images`)와 연결시켜주면 된다.

윈도우 기준 프로젝트의 루트 디렉토리에서 PowerShell에 `cmd /c mklink /J images public\images`라고 입력하면 루트 디렉토리에 `/images` 라는 폴더가 생기면서 아래의 프롬프트가 나온다.

```shell
images <<===>> public\images에 대한 교차점을 만들었습니다.
```

<b>단 이 가짜 폴더는 Github에 올라가면 안 되니 반드시 `.gitignore`에 등록을 해두자!</b>

preview를 다시 켜보면 아래 사진과 같이 사진의 비율과 글의 비율까지 확인할 수 있는 환경이 조성된다.

<figure>
    <img src="/images/md_en4.png" alt="사진까지 볼 수 있는 preview 화면" />
    <figcaption>이젠 사진까지 보여서 정말 그럴 듯하다.</figcaption>
</figure>

