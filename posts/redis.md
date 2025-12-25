---
title: "Vercel Upstash Redis를 활용해 방문자 지표 UI 만들기"
date: "2025-12-18 21:22:07"
category: "개발"
description: "Upstash Redis를 활용한 방문자 지표 UI를 만들어보자."
---

## 방문자 지표 UI 만들어보기
블로그에 있어서 중요한 UI 중 하나는 <b>방문자 UI</b>가 아닐까 싶다.  
방문자로 하여금 해당 블로그의 인기 지표를 아주 쉽게 보여주고, 운영하는 사람도 하루 방문자가 얼마나 되는지는 당연히 궁금하기 때문이다.  

내 블로그는 Vercel의 Serverless 환경에서 실행되고, Vercel 자체의 <b>Analytics</b>를 통한 <b>Analytics</b>탭에서 어떤 api가 얼만큼 요청됐는지, 어떤 OS와 어떤 플랫폼으로 방문했는지를 확인할 수 있기 때문에 운영자 입장에선 상세한 방문자의 통계 정보를 확인할 수 있다.

하지만 이를 확인하기 위해 매번 Vercel에 들어가서 Analytics 누르는 건 대단히 번거로운 일이다.  
따라서 사용자와 나 자신 모두에게 도움이 되는 <b>방문자 지표 UI</b>를 만들어보기로 했다!

방문자는 지금까지 방문한 총 방문자 수와 당일 방문자 수, 이렇게 2가지를 보여주는 간단한 구조로 생각을 했다.  
뭐 일주일 단위로 그래프를 그린 것도 보여줄 순 있겠지만, 내 블로그는 그렇게까지 인기있지도 않고 그건 나중에 고도화해도 될 UI다.

### 설계 및 구현
먼저 Vercel에서 <b>storage</b>에 들어가서 upstash for redis를 create하고, region에 한국이 없길래 그나마 가장 가까운
도쿄를 선택했다.

<figure>
    <img src="/images/redis1.png" alt="upstash Redis를 생성한 모습" />
    <figcaption>생성하고 나면 정말 편리하게 다양한 환경에서 설정법을 알려준다.</figcaption>
</figure>

<figure>
    <img src="/images/redis2.png" alt="자동으로 환경 변수를 등록해준 모습" />
    <figcaption><b>Connect Project</b>를 눌러서 사용할 프로젝트와 연결하면 환경변수로서 자동으로 넣어주기까지 한다.</figcaption>
</figure>

무료 티어에서는 <b>월 최대 50만 번의 cmd</b>가 가능하다. 보통 이런 방문자 수 같은 경우에는 매번 조회를 하지 않고
Caching을 적용한다. 나 역시 10분 간격의 Caching을 적용할 것이고, 한 달에 매우 넉넉할 것으로 예상했다.

물론 쓰기를 위한 CMD는 방문자 수만큼 증가할 테지만 불행인지 다행인지 내 블로그에 월 50만명이 방문하진 않을 것이다.

#### 데이터베이스 설계 (Redis Schema)
가장 먼저 고민한 것은 <b>Redis에 어떻게 데이터를 저장하고 조회할까</b>였다.  
단순히 숫자만 계속 더하면 새로고침을 할 때마다 카운트가 올라가서 조작된 통계가 보여질 것이기에 고유한 value가 필요했다.  
이 고유한 Value로 나는 <b>Ip + 날짜 조합</b>을 Key로 사용하기로 생각했다.

- 1. 전체 방문자 수(total)
    - <b>Key</b> : <code>blog-visit-total</code>
    - <b>Type</b> : <code>String</code> <b>(Long)</b>
    - <b>Logic</b> : 유니크한 방문일 경우 <code>INCR</code> (1증가)

- 2. 오늘 방문자 수(today)
    - <b>Key</b> : <code>blog-visit-date:2025-12-18</code> (날짜별로 키 생성)
    - <b>Type</b> : <code>Set</code> (집합)
    - <b>Value</b> : 사용자 Ip 주소들
    - <b>Logic</b> :
        - <code>SADD</code> 명령어를 사용. 중복 허용하지 않으므로 같은 Ip 무시.
        - 오늘 방문자 수는 <code>SCARD</code> 명령어를 통해서 가져옴.

#### API 설계 (`route.js` 흐름도)
클라이언트에 Redis가 직접 붙는 것은 보안상 위험하므로, 이번에도 API Route를 만들 예정이었다. (`/api/visit`)  
기능 명세로는 <b>사용자 지표는 조회(GET)과 수 증가(POST) 독립적으로 발생</b>하는 것으로 보인다.

하지만 이렇게 구현하는 것보다 `INCR`을 활용한 <b>통합 방식</b>이 가장 적절하다고 생각했다. 
2번의 네트워크 통신을 1번으로 줄일 수 있고, `POST`로 데이터를 추가시키는 찰나에 `GET`으로 조회하면 데이터 불일치가 발생할 수 있기 때문이다.

원자적인 API의 흐름은 대략 아래와 같다.

- 1. <b>Ip 추출</b> : 요청 헤더(<code>request.headers.get('x-forwarded-for')</code>)에서 사용자의 Ip를 추출한다.
- 2. <b>오늘 날짜 생성</b> : <code>YYYY-mm-dd</code>형식으로 키를 만들기 위한 날짜를 <code>Date</code> 객체를 통해서 가져올 예정. 
    물론 ISO 시간보정을 위해 <b>9시간</b>을 더한 시간을 바탕으로 계산할 것이다.
- 3. <b>Redis 호출 및 로직 실행</b> : Redis의 <code>SADD</code> 명령어로 당일의 Set 키에 Ip를 넣는다.
    <code>SADD</code>의 리턴값은 <b>새로 추가될 경우 1, 이미 있으면 0</b>이다.
- 4. <b>조건부 증가</b> : 만약 <code>SADD</code>의 값이 1이라면(처음 방문자) <code>INCR</code> 명령어로 전체 방문자 수를 1 증가시킨다.
- 5. <b>결과 반환</b> : total의 값과 당일의 <code>SCARD</code>(오늘 방문자 수)를 <b>JSON</b>으로 return한다.

#### Redis에 대해서, Redis 핵심 데이터 타입 & 명령어 정리
나는 이전에 <b>Spring</b>의 <code>RedisTemplate</code>를 통해서 Redis를 사용했었다.  
그 때는 주로 <code>OpsForValue().get/set</code>를 통해서 특정 문자열이 있는지 없는지에 판단하는 용도로만 사용했었다.

하지만 Redis는 훨씬 다양한 타입들을 지원하며, 심지어는 <b>"어떤 명령어를 쓰느냐에 따라서 데이터 타입이 자동으로 결정"</b>된다. (해당 Key가 없다면 알아서 해당 명령어에 맞는 타입 기본값으로 초기화)  
즉, 미리 <b>"이 키는 Set이다!"</b>라고 선언할 필요 없이, <b>그냥 Set 명령어만 날리면 알아서 Set</b>으로 만들어진다.  

<table>
    <caption>Redis 핵심 데이터 타입 & 명령어 정리</caption>
    <thead>
        <tr>
            <th><b>타입 (DataTyp)</b></th>
            <th><b>설명 (Description)</b></th>
            <th><b>주요 명령어 (Commands)</b></th>
            <th><b>사용 예시들 (Examples)</b></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>String</b><br>(문자열)</td>
            <td>가장 기본적인 1:1 구조.<br>문자열,숫자,바이너리 데이터 저장 가능</td>
            <td><code>SET</code>: 저장<br><code>GET</code>: 조회<br><code>INCR</code>: 1증가(숫자일 경우)<br><code>DECR</code>: 1감소</td>
            <td>단순 캐싱(Json 문자열)<br>방문자 수 카운터(<code>INCR</code>)<br>세션 저장소</td>
        </tr>
        <tr>
            <td><b>Set</b><br>(집합)</td>
            <td><b>순서가 없고, 중복 허용 안 하는</b> 자료 구조.<br>데이터 존재 여부 확인에 최적화</td>
            <td><code>SADD</code>: 데이터 추가(중복 시 무시)<br><code>SREM</code>: 데이터 삭제<br><code>SISMEMBER</code>: 존재 여부 확인(1/0)<br><code>SCARD</code>: 전체 개수 조회</td>
            <td><b>유니크 방문자 IP 저장</b><br>태그 관리<br>팔로우/좋아요 목록</td>
        </tr>
        <tr>
            <td><b>List</b><br>(리스트)</td>
            <td><b>순서가 있는</b> 문자열 목록. (Linked List)<br>앞,뒤에서 데이터를 넣거나 제거할 수 있음.</td>
            <td><code>LPUSH</code>/<code>RPUSH</code> : 맨 앞/뒤에 데이터 추가<br><code>LPOP</code>/<code>RPOP</code>:  맨 앞/뒤에서 꺼내기<br><code>LRANGE</code>: 범위 조회</td>
            <td>메세지 큐 (Queue)<br>최근 본 게시글 목록<br>타임라인 가능</td>
        </tr>
        <tr>
            <td><b>Hash</b><br>(해시)</td>
            <td><b>Field-Value</b> 쌍으로 이뤄진 구조.<br>하나의 Key 안에 여러 필드를 가짐(객체와 유사)</td>
            <td><code>HSET</code>: 필드 값 저장<br><code>HGET</code>: 특정 필드 조회<br><code>HGETALL</code>: 전체 필드 조회<br><code>HDEL</code>: 필드 삭제</td>
            <td>사용자 프로필(이름,나이,이메일)<br>상품 상세 정보<br>설정값 그룹 관리</td>
        </tr>
        <tr>
            <td><b>Sorted Set</b><br>(ZSet)</td>
            <td>Set과 같지만 <b>점수(Score)</b>를 가짐.<br>점수를 기준으로 자동 정렬됨.</td>
            <td><code>ZADD</code>: 데이터와 점수 추가<br><code>ZRANGE</code>: 순위별 조회<br><code>ZRANK</code>: 내 순위 확인</td>
            <td>실시간 랭킹/리더보드<br>인기 검색어 순위<br>우선순위 큐</td>
        </tr>
    </tbody>
</table>

<b>공통 명령어 (Key 관리)</b>  
모든 타입에 공통적으로 사용 가능한 명령어들

- 1. `DEL` : 키 삭제
- 2. `EXPIRE` : 키의 유효 시간 설정(sec 단위)
- 3. `TTL` : 남은 유효 시간 확인
- 3. `EXISTS` : 키 존재 여부 확인

#### Redis를 호출 API 로직 (캐싱 적용 이전)
```javascript
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// INCR을 통해서 값 return받을 걸 그대로 response로 보내줄 예정
export async function POST(request) {
    const DATE_PREFIX = "blog-visit-date"
    const TOTAL_PREFIX = "blog-visit-total"
    const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    })

    // 1. 유저 Ip 추출
    let Ip = request.headers.get('x-forwarded-for');
    if (Ip) {
        // 프록시를 거쳐서 여려 Ip가 있을 경우 맨 앞이 사용자의 것
        Ip = Ip.split(',')[0].trim();
    } else {
        console.log(`사용자 ip가 없음`);
        Ip = '127.0.0.1';
    }

    // 2. 오늘 날짜 계산
    const now = new Date();
    const kstAbs = now.getTime() + (9 * 60 * 60 * 1000);
    const today = new Date(kstAbs);
    const iso = today.toISOString().slice(0,10).replace(/-/g, "");

    const tomorrow = new Date(kstAbs);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    // 00:00:00
    tomorrow.setUTCHours(0,0,0,0)
    // redis ttl은 '초' 단위이므로, ms -> s
    const diff = Math.floor((tomorrow.getTime() - today.getTime()) / 1000)

    console.log("오늘 날짜(iso): ", iso);
    console.log("내일 날짜(iso): ", tomorrow.toISOString());
    console.log("오늘 남은 시간(sec): ", diff);
    

    // 3. 일일 방문자 수
    const dateKey = `${DATE_PREFIX}:${iso}`
    const isNew = await redis.sadd(dateKey, `${Ip}`);
    console.log(`새로운 일일 방문자인지 확인: ${isNew}`);

    // 4. 전체 방문자 수
    // 해당 일일 방문이 유니크하면 INCR
    if (isNew === 1) {
        const currentTotal = await redis.incr(TOTAL_PREFIX)
        // 오늘 날짜 키는 24시간까지 유효
        const diff = tomorrow.getTime() - today.getTime()
        await redis.expire(dateKey, diff)
        console.log(`새로운 전체 방문자인지 확인: ${currentTotal}`);
    }

    // 5. 현재 데이터 조회(pipeline 사용해서 한 번에 여러 명령어 보내기)
    const pipeline = redis.pipeline();
    pipeline.get(TOTAL_PREFIX)      // 전체 방문자 수 조회
    pipeline.scard(dateKey)         // 일일 방문자 수 조회

    const [total, date] = await pipeline.exec();

    return NextResponse.json({
        total: total || 0,
        date: date || 0
    })
}
```

일일 방문자의 경우 `SADD` 명령어를 사용해 자료형을 <b>Set</b>으로 만들었고, 전체 방문자는 String이기 때문에 `INCR` 명령어를 통해서
동시성을 보장했다. 

이제 이 API를 호출 <b>Client Component</b>를 만들고 테스트를 가볍게 해보았다.

<b>VisitorCounter</b>라는 이름으로 파일을 만들었고, 로딩된 상태를 판별할 <code>isLoading</code>,
응답을 저장할 객체 상태를 저장할 <code>visitors</code> 마지막으로 API 요청 실패 시, 에러 핸들링을 위한 <code>errMsg</code>까지
이렇게 3가지를 <code>useState</code>로서 사용했다.

```javascript
const [isLoading,setIsLoading] = useState('true')
// 당일과 전체 모두 객체로
const [visitors,setVisitors] = useState({ date: 0, total: 0 })
// api 실패 시, errMsg
const [errMsg, setErrMsg] = useState("")

// 개발 모드(Strict Mode)에서 중복 방지용 Ref
const hasFetched = useRef(false)
```

그리고 api로 fetch하는 건 useEffect 내부에서 수행을 했는데, 개발 환경에서 useEffect가 일부러 2번이 실행되기 때문에(메모리 누수 테스트)
다른 기능에선 사실 큰 문제는 없으나, <b>방문자 API 요청</b>에서는 치명적이다. 

왜냐하면 짧은 순간에 2번의 API가 날라가기 때문에 API가 2번이 요청되어서 방문자 수가 중복으로 찍힐 가능성이 있기 때문이다.

이를 해결하기 위해선 <b>컴포넌트가 다시 그려져도 값을 잃지 않는</b> 속성을 가진 <code>useRef</code>를 사용해서 이 함수가 이미 한 번 이상 실행되었음을
나타내는 flag로 사용하면 된다.

데이터 준비(날짜 계산)은 사실상 <code>route.js</code>에서 모두 수행하기 때문에 그냥 <code>/api/visit/</code>으로 <b>POST</b>요청을 하기만 하면 된다.

```javascript
const fetchVisitors = async () => {
    setIsLoading(true)
    setErrMsg("")
    try {
        const res = await fetch('/api/visit', {
            method: 'POST',
        })
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw Error("DB 조회 실패!" || errData.error)
        }

        const data = await res.json()
        console.log("데이터 파싱 결과: ", data);
        
        setVisitors(data)

    } catch (err) {
        console.error(err);
        setErrMsg("방문자 정보를 조회하지 못 했습니다.")
    } finally {
        setIsLoading(false);
    }
};

// 영향 받는 거 없으니 빈 배열 의존성
useEffect(() => {
    // 중복 호출 방지
    if (!hasFetched.current) {
        fetchVisitors()
        hasFetched.current = true;
    }
},[])
```

우선 데이터를 실제로 잘 가져오는데 log를 통해서 확인할 수도 있지만 간단한 UI로 확인을 해보았다.  
<figure>
    <img src="/images/redis_t1.png" alt="upstash Redis로부터 데이터를 잘 가져오는지 확인한 모습" />
    <figcaption>다행히도 아주 잘 가져온 걸 볼 수 있다. (개발 환경)</figcaption>
</figure>

겸사겸사 <code>route.js</code>에서 정말 중복되지 않은 방문자를 누적시키는지 로그로 확인을 해봤다.
<figure>
    <img src="/images/redis_t2.png" alt="새로고침을 해도 중복된 방문이 누적되지 않는 모습" />
    <figcaption>새로고침을 해도 중복되지 않게 잘 계산하고 있다.</figcaption>
</figure>

이젠 UI를 꾸며볼 차례.  
UI를 고민을 하다가 유튜브 좋아요 수가 촤라락하고 올라가는 애니메이션을 매우 맘에 들어했어서 그걸 적용해보기로 결정했다.

난 최대 8자리의 방문자 수를 기록할 것이고, 슬롯머신처럼 무작위 숫자가 촤라라락 넘어가다가 방문자 수가 나오도록 만들고 싶었다.  
그래서 초당 40fps 정도로 1.2초간 무작위 숫자를 보여주기 위해 아래와 같은 코드를 작성했다.  
```javascript
import { useState,useEffect } from "react";

export function useCounter(target, duration = 1200) {
    const [count,setCount] = useState(0);

    useEffect(() => {
        if (!target || target === null || target === undefined) return;

        const end = parseInt(target, 10);

        const intervalTime = 30;
        const totalFrames = Math.round(duration / intervalTime); // 40fps
        let currentFrames = 0

        const counter = setInterval(() => {
            currentFrames++

            if (currentFrames >= totalFrames) {
                setCount(end);
                clearInterval(counter);
            } else {
                const randomNum = Math.floor(Math.random() * 100000000);
                setCount(randomNum);
            }
        },intervalTime);

        return () => clearInterval(counter)
    },[target, duration])

    return count;
}
```
1.2초 동안 무작위의 최대 8자리 수가 화면에 나오고, 그 다음에 실제 방문자 수가 나오도록했다.
<figure>
    <img src="/images/redis_t3.png" alt="최종 UI 완성 모습" />
    <figcaption>임시 데이터로 테스트를 해본 UI 모습</figcaption>
</figure>

### Caching 적용
이 API는 POST와 GET이 원자적으로 이뤄지는 방향으로 구현이 되었기 때문에 Caching을 어떻게 해야할지 고민이 많았다.  
이전에 사용한 `next` 옵션을 통해선 <b>URL</b>을 기준으로 Next.js가 캐싱을 하는데, 이번에는 Redis를 DB에 통신을 하는 것이라
HTML METHOD만 다를 뿐 URL을 고정되어 있다는 게 문제였다. 

우선 Cache는 당연히 GET 요청에 대해서 주로 이뤄진다. 하지만 월 50만이라는 cmd를 최대한 아끼고 싶다는 생각으로 어떻게든 최적화를 하고 싶은 마음이
있었다. 따라서 POST 하기 전에 GET 요청을 먼저 날려서 Cache를 확인하고 있을 경우엔 해당 값을 그대로 사용 없다면 POST를 하도록 했다.

이 과정에서 Next.js의 <code>unstable_cache</code>를 사용했다.  
unstable_cache는 parameter와 key list에 담긴 값들을 기반으로 고유한 Key를 생성해 Caching한다.  

```javascript
// unstable_cache는 함수 인자에 따라 자동으로 별도의 캐싱 (Ip 기반)
const getCachedCounts = unstable_cache(
    async (dateKey) => {
        // Pipeline으로 1번의 통신
        const pipeline = redis.pipeline()
        pipeline.get(TOTAL_PREFIX);
        pipeline.scard(dateKey);

        console.log(`[Redis Read] 캐시가 만료되어 DB에서 새로 조회`);
        const [total, date] = await pipeline.exec();

        return {
            total: total || 0,
            date: date || 0,
            cachedAt: new Date().toLocaleTimeString()
        };
    },
    ['visitor-counts'],     // 캐시 키(고유한 문자열)
    { revalidate: 600 }             // 10분 TTL
);
```
unstable_cache는 첫 번째 인자로서 실행된 콜백 함수를 받고, 두 번째 인자로는 Key 문자열 리스트, 마지막 3번째 인자로는 
유효 시간을 받는다.

```javascript
// 일일 방문자 수
const dateKey = `${DATE_PREFIX}:${iso}`

// 조회를 먼저 하고 중복이 아닐 경우 incr,sadd 추가
let { total, date: todayCount } = await getCachedCounts(dateKey)

const isNew = await redis.sadd(dateKey, Ip);
console.log(`새로운 일일 방문자인지 확인: ${isNew}`);

// 4. 전체 방문자 수
// 해당 일일 방문이 유니크하면 INCR
if (isNew === 1) {
    const writePipe = redis.pipeline();
    writePipe.incr(TOTAL_PREFIX);
    writePipe.expire(dateKey, diff);
    await writePipe.exec();
}
```
이 Cache가 유효하게 hit되는지 확인하기 위해선 vercel log를 확인해보거나 배포 환경에서 Response에서 확인할 만한 캐시 적용 시간을
필드에 넣어서 확인해보면 된다. (`cachedAt`)

#### 캐시 적용 확인
<figure>
    <img src="/images/redis_t4.png" alt="46분 기준 43분의 캐시 데이터가 return된 모습" />
    <figcaption>46분에 요청을 했으나 return된 캐시 데이터는 43분의 데이터이다.</figcaption>
</figure>

### 후기
이젠 정말 타 블로그와 비교해도 손색이 없을만큼 너무 맘에 드는 블로그의 형태를 갖추었다.  
실제로 운영되는 무언가를 직접 하나하나 개발하는 건 정말 개발자로서 행복한 순간이 아닐 수가 없을 것이다.

물론 여기서 그치지 않고 더욱 많은 기능을 추가하고 또 고도화해보고 싶다.  
일단 다음 기능은 어떤 UI를 만들지 다른 블로그들을 보면서 아이디어를 얻어볼 심산이다!