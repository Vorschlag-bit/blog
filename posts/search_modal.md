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
너무 거대하다고 생각이 들면 추천한다고 하니 나에게 완전 fit한 선택이었다.

## 구현 과정
Fuse.js의 인덱싱 재료로 사용될 데이터들을 빌드 타임에 모든 글,제목,카테고리를 긁어서 하나의 거대한 <b>JSON 배열</b>로 만든다.

클라이언트는 이 JSON을 받아서 Fuse.js 라이브러리에게 던지고, 사용자가 단어를 검색하면 Fuse.js가 점수 계산 이론(<a href="https://en.wikipedia.org/wiki/Bitap_algorithm" class="plink">
  bitap 알고리즘
</a>)을 바탕으로 유사한 글을 찾아준다.

Bitap 알고리즘은, 쉽게 말해 <b>대충 비슷한 거 찾아보는 알고리즘</b>이라고 생각하면 될 거 같다.  
정확히 일치하지 않아도(오타 허용) 찾을 수 있고, 패턴의 길이, 위치, 거리를 점수로 계산해 0(완벽 일치) - 1(완전 불일치) 사이의 유사도 값으로 매긴다.

<code>Fuse</code>라는 객체를 먼저 생성해서 첫 번째 인자로는 인덱싱할 값(배열)을 넘기고, 두 번째 인자로는 인덱싱의 옵션들을 객체 형식으로 설정할 수 있다.
<table>
    <caption>주요 옵션 몇 가지</caption>
    <thead>
        <tr>
            <th>옵션명</th>
            <th>설명</th>
            <th>추천값</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>keys</b></td>
            <td>검색할 필드명. 가중치(<code>weight</code>)를 줄 수 있음.</td>
            <td>[<code>title</code>,<code>content</code>]</td>
        </tr>
        <tr>
            <td><b>threshold</b></td>
            <td>얼마나 관대할 것인가. <br> 0.0: 완벽 일치만 허용 <br> 1.0: 완전 불일치도 허용</td>
            <td><b>0.3 ~ 0.4</b>가 일반적</td>
        </tr>
        <tr>
            <td><b>includeScore</b></td>
            <td>결과에 유사도 점수(0-1)를 포함할지 여부.</td>
            <td>true</td>
        </tr>
        <tr>
            <td><b>minMatchCharLength</b></td>
            <td>최소 몇 글자 이상 일치해야 검색할지.</td>
            <td>2(한 글자는 너무 일치가 많음)</td>
        </tr>
        <tr>
            <td><b>ignoreLocation</b></td>
            <td>단어가 문장의 어디든 있어도 상관없음.</td>
            <td>true(본문 검색 시 필수)</td>
        </tr>
    </tbody>
</table>

### 1. 인덱스 데이터 만들기
먼저 JSON 배열을 만드는 작업부터 했다. 이를 위해선 내 블로그 md에 있는 내용을 긁어다가 만들 텐데, 중요한 건 <b>마크다운 문법</b>(**나,## 같은) 기호와 HTML 태그들은 검색에 있어서 방해만 될 뿐이니 정규표현식으로 제거하고 순수한 텍스트만 남기는 함수를 만들었다.

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
export function getJSONArrayForSearch() {
    const fileNames = fs.readdirSync(postsDirectory)
    const data = fileNames.map((file) => {
    const fullPath = path.join(postsDirectory, file)
    const content = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(content)
    
    return {
        id: file.replace(/\.md$/, ''),
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
검색 페이지가 따로 나오는 것도 괜찮을 거라고 생각했다, 여러 필터들을 적용시키면 좋을 거라고 생각했기 때문이다.

하지만 현재 내 블로그의 글 수가 그 정도로 대규모도 아니기 때문에 당장은 굳이 검색 화면까진 필요없을 거 같았다.

그래서 검색 시 즉각적으로 리스트가 주르륵 나오도록 구현하기로 했다. 이게 UX적인 면에서 괜찮을 거라고 생각했다.  

우선 검색 엔진 자체인 `Fuse` 객체와 검색 결과를 상태로 보관해야 했었다.  
단순히 `useState`를 사용한다면 Fuse 객체라는 비용이 비싼 객체를 화면이 새로 그려질 때마다 생성해야 할 것이다.

따라서 이전 값을 기억해두고, 의존성 배열의 값이 바뀌지 않으면 그대로 사용하는 `useMemo`를 사용하기로 결정했다.

검색 모달 자체는 누가봐도 클라이언트 컴포넌트이지만, 서버로부터 원본 데이터를 받아야하기 때문에 `layout.js`로부터 props로 
`posts`를 전달받는다.
검색 엔진 자체인 `Fuse` 객체는 블로그 글을 의존성 배열에 넣어서 블로그 글이 바뀔 때마다 새로운 객체를 생성하게 했다.
```javascript
// posts는 props로 layout.js로부터 받음
const fuse = useMemo(() => {
    return new Fuse(posts, {
        keys: [
            { name: 'title', weight: 1 },
            { name: 'category', weight: 0.5 },
            { name: 'content', weight: 0.3 },
        ]
    })
},[posts])
```
검색 가능한 인덱스로 <b>제목, 카테고리, 본문 내용</b>. 이렇게 3가지를 두었고 제목에는 완전 일치를 위해 가중치를 1, 카테고리에는 적당한 일치를 위해 0.5, 본문에는 그보다 좀 더 작은 0.3을 두었다.

검색 결과인 `results`은 검색 엔진 자체(`Fuse`)와 검색어(`query`)에 영향을 받으므로 아래와 같이 작성했다.
```javascript
const results = useMemo(() => {
    // 검색어 없으면 빈 배열
    if (!query) return [];
    return fuse.search(query).map(result => result.item)
},[query,fuse])
```

참고로 `fuse.search()`의 return값인 `FuseResult<Any> []`의 구조는 아래 사진과 같다.

<figure>
    <img src="/images/fuse_r.png" alt="FuseResult<Any> []의 구조 모습">
    <figcaption>item을 통해서 접근이 가능하다. <code>score</code>는 유사도 점수, <code>refIndex</code>는 원본 배열에서 해당 값의 인덱스이다.</figcaption>
</figure>

그 후엔 검색 결과가 있을 때와 없을 때로의 HTML 구조를 작성했다.
```javascript
return (
    <div>
        <input
            type="search"
            placeholder="검색어를 입력하세요."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
        <ul>
            {results.length === 0 && query !== '' ? (
                {/* 아무것도 결과 안 나옴 */}
                <li>검색 결과가 없습니다.</li>
            ) : (
                {/* 결고 존재 함 */}
                results.map((post) => (
                    {/* 검색 결과 리스트, 누르면 이동할 수 있도록 <Link> */}
                    <li>
                        <Link href={`/posts/${post.id}`} >
                    </li>
                ))
            )}
        </ul>
    </div>
)
```

<figure>
    <img  src="/images/search_t1.png" alt="임시 완성된 검색창 모달 모습">
    <figcaption>임시로 완성된 모습.</figcaption>
</figure>

CSS만 수정하면 끝나는 듯했으나 뭔가 아쉬운 기능이 있었다.

### 3. '외부 클릭 시 닫기' 만들기
일반적인 검색창의 경우 연관 검색어들이 주르륵 나온 상태에서 외부를 클릭할 경우 다 사라지는 기능(이하 외부 클릭 시 닫기)가 존재한다.  
현재 내 검색은 해당 기능이 없어서 반드시 검색어를 지워야만 하는 구조라 매우 불편했다.

이 기능은 사실 프론트 엔드의 개발 단골 손님급 기능이라 익혀두면 좋을 거 같다.  
이벤트 리스너(`eventListener`)와 영역 확인(`contains`)으로 쉽게 구현이 가능하다.

원리는 간단하다.  
1. 브라우저 전체(document)에 '클릭 감지기' eventListener를 달아놓는다.  
2. 사용자가 클릭한 요소(`event.target`)가 내 검색창(`ref`) 내부에 존재하는지, 밖에 있는지 검사한다.  
3. 밖에 있다면 해당 요소를 닫으면 된다.

이 기능을 위해서 결과 리스트가 열린 상태인지 아닌지를 판단할 `isOpen`이라는 `useState`와 내 검색 모달 컴포넌트를 `useRef`에 등록하여
포함여부를 판단하는 데에 사용하기로 했다. 또한 이는 돔을 직접 조작하는 기능이므로 `useRef`의 정말 대표적인 활용이지 않나 싶다.

또한 이 기능을 구현하면서 `onChange`와 `onFocus` 속성을 위한 함수들, input 박스 내에 입력되는 값에 따라 그리고 input 박스가
클릭되거나 탭됨에 따라 리스트를 보여주기 위한 핸들러 함수를 추가했다.

```javascript
const [isOpen, setIsOpen] = useState(false)
const currentRef = useRef(null)

// 중간 로직...

// onChange 핸들러 함수
const handleOnChange = (e) => {
    setQuery(e.target.value)

    // 글자가 있으면 IsOpen = true
    if (e.target.value.length > 0) setIsOpen(true)
    // 글자 없으면 false
    else setIsOpen(false)
}

// onFocus 핸들러 함수
const handleOnFocus = () => {
    // 검색 결과가 없더라도 뭔갈 입력했다면 보여주기 가능하므로
    if (query.length > 0) setIsOpen(true)
}
```
또한 외부 클릭에 대한 이벤트 핸들러 로직을 `useEffect`를 사용해 구현했다.
```javascript
useEffect(() => {
    function handleClickOutSide(event) {
        // ref 존재하고, ref.current가 event.target을 포함하고 있지 않다면(= 다른 곳 클릭) isOpen = false
        if (currentRef.current && !currentRef.current.contains(event.target)) setIsOpen(false)
    }

    // document의 mousedown에 이벤트 부착
    document.addEventListener('mousedown', handleClickOutSide)

    // CleanUp
    return () => document.removeEventListener('mousedown', handleClickOutSide)
},[])

return (
    <div>
        <input
            type="search"
            placeholder="검색어를 입력하세요."
            className="css"
            onChange={handleOnChange} // 핸들러 교체
            onFocus={handleOnFocus}   // 포커스 핸들러 추가
            value={query}
            size={24}
            maxLength={24}
        />
        {/* 중간 생략 */}
    </div>
)
```

## 결과
<figure>
    <img src="/images/search_t2.png" alt="최종 완성된 검색 모달 UI(라이트 모드)">
    <figcaption>최종적으로 완성된 모습이다. (라이트 모드)</figcaption>
</figure>

<figure>
    <img src="/images/search_t3.png" alt="최종 완성된 검색 모달 UI(다크 모드)">
    <figcaption>content에 대한 가중치 덕분에 Ract라고 검색해도 React에 대한 결과가 나온다. (다크 모드)</figcaption>
</figure>

검색 결과는 유사도를 기준으로 내림차순(0일수록 일치) 제공되기 때문에 그대로 return해서 사용해도 된다.
<figure>
    <img src="/images/fuse_r2.png" alt="Fuse 결과 유사도가 내림차순으로 정렬된 모습">
    <figcaption>맨 처음이 가장 낮고 그 다음으로 증가하는 내림차순임을 볼 수 있다.</figcaption>
</figure>

이렇게 검색 모달까지 구현했다.. 이젠 정말 추가 가능한 UI보다 이미 추가한 UI 개수가 더 많다고 생각한다.
블로그가 많이 풍성해지는 걸 보면 마음이 그렇게 뿌듯하고 편안할 수가 없다!

어쩌면 이제 추가 기능을 덧붙이는 것보다 기존 기능에 대한 고도화와 유지보수를 해야하는 단계로 넘어가고 있는 걸까?

하지만 아직 UI에 대한 아이디어와 욕심이 끝나질 않았기 때문에 최대한 개발할 수 있는 데까지 해보고 싶다!