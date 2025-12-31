---
title: "실시간 인기글 UI를 만들어보자 (사실 실시간은 아님)"
date: "2025-12-31 00:04:43"
category: "개발"
description: "블로그에서 사용자 경험을 긍정적으로 만들어줄 실시간 인기글 UI를 만들어보자."
---

## 서론: 아 뭐하지
이제 새로운 블로그 UI 개발의 거의 끝이 아닐까 싶었다. 공간적으로도 더이상 블로그에 넣을 공간이 얼마 남지 않거니와
웬만한 블로그에 있는 기능들을 거진 다 개발했기 때문이다.

하지만 마지막 UI로 기술블로그로써 사용자들에게 최대한 유용할 수 있는 UI를 만드는 것이 내 블로그 설계의 철학이기 떄문에
기술 블로그에서 가장 인기있는 글을 보고 싶어하는 건 어쩌면 당연한 거라고 생각을 해서 실시간 인기글 UI를 만들어 보기로
결정했다.

티스토리 같은 블로그를 보면 인기글을 보여주는데, 이게 사용하는 입장에서 상당히 유용한 정보들을 제공한다. 마치 특정 유튜버
채널의 영상을 인기순으로 정렬한 거 같은 효과를 쉽게 얻을 수 있기 때문에 좋은 선택이라고 생각했다.

---

## 설계하기
<b>인기글</b>이라는 속성을 듣고서 사실 이전에 <a href="https://vorschlag-blog.vercel.app/posts/redis" class="plink">
  방문자 UI 만들기
</a>에서 redis가 저장할 수 있는 데이터 타입과 그에 따른 명령어들을 공부할 때 <b>Sorted Set(ZSet)</b>이라는 자료형이 있다는 걸 배웠다.

Sorted Set은 Set과 같지만 저장하는 데이터들에 <b>점수</b>를 부여하고, 이 객체들은 <b>점수를 기준으로 자동 정렬되는 특성</b>을 갖고 있다.
따라서 랭킹과 관련된 기능을 만들 때 아주 찰떡인 데이터 타입이기도 하고, 현재 사용 중인 redis가 이미 존재하니까 새로운 환경 변수 설정이나
DB 설정을 따로 할 필요없어서 편안하게 기능 구현에만 집중할 수도 있었다.

Sorted Set에는 3가지의 명령어가 존재한다.  

1. `ZADD`: 데이터와 점수를 추가
2. `ZRANGE`: 순위별 조회  
3. `ZRANK`: 내 순위 확인 (조회)  

`ZADD`와 `ZRANGE`만 사용해도 충분히 내가 원하는 기능을 구현할 수 있을 것 같았다.  
`ZADD`와 `ZRANGE`의 리턴값과 사용법을 아직 알지 못 해서 사용법과 반환값을 가볍게 표로 정리해보았다.

<table>
    <caption>Redis Sorted Set 명령어 정리</caption>
    <thead>
        <tr>
            <th class="font-bold">명령어</th>
            <th class="font-bold">설명 (Description)</th>
            <th class="font-bold">블로그 적용 사례</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="font-mono text-blue-600">ZADD</td>
            <td class="">
                멤버(Member)와 점수(Score)를 <b>설정(Set)</b>한다.<br/>
                이미 있으면 점수를 덮어쓴다.
            </td>
            <td class="">
                초기 데이터 세팅<br/>
                <code>ZADD popular_posts 0 "post-1"</code>
            </td>
        </tr>
        <tr>
            <td class="font-mono text-blue-600">ZINCRBY</td>
            <td class="">
                멤버의 점수를 지정한 만큼 <b>증가(Increment)</b>시킨다.<br/>
                멤버가 없으면 새로 만들고 0에서 시작한다.
            </td>
            <td class="">
                <b>조회수 카운팅</b><br/>
                <code>ZINCRBY popular_posts 1 "post-1"</code>
            </td>
        </tr>
        <tr>
            <td class="font-mono text-blue-600">ZRANGE<br/>(ZREVRANGE)</td>
            <td class="">
                점수 순서대로 멤버를 가져온다.<br/>
                기본은 오름차순, <b>REV</b> 옵션은 내림차순(큰 게 1등).
            </td>
            <td class="">
                <b>인기글 랭킹 조회</b><br/>
                <code>ZRANGE popular_posts 0 4 REV</code>
            </td>
        </tr>
    </tbody>
</table>

내게 필요한 명령어는 이 중 `ZINCRBY`와 `ZRANGE`(ZREVRANGE)였다.  
참고로 Sorted Set에 객체를 넣더라도 redis는 해당 객체를 통째로 문자열로 만든 후 해당 문자열에 대한 점수를 매긴다.
나는 블로그 글을 `[id]`라는 endPoint로 구분하고 있기 때문에 이 endPoint 문자열을 그대로 점수 대상으로 사용하기로 결정했다.

개발해야 할 부분은 방문자 UI와 마찬가지로 2가지.  
1. `PostRank.js`: 사용자에게 보여줄 UI자체이자, `node.js`에게 proxy 요청의 역할까지 수행하는 클라이언트 컴포넌트  
2. `api/post_rank/route.js`: Redis로부터 데이터를 `POST` method로 조회와 증가를 원자적으로 수행하고, 데이터 리스트를 캐싱까지 수행하는 서버 컴포넌트

---

## 구현하기

### 1. PostRank.js 구현
먼저 `PostRank.js`부터 구현을 해보았다. 데이터를 가져오기 위해 loading 중인지 아닌지를 판단할 flag 상태인 `isLoading`과
조회 실패 시 에러메세지를 담을 `errMsg` 그리고 fetch로 가져온 데이터를 보관할 `top5Rank`까지 3가지를 모두 <b>useState</b>로 선언했다.

```javascript
// 상태 훅들
const [isLoading, setIsLoading] = useState(false)
const [errMsg, setErrMsg] = useState('')
const [top5Rank, setTop5Rank] = useState([])
```

그 후엔 node.js에게 proxy 요청을 하는 fetch 함수를 구현했다.
```javascript
const fetchRank = async (id) => {
    setIsLoading(true)
    setErrMsg('')
    try {
        const res = await fetch(`/api/post_rank`, 
            { method: 'POST', 
                // body는 반드시 문자열
                body: JSON.stringify({ id: id }),
                headers: { 'Content-Type': 'application/json' }
            })
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw Error(errData.error)
        }
        const data = await res.json()
        // console.log(`fetched data: `, data);
        
        setTop5Rank(data)
    } catch (err) {
        console.error(`인기글 DB를 조회하지 못 했습니다.`);
        setErrMsg('인기글 DB 조회 실패')
    } finally {
        setIsLoading(false)
    }
}
```
`fetch()`의 <b>POST</b>함수를 통해 `requestBody`를 보내려면 위와 같이 반드시 문자열로 넣어줘야 하기 떄문에 `JSON.stringify`를 통해 문자열로
넣어주자. 또한 json 형식으로 body를 보내는 것이므로, header에 <b>application/json</b>을 반드시 명시해줘야 한다.

`useEffect()`로 현재 endPoint가 바뀔 때마다 요청을 해야 했으므로 의존성 배열에 `currentId`를 넣은 `useEffect()`를 구현했다.
```javascript
useEffect(() => {
    fetchRank(currentId)
},[currentId])
```
이렇게까지 작성을 하고 나서 생각을 다시 해보았다. 사실 저 부분까지 작성할 당시까지만 해도 일단 `currentId`는 props로 어떻게든
받을 수 있지 않을까? 하고 대충 가정한 뒤에 개발을 하던 중이었어서 실제로 이 컴포넌트가 어떻게 `currentId`를 받을 수 있을지 제대로
고민해보았다.

`[id]`는 `page.js`에서 판별하여 처음 생성되기 때문에 만약 `page.js`의 자식 컴포넌트라면 정말 손쉽게 props를 통해 전달받을 수 있을 것이다.  
허나 이 컴포넌트는 명확하게 사이드 바(`<aside>`)에 위치하기 때문에 `layout.js`에 배치해야 한다. 따라서 `page.js`보다 부모 컴포넌트인
`layout.js`가 현재 id를 아는 것은 불가능했다.

따라서 `useParams`를 사용해 클라이언트 URL을 직접 뽑아다가 사용했다.
```javascript
const params = useParams();
const currentId = params.id || '/';
```
`currentId`는 또한 `/`(메인 페이지)의 경우에는 인기글에 포함되선 안 되기 때문에 `route.js`에서 증가로직의 예외 핸들링을 해줘야 했고,
`/`는 실제로 `params`가 `undefined`로 나오기 때문에 위와 같이 없을 경우에는 그냥 루트 디렉토리를 가리키도록 했다.

### 2. route.js 구현
이후에는 실제 데이터 요청이 이뤄지는 `route.js`를 구현했다.
```javascript
export async function POST(request) {
    try {        
        // Sorted Set에 넣을 id(str)
        const { id } = await request.json()        
    
        if (!id) return NextResponse.json({ error: 'ID is required' },{ status: '400' })
        // zincreby로 조회 수 1 증가, await 안 써서 promise 필요 없음
        // rootPath면 continue
        if (id !== '/') {
            console.log(`루트 디렉토리 아니라서 zincrby 실행`);
            redis.zincrby('popular_posts',1,id)
        }
    
        // get은 캐시(unstable_cache)
        const res = await getRank()
        
        return NextResponse.json(res);
    } catch (err) {
        console.error(`post redis failed`, err);
        throw Error(err.error);
    }
}
```
앞서 `id`를 json으로 넣었기 때문에 `json()` 함수로 id를 구조 분해 할당을 받고 예외 핸들링으로 `/`가 아니라면 증가 후 조회,
`/`라면 그냥 조회만 하는 식으로 구현했다.

다만 조회 역시 매번 실시간으로 조회하는 것이 아니라 방문자 api와 마찬가지로 Next.js의 `unstable_cache`를 활용해 1시간 동안의 캐싱을 유지했다.
```javascript
// [id] 기반으로 빠르게 찾기 위한 Map
const postMap = new Map(dateSortedAllPosts.map((post) => [post.id, post]))

const getRank = unstable_cache(async() => {
        // zrange 사용법, key = 말 그대로 데이터 저장을 위한 hash값으로 사용될 key, 점수 내림차순 상위 5개를 조회
        console.log(`unstable cache없어서 redis에 요청함!`);
        
        const topIds = await redis.zrange('popular_posts',0,4, { rev: true });

        if (topIds.length === 0) return [];

        const rankingData = topIds.map(id => {
            const post = postMap.get(id)
            // 없을 경우엔 null
            if (!post) return null;

            return {
                id: post.id,
                title: post.title,
                date: post.date
            }
        }).filter(item => item !== null); // null 아닌 데이터만 filter로 추출
        return rankingData;
    },
    ['post_ranking'],
    // 캐시 1시간
    { revalidate: 3600 }
);
```
이 개발을 진행하면서 내 블로그 구조는 완전한 정적 페이지 구성이라 빌드 시점에서 모든 글들이 준비되고 바뀔 가능성이
아예 없으므로 전역 변수로 `dateSortedAllPosts`를 선언해 서버 컴포넌트에 한해서 편하게 사용할 수 있도록 리팩토링을 진행했다.

이 덕분에 이 `route.js`에서도 이 날짜별 내림차순 배열을 `Map`으로 변환하여 상위 5개의 포스트를 `id` 기반으로 조회할 때
$O(N)$이 아닌 $O(1)$이 되도록 최적화를 할 수 있었다.

정말 1시간의 캐시가 유지되는지 위해 확인용 로그를 찍어보았고, 확인결과 정말 1시간의 cache가 유지되었다.

<figure>
  <img src="/images/sorted_set.png" alt="[id] 기반으로 key와 score가 잘 등록된 모습">
  <figcaption>id 기반으로 key가 등록된 모습</figcaption>

  <img src="/images/rank_cc.png" alt="새로고침을 해도 unstable_cache로 조회 cmd는 안 날라가는 모습">
  <figcaption>unstable cache가 동작하는 모습</figcaption>
</figure>

---

## 결과
### 1. 데이터 요청 성공 시 UI
삼항연산자로 길이 1 이상의 배열을 가져왔을 경우에 보여주는 UI이다.
<figure>
  <img src="/images/rank_l.png" alt="인기글 내림차순으로 5개를 잘 가져온 모습(라이트 모드)">
  <figcaption>인기글 내림차순으로 5개를 잘 가져왔다. (라이트 모드)</figcaption>

  <img src="/images/rank_dark.png" alt="인기글 내림차순으로 5개를 잘 가져온 모습(다크모드)">
  <figcaption>인기글 내림차순으로 5개를 잘 가져왔다. (다크 모드)</figcaption>
</figure>

### 2. 데이터 요청 실패 시 UI
삼항연산자로 빈 배열을 가져왔을 경우 보여주는 UI이다.
<figure>
  <img src="/images/rank_f1.png" alt="인기글 조회 실패 시 모습(라이트 모드)">
  <figcaption>인기글 조회 실패 시 모습(라이트 모드)</figcaption>

  <img src="/images/rank_f2.png" alt="인기글 조회 실패 시 모습(다크모드)">
  <figcaption>인기글 조회 실패 시 모습(다크모드)</figcaption>
</figure>

## 마무리
이젠 UI로서 내가 만들고 싶은 걸 다 만들었다. 짧은? 기간에 이렇게 다양한 기능들을 직접 구현하면서
너무 즐겁고 행복했다. 학습과 실습을 동시에 진행하면서 실력이 정말 많이 늘었다.

이젠 학습을 더 열심히 하면서 내 블로그 기능에 대한 리팩토링을 작성하는 개발일지가 될 것 같다.  
하지만 또 뭔가 맘에 드는 기능을 발견한다면 곧바로 개발할 수 있다는 게 내가 이 블로그를 운영하는
가장 큰 유희거리라서 어떻게 될런지 확신할 수 없다..!

개발을 하면 할수록 새로운 학습거리들과 맞물리면서 또 배울 것이 생기고 리팩토링 거리가 생긴다는 점이
아직까진 너무 행복하다.

이번 인기글 UI는 배치상 어쩔 수 없이 글 상세 조회 시 나타나는 <b>리모컨</b> UI와 위치가 겹친다.  
이걸 보면서 리모컨을 <b>on/off</b> 기능을 만들어 봐야 겠다고 느꼈다.

이런 것들로 당장은 개발 일지를 채워나갈 것 같다.