---
title: "Fuse.js로 검색 모달 UI 만들기"
date: "2025-12-25 19:25:05"
category: "개발"
description: "Fuse.js를 활용한 검색 UI를 만들어보자."
---

## 서론: 아 그거 뭐더라
블로그 글이 70개를 넘어가면서 슬슬 내가 작성한 글들에 대한 기억이 흐릿하거나 뒤죽박죽 섞이기 시작했다.  

어차피 블로그 기능 좀 거진 필수인 <b>검색</b> 기능은 언젠가는 만들어봐야지라고 고민하던 차... 마침내 때가
온 거라고 생각했다.  
근데 검색 기능을 구현하기에 앞서 두려움이 있었다.
### 검색 알고리즘.. 내가 짜야 하나?
검색 기능을 개발하려면 당연히 가장 고민되는 부분이 아닐까 싶다.  
내가 지금까지 구현했던 검색 기능은 elasticsearch와 같은 DB에서 자체적으로 인덱싱(역인덱싱)한 결과를 프론트 화면에
뿌려주는 게 전부였기 때문에 검색을 현재 내 블로그의 구조인 정적 랜더링 같은 상황에선 이런 DB의 인덱싱 기능을 사용하지 못 한다.

따라서 검색 알고리즘을 내가 직접 구현해야 하나라는 무서운 고민이 있었다.

### 해결책: Fuse.js
의외로 해결책은 간단했다. <a href="https://www.fusejs.io/" class="plink">
 Fuse.js
</a>라는 라이브러리를 사용하면 나 같은 정적 페이지 랜딩 사이트(별도의 백엔드가 없는)에서 검색 기능을 쉽게 구현할 수 있다.

퍼지 검색(근사 문자열 매칭)이란 주어진 패턴과 정확히 일치하는 문자열이 아니라 <b>대략적으로 일치하는</b> 문자열을 찾는 기술이다.

별도의 백엔드의 도움없이 검색 기능을 구현하고 싶거나 라이브러리 자체가 제공해주는 단순함과 성능 자체만으로도 충분히 매력적이다.  

또 공식 사이트의 추천 사례로 단순한 검색처리를 위해 백엔드 도움없이 ElasticSearch나 Algolia 같은 서비스를 사용해도 되지만 자기 서비스 규모에 비해
너무 거대하다고 생각이 들 때라고 하니 나에게 완전 fit한 선택이었다.

## 구현 과정
Fuse.js는 빌드 타임에 모든 글,제목,카테고리를 긁어서 하나의 거대한 <b>JSON 배열</b>을 만든다.  
클라이언트는 이 JSON을 받아서 Fuse.js 라이브러리에게 던지고, 사용자가 단어를 검색하면 Fuse.js가 점수 계산 이론(<a href="https://en.wikipedia.org/wiki/Bitap_algorithm" class="plink">
  bitap 알고리즘
</a>)을 바탕으로 유사한 글을 찾아준다.

### 1. 인덱스 데이터 만들기
먼저 JSON 배열을 만드는 작업부터 했다. 이를 위해선 내 블로그 md에 있는 내용을 긁어다가 만들 텐데, 중요한 건 <b>마크다운 문법</b>(**나,## 같은) 기호는 
검색에 있어서 방해만 될 뿐이니 정규표현식으로 제거하고 순수한 텍스트만 남기는 함수를 만들었다.

그 후에는 아래와 같이 파일에 대한 메타데이터를 JSON 객체로 만든 후 배열로 return 시키는 함수를 구현했다.
```javascript
function stripMarkdown(content) {
    return content
        .replace(/#+\s/g, '') // header 제거
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // 볼드 제거
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 제거
        .replace(/`{3}[\s\S]*?`{3}/g, '') // 코드 블록 제거
        .replace(/\n/g, '') // 줄바꿈 공백으로
}
```

```javascript
function getJSONArrayForSearch() {
    const fileNames = fs.readdirSync(postsDirectory)
    const data = fileNames.map((file) => {
    const fullPath = path.join(postsDirectory, file)
    const content = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(content)
    
    return {
        id: file.replace(/\.mds/, ''),
        title: matterResult.data.title,
        category: matterResult.data.category,
        description: matterResult.data.description,
        content: stripMarkdown(matterResult.content),
        date: matterResult.data.date
    };
    })

    return data;
}
```

### 2. 검색 모달 구현

