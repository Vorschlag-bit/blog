---
title: "Vercel Upstash Redis를 활용해 방문자 지표 UI 만들기"
date: "2025-12-18 21:22:07"
category: "개발"
description: "Upstash Redis를 활용한 방문자 지표 UI를 만들어보자."
---

## 방문자 지표 UI 만들어보기
블로그에 있어서 중요한 UI 중 하나는 <b>방문자 UI</b>가 아닐까 싶다.  
방문자로 하여금 해당 블로그의 인기 지표를 아주 쉽게 보여주고, 운영하는 사람도 하루 방문자가 얼마나 되는지는 당연히 궁금하기 때문이다.  

내 블로그는 Vercel의 Serverless 환경에서 실행되고, Vercel 자체의 <b>Observability</b>로 어떤 함수와 api가 얼만큼 요청됐는지를
확인할 수 있기 때문에 운영자 입장에선 대략적인 방문자의 통계 정보를 확인할 수 있다.

하지만 이를 확인하기 위해 매번 Vercel에 들어가서 Observability를 누르는 건 대단히 번거로운 일이다.  
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
Caching을 적용한다. 나 역시 1시간 간격의 Caching을 적용할 것이고, 그렇게되면 하루 24 * 30 = 720번이라는 아주 사소한 횟수가 나온다.  
30분 Caching으로 해도 1440번이라는 만 번이 채 안 되는 작은 횟수이다. 개발 환경에서 캐싱을 적용하지 않고 테스트를 하는 것을 감안하더라도
이번 달엔 매우 넉넉할 것으로 예상했다.

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
기능 명세로는 <b>사용자 지표는 조회(GET)과 수 증가(POST?) 동시적으로 발생</b>하는 것으로 보인다.

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

#### Redis를 호출 API 로직
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
    const Ip = request.ip;

    // 2. 오늘 날짜 계산
    const now = new Date();
    const kstAbs = now.getTime() + (9 * 60 * 60 * 1000);
    const today = new Date(kstAbs);
    const tomorrow = today.setUTCDate(today.getUTCDate() + 1).setUTCHours(0).setUTCMinutes(0);
    const iso = today.toISOString().slice(0,10).replace(/-/g, "");
    
    console.log("오늘 날짜(Num): ", today);
    console.log("오늘 날짜(Num): ", today);
    console.log("오늘 남은 시간(tom - tod): ", tomorrow - today);
    console.log("오늘 날짜(iso): ", iso);
    

    // 3. 일일 방문자 수
    const dateKey = `${DATE_PREFIX}:${iso}`
    const isNew = await Redis.sadd(dateKey, `${Ip}`);
    console.log(`새로운 일일 방문자인지 확인: ${isNew}`);
    


    // 4. 전체 방문자 수
    // 해당 일일 방문이 유니크하면 INCR
    if (isNew === 1) {
        const currentTotal = await Redis.incr(TOTAL_PREFIX)
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