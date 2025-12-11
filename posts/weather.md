---
title: "날씨 및 미세먼지 UI를 만들어보자"
date: "2025-12-08 16:43:20"
category: "개발"
description: "블로그 UI에 사용자 Ip 기반 날씨와 미세먼지를 보여주는 UI를 만들어보가"
---

## 공공기관 API를 활용한 날씨 UI 만들기
### 1. 날씨 어플 기능 설계하기
먼저 공공기관 API에서 항상 최상위권으로 사용되는 <strong>기상청_단기예보 조회서비스</strong> API를 활용해서 날씨를 보여줄 생각이었다.
내가 원하는 기능은 **현재 날씨에 대한 조회**이므로 조회서비스가 제공하는 4가지 API 중 **초단기 실황조회** API를 사용할 예정이었다.

**Request Parameter 명세**

| 항목명(영문) | 항목명(국문) | 항목크기 | 항목구분 | 샘플데이터 | 항목설명 |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **serviceKey** | 인증키 | 100 | 1 | 인증키<br>(URL Encode) | 공공데이터포털에서<br>발급받은 인증키 |
| **numOfRows** | 한 페이지 결과 수 | 4 | 1 | 10 | 한 페이지 결과 수<br>Default: 10 |
| **pageNo** | 페이지 번호 | 4 | 1 | 1 | 페이지 번호<br>Default: 1 |
| **dataType** | 응답자료형식 | 4 | 0 | XML | 요청자료형식(XML/JSON)<br>Default: XML |
| **base_date** | 발표일자 | 8 | 1 | 20210628 | ‘21년 6월 28일 발표 |
| **base_time** | 발표시각 | 4 | 1 | 0600 | 06시 발표(정시단위)<br>-매시각 10분 이후 호출 |
| **nx** | 예보지점 x좌표 | 2 | 1 | 55 | 예보지점의 x 좌표값 |
| **ny** | 예보지점 y좌표 | 2 | 1 | 127 | 예보지점의 y 좌표값 |

여기서 중요한 건 내가 만약 Ip 기반으로 x,y 좌표를 알 수 있다면 1페이지만 return하면 충분할 것이고,
일일 수용 가능한 트래픽의 양이 **10,000**으로 솔직히 내 블로그에 들어오는 모든 사람마다 fetch를 통해 실시간 반영을 해도 좋을 거 같지만
법정동에서 **동**단위의 구분을 가지고서 **redis cache**를 활용해 1시간 이내의 유효한 cache hit가 있다면 fetch하지 않고
즉시 cache값을 return하도록 구현해보고 싶었다.

공식문서에서 제공된 `응답메세지 명세` 표는 아래와 같다.

**응답 메시지 명세**

| 항목명(영문) | 항목명(국문) | 항목크기 | 항목구분 | 샘플데이터 | 항목설명 |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **numOfRows** | 한 페이지 결과 수 | 4 | 1 | 1 | 한 페이지당 표출<br>데이터 수 |
| **pageNo** | 페이지 번호 | 4 | 1 | 1 | 페이지 수 |
| **totalCount** | 데이터 총 개수 | 10 | 1 | 1 | 데이터 총 개수 |
| **resultCode** | 응답메시지 코드 | 2 | 1 | 00 | 응답 메시지코드 |
| **resultMsg** | 응답메시지 내용 | 100 | 1 | NORMAL SERVICE | 응답 메시지 설명 |
| **dataType** | 데이터 타입 | 4 | 1 | XML | 응답자료형식<br>(XML/JSON) |
| **baseDate** | 발표일자 | 8 | 1 | 20210628 | ‘21년 6월 28일 발표 |
| **baseTime** | 발표시각 | 6 | 1 | 0600 | 06시 발표(매 정시) |
| **nx** | 예보지점 X 좌표 | 2 | 1 | 55 | 입력한 예보지점 X<br>좌표 |
| **ny** | 예보지점 Y 좌표 | 2 | 1 | 127 | 입력한 예보지점 Y<br>좌표 |
| **category** | 자료구분코드 | 3 | 1 | RN1 | 자료구분코드<br>\* 하단 코드값 정보 참조 |
| **obsrValue** | 실황 값 | 2 | 1 | 0 | RN1, T1H, UUU, VVV, WSD<br>실수 또는 정수로 제공<br>\* 하단 코드값 정보 참조 |

※ 항목구분 : 필수(1), 옵션(0), 1 건 이상 복수건(1..n), 0 건 또는 복수건(0..n), 코드표별첨  
**category**에 따른 구분은 아래와 같았다.

| 예보구분 | 항목값 | 항목명 | 단위 | 압축bit수 |
| :--- | :--- | :--- | :--- | :---: |
| 초단기실황 | T1H | 기온 | ℃ | 10 |
| 초단기실황 | RN1 | 1시간 강수량 | mm | 8 |
| 초단기실황 | UUU | 동서바람성분 | m/s | 12 |
| 초단기실황 | VVV | 남북바람성분 | m/s | 12 |
| 초단기실황 | REH | 습도 | % | 8 |
| 초단기실황 | PTY | 강수형태 | 코드값 | 4 |
| 초단기실황 | VEC | 풍향 | deg | 10 |
| 초단기실황 | WSD | 풍속 | m/s | 10 |

여기서 내게 필요한 것은 **기온**, **강수형태**, **습도**, **1시간 강수량**, **풍향**, **풍속** 정도일 것이다.  
**강수형태**는 **초단기 기준** 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)이였다.  
친절하게도 공식문서에서 강수량 범주 및 표시 방법까지 제시해줬다.

<strong>초단기 실황조회</strong>는 <span style="color: red">매시간 정시에 생성되고, 10분마다 최신 정보로 업데이트</span>되므로 hh:10마다 뭔가 업데이트를 해야할 부분을 자동 수행하는 로직이 필요하다.

우선 Ip 주소를 기반으로 사용자 위치가 조회 가능한지 LLM과 대화해보았다.  
**Ip 기반 사용자 추적**에 대한 답변으로, **가능은 하나, 날씨용으로는 부정확하다**는 답변이 돌아왔다.  

`request-ip`나 Next.js의 `req.headers.get('x-forwarded-for')`를 통해서 사용자의 ip를 얻고 `geoip-lite`와 같은 DB나
`ipapi`와 같은 외부 API를 통해서 대략적인 위치(위도/경도)를 알 수 있긴 하다.

문제는 이런 식으로 제공되는 위도 경도는 대부분 <strong>시/군/구</strong>단위까지만 정확하고 내가 구현하고픈 **동**단위까지는 맞지 않는다.

또한, 이 기능을 설계하면서 중요하게 생각했던 것 중 하나가 **모바일** 환경에 대한 고려였다.  
두 플랫폼으로 모두 제대로된 기능을 제공하기 위해선 모바일 환경의 네트워크와 PC 환경의 네트워크의 차이점을 알 필요가 있었다.  

<strong>PC(WiFi/LAN)</strong>은 비교적 통신사 기지국이나 인터넷 교환 노드 위치와 가까워서 '시' 단위까지는 맞을 가능성이 있다.  
하지만 <strong>모바일(LTE/5G)</strong>은 통신사의 <strong>NAT(Gateway) Ip</strong> 를 사용하기 때문에 ip 위치가 사용자의 위치가 아닌
라우터의 위치가 될 것이었다.

따라서 동단위의 정확도와 성능(캐싱)을 모두 잡기 위해선 **클라이언트의 GPS** **서버 캐싱**을 잘 설계할 필요가 있었다.

#### 설계 전체 흐름도
1.  **Client (브라우저):**
    *   `navigator.geolocation.getCurrentPosition()`을 사용해 사용자의 정확한 <strong>위도(Lat), 경도(Lon)</strong>를 얻기. (사용자 동의 필요)
    *   이 좌표를 서버 API (`/api/weather?lat=...&lon=...`)로 보낸다.
2.  **Server (Next.js Route Handler):**
    *   받은 위도/경도를 기상청 격자 좌표 **(nx, ny)로 변환**. (변환 공식 함수 필요)
    *   **Redis 조회:** Key `weather:${nx}:${ny}`가 존재하는지 확인.
        *   **Hit:** 저장된 날씨 데이터를 바로 `return`.
        *   **Miss:** 기상청 API를 요청 -> 결과를 Redis에 저장(TTL 1시간) -> `return`.
3.  **Client (UI):**
    *   받은 데이터를 예쁘게 보여주기.

사용자의 정확한 위치를 얻기 위해선 브라우저 내에서 자체적으로 사용자 위치 수집 여부를 묻게 될 텐데, 화면을 보여줄 때 바로 요청을 하는 것보단
기본적으로 **서울 종로**의 위치를 기반으로 날씨를 보여주다가 **내 위치 찾기**와 같은 버튼을 따로 만들어서 권한을 획득하는 게 UX적으로 훨씬
좋을 거 같아서 이런 방식을 적용하기로 했다!

따라서 내가 준비할 UI는 크게 3가지로 구분할 수 있었다.
- 1. <strong>기본 상태(Default)</strong>
    - 사용자가 아직 허용/거부를 누르기 전, 혹은 거부를 눌렀을 때 보여줄 <strong>기본 지역 날씨(서울 종로)</strong>.
- 2. <strong>로딩 상태(Loading)</strong>
    - 사용자가 내 위치 찾기 버튼을 눌러서 GPS 좌표를 따고 서버 API를 갖다 오는 동안 보여줄 로딩 화면.
- 3. <strong>에러/거부 상태(Error)</strong>
    - 사용자가 '차단'을 누르거나, 위치 정보를 불러올 수 없을 경우 보여줄 작은 안내 문구 or 기본 화면으로 보여주기.


### 2. 날씨 어플 기능 구현하기
순탄하게 개발이 되어가던 중에 문제가 발생했다.  
초단기 실황조회는 <strong>하늘 상태(SKY)</strong>에 대한 정보를 제공하지 않는다는 것이다.  
단순히 강수형태만 제공하기 때문에 **맑음**과 **흐림**을 구분할 수가 없었다. 이는 날씨 제공 UI에 있어서 상당히 치명적이라고 생각했다.

따라서 계획을 약간 수정하기로 했다, **초단기예보**의 경우에는 하늘 상태를 제공해준다.  
다만, 초단기예보는 **예보**인만큼 정보제공이 약간 달랐다. <span>매시간 30분에 생성되고, 10분마다 최신 정보로 업데이트되며, 실제 api 제공 시간은 45분</span>이었다. 따라서 둘 다 10분 정도의 시간차를 줘서 api 제공을 안정적으로 받을 수 있게 하려면, 실황은 20분, 예보는 55분을 기준으로 이보다 작은 시간에 요청이 들어올 경우 -1시간의 정보를 바탕으로 제공해주기로 결정했다.

<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span className="text-red-400">트러블 슈팅(서버 시간 계산 문제)</span>
</summary>

**문제 상황**  
로컬 환경(한국)에서 현재 시간을 기준으로 기상청 API 요청 시간(`base_time`)을 계산할 때는 문제가 없었다. 하지만 <code>new Date()</code>를 사용하여 단순히 시간을 계산하니, 배포 환경(Vercel, UTC 기준)이나 브라우저의 시간대 설정에 따라 시간이 엉뚱하게 계산되는 현상이 발생했다.

예를 들어 한국 시간 00시 30분에 요청을 보냈는데, API 요청 파라미터에는 전날 15시 30분(UTC)이 들어가거나, 시차 보정을 위해 `+9시간`을 수동으로 했더니 브라우저가 자동으로 또 9시간을 더해서 **09시 30분**으로 미래의 시간을 요청하는 문제가 생겼다.

**원인**  
자바스크립트의 `Date` 객체는 실행되는 환경(브라우저/OS)의 시간대(Timezone)에 영향을 받기 때문이었다. `getHours()` 같은 메서드는 로컬 시간을 반환하기 때문에, 서버와 클라이언트 간의 불일치가 발생한다.

**해결 방법**  
실행 환경에 상관없이 <strong>'절대 시간(UTC)'</strong>을 기준으로 계산하되, 한국 시차만큼 강제로 이동시킨 후 `toISOString()`을 사용하는 방식으로 해결했다.

```javascript
// 1. 현재 시스템의 절대 시간(UTC)을 가져옴
const now = new Date();

// 2. UTC 시간에 강제로 9시간(korea offset)을 더해버림 (밀리초 단위 계산)
// 이렇게 하면 kstDate 객체 내부의 UTC 시간은 사실상 '한국 시간'이 됨
const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));

// 3. toISOString()은 무조건 UTC 시간을 문자열로 뱉어냄
// 위에서 강제로 시간을 변조했으므로, 이 문자열이 곧 한국 시간이 됨
const baseDate = kstDate.toISOString().slice(0, 10).replace(/-/g, "");
const baseTime = kstDate.toISOString().slice(11, 13) + "00";
```

</details>

<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span className="text-red-400">트러블 슈팅(클라이언트 사이드 환경 변수)</span>
</summary>

API 로직을 구현하던 중 문제가 발생했다.  
가장 중요한 **서비스 키**를 하드코딩으로 사용할 생각은 없었다. 환경변수로서 관리해서 동적으로 넣는 걸 생각했는데,
이 방식을 어떻게 해야할지 고민했다. 예전에 **Github Actions**를 활용해서 배포를 했을 때에는 github secrets를 사용해서
환경 변수들을 관리했었는데, 현재는 Vercel을 배포로 사용하니까 Vercel에 환경변수를 등록해두었다.(Setting -> Env Variables)

또한 `WeatherWidget`과 같은 클라이언트 컴포넌트에서는 보안상의 이유로 **서버의 환경변수에 절대 접근 불가**하다.
만약 가능하다면 웹사이트에 접속만 해도 DB 비밀번호를 알아낼 수 있다는 의미가 될 테니까!

따라서 Next.js에서는 실수로 비밀키가 브라우저로 유출되는 걸 막기 위해서 `.env`에 적힌 변수들을 **기본적으로 서버에서만 읽을 수 있게 한다**.
(어찌보면 당연하다, 환경변수는 '컴퓨터'의 환경변수이니까) 따라서 내가 Vercel을 통해 서버에 환경변수를 등록해두더라도 브라우저는 이 값을
`undefined`로 처리해버린다.

물론 client에서 읽을 수 있는 환경변수도 존재한다. `NEXT_PUBLIC_`이라는 접두사를 붙인 환경변수는 브라우저에서도 읽을 수 있다.  
하지만 public이라고 적힌 것처럼 사실상 이 변수는 **하드 코딩**해도 될 만큼 중요하지 않은 변수라는 의미를 갖기 때문에 대부분의 환경변수에서
사용할 수 없을 것이다.

비록 내 API key는 그렇게 중요한 정보는 아니지만, 그렇다고 노출시켜도 될 정보는 절대 아니므로 개발자 도구의 네트워크를 통해서 누군가가 쉽게 알아내지
못 하도록 처리를 했어야 했다.

이 문제를 해결하기 위해서 **Next.js App Router**가 제공하는 **Route Handler**를 도입했다. 쉽게 말하면, <strong>프론트엔드와 외부 API 사이에 중계 서버(Proxy)</strong>를 하나 두는 셈이다.

> 기존 (Client-Side Fetching): Browser -> 기상청 API (Key 노출)

> 변경 후 (Server-Side Proxy): Browser -> Next.js API Route (Key 없음) -> 기상청 API (Key 포함)

이 방법을 사용함으로써 3가지 이점을 얻을 수 있었다.

① 완벽한 환경변수 은닉  
Next.js의 API Route는 **Node.js 서버 환경**에서 실행된다.
이곳에서는 `NEXT_PUBLIC_` 접두사가 없는, **서버 전용 환경변수**(`process.env.WEATHER_API_KEY`)에 접근할 수 있다.
브라우저는 우리 서버(`/api/weather`)로 요청을 보낼 때 인증 키를 알 필요가 없다. 서버가 내부적으로 키를 붙여서 기상청에 다녀오기 때문이다.

② Mixed Content (HTTP/HTTPS) 문제 해결  
공공기관 API 중 상당수가 아직 `http` 프로토콜을 사용한다.
Vercel에 배포된 내 블로그는 `https`로 운영중이다.
브라우저 보안 정책상, `https` 사이트에서 `http` 요청을 보내면 **Mixed Content** 에러가 발생하며 요청이 차단된다.
**Server-to-Server 통신**은 이 제약에서 자유롭다. Next.js 서버가 대신 `http`로 데이터를 받아와주므로 배포 후에도 에러가 발생하지 않는다!

③ 클라이언트 로직 단순화  
복잡한 URL 파라미터 조합, 데이터 가공(Parsing) 로직을 서버로 옮김으로써 클라이언트 코드가 훨씬 깔끔해졌다.  
**클라이언트:** 날씨요청 (`fetch('/api/weather')`)  
**서버:** (시간 계산, 좌표 변환, 키 조합, 데이터 파싱) -> 정보 제공

</details>


이렇게 대강 정보를 받고난 다음 날씨 모양을 어떻게 줄까 고민하다가 유명한 <a href="https://basmilius.github.io/weather-icons/index-line.html" style="color: #2f9e44; text-decoration: none;">
  무료 날씨 애니메이션
</a> github가 존재하길래 여기로 결정했다. 그런데 아이콘들을 보니까 매우 다양한 상황의 날씨 정보를 제공해주는 것이 아닌가!

여기서 다시 기능에 대한 요구사항이 늘어났다. <strong>낙뢰, 강수, 하늘, 낮/밤</strong>에 대한 우선순위를 부여해서 상황에 최적화된 아이콘을 표시하고 싶어졌다.
이렇게 복잡하고 다양한 상황에 맞춰서 최적의 아이콘을 제공하려면, 지옥의 <code>if-else</code> 분기 처리를 최대한 깔끔하게 만들고 싶었다.

이를 위해 **우선 순위**를 정하고, `case`문을 활용해 가시적이고 유지보수에 편리한 코드를 구현하였다.
```javascript
export default function getWeatherIcon(pty, sky, lgt, isNight) {
    const suffix = isNight ? 'night' : 'day'

    // 1. 낙뢰(LGT)가 최우선
    if (lgt) {
        if (pty === 0 ) return `thunderstorms-${suffix}` // 마늘하늘 벼락
        if (pty === 3 || pty === 7) return `thunderstorms-snow` // 눈 + 벼락
        return 'thunderstorms-rain' // 그외에는 비 + 벼락
    }

    // 2. 강수(PTY) > 0일 때
    if (pty > 0) {
        switch(pty) {
            case 1: return 'rain'     // 비
            case 2: return 'sleet'    // 비/눈
            case 3: return 'snow'     // 눈
            case 5: return 'drizzle'  // 빗방울(약한 비)
            case 6: return 'sleet'    // 빗방울/눈날림(진눈깨비)
            case 7: return 'snow'     // 눈날림(눈)
            default: return 'rain'    // 기본은 비
        }
    }

    // 3. 맑음/흐름(SKY)일 때 (PTY == 0)
    switch(sky) {
        case 1: return `clear-${suffix}`            // 맑음 (clear-day, clear-night)
        case 3: return `partly-cloudy-${suffix}`    // 구름많음
        case 4: return `overcast-${suffix}`         // 흐름
        default: return `clear-${suffix}`
    }
}
```
아이콘 이름을 각 경우에 맞게 `return`하도록 설정했고, 낮/밤은 prefix로 결정하였다.  
#### 임시로 완성된 UI ver1
!["대강 완성된 날씨 UI 버전1"](/images/weather_t1.png)

만들면서 많은 수정 작업들이 있었다. 처음에는 아이콘과 기온표시를 가로로 한 열에 배치하고 싶었으나, 너비가 너무 넓어져서 기존의 레이아웃이
깨지는 게 너무 마음에 안 들었다.

아무래도 처음부터 UI를 설계하는 게 아니다보니 이런 일로 스트레스 받는 건 앞으로도 자주 발생할 거 같다.
현재 레이아웃이 너무 맘에 들기에 되도록 세로로 배치하는 걸 지향해야겠다.

소소하게 UI가 망가지는 것도 수정해야 했었다. 나는 API로부터 날라오는 숫자를 그대로 `Number()` 함수를 사용해서 화면에 뿌리다보니까,
소수점 1자리로 날라올 때도 있고, 정수로 날라올 때도 있었다.

그러다보니 3글자(숫자 소수점 숫자)인 경우와 1글자(숫자)인 경우 그리고 현재는
겨울이라 2자리인 경우는 거의 없지만 2자리가 될 경우에는 4글자(2자리 숫자, 소수점, 숫자)까지 될 수 있었기 때문에 온도 UI의 최소폭을 주어
찌그러지지 않도록 수정했다.
```javascript
<div className="flex-col">
    <div className="min-w-[5rem]"> {/** min-w를 통해 최소 너비 보장하기 */}
        {weather.temperature}℃
    </div>
</div>
```

사람은 욕망의 괴물이 아니던가.. 습도를 제공하고나니 당일 최고/최저 기온까지 제공하고 싶어졌다...!
정말 화나지만 내가 사용하는 **초단기 예보**와 **초단기 실황**에는 최고/최저 기온은 없고, 오직 **단기 예보**에서만 제공이 된다.

사실 단기 예보와 초단기 예보는 제공하는 값이 똑같고 단기 예보에 최고/최저 기온까지 제공해줘서 단기 예보만 사용해도 되겠지만,
단기 예보는 <span style="color: red">당일 새벽 2시부터 3시간 간격</span>으로 제공되기 때문에 내가 원하는
<strong>실시간 날씨 정보 제공</strong>이라는 취지에 맞지 않아서 초단기 예보의 SKY값을 사용하는 게 맞다고 판단했다.  

최고/최저의 예보 제공 시간표는 아래와 같다.  
**최고/최저기온의 발표시간별 저장되는 예보자료 시간**

| 발표시각<br>(KST) | 최저_오늘 | 최저_내일 | 최저_모레 | 최저_글피 | 최저_그글피 | 최고_오늘 | 최고_내일 | 최고_모레 | 최고_글피 | 최고_그글피 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **2** | ○ | ○ | ○ | ○ | | ○ | ○ | ○ | ○ | |
| **5** | | ○ | ○ | ○ | | ○ | ○ | ○ | ○ | |
| **8** | | ○ | ○ | ○ | | ○ | ○ | ○ | ○ | |
| **11** | | ○ | ○ | ○ | | ○ | ○ | ○ | ○ | |
| **14** | | ○ | ○ | ○ | | | ○ | ○ | ○ | |
| **17** | | ○ | ○ | ○ | ○ | | ○ | ○ | ○ | ○ |
| **20** | | ○ | ○ | ○ | ○ | | ○ | ○ | ○ | ○ |
| **23** | | ○ | ○ | ○ | ○ | | ○ | ○ | ○ | ○ |

> **○**: 데이터 제공됨  
> **빈칸**: 데이터 제공되지 않음  
> 새벽 **02시** 발표 자료만이 **오늘의 최저기온**을 포함.

로직은 제법 간단했다. 현재 시각이 02:15 이전일 경우 이전 날의 23시의 정보를 최고/최저 기온을 조회해오면 된다.
정보 제공은 02:00부터지만 안전하게 15분의 텀을 두었다.  
**단기, 초단기, 실황 시간 계산 로직**
```javascript
const now = new Date();
// 9시간 더하기
const kstAbs = now.getTime() + (9 * 60 * 60 * 1000);

// 객체 3개 생성
const kstDate_Live = new Date(kstAbs); // 실황용
const kstDate_Fcst = new Date(kstAbs); // 예보용
const kstDate_Srt = new Date(kstAbs);  // 단기 예보용
const currentHour = kstDate_Srt.getUTCHours();
const currentMin = kstDate_Srt.getUTCMinutes();

// 실황은 20분 전
if (kstDate_Live.getUTCMinutes() < 20) kstDate_Live.setUTCHours(kstDate_Live.getUTCHours() - 1);

// 예보는 55분 전
if (kstDate_Fcst.getUTCHours() < 55) kstDate_Fcst.setUTCHours(kstDate_Fcst.getUTCHours() - 1);

// 단기예보는 02:15분 이전이면 이전날 23:00의 데이터를 사용
if (currentHour < 2 || (currentHour === 2 && currentMin < 15)) {
    kstDate_Srt.setUTCDate(kstDate_Srt.getUTCDate() - 1); // 하루전
    kstDate_Srt.setUTCHours(23);
    kstDate_Srt.setUTCMinutes(0);
} else {
    // 아니라면 새벽 2시 고정
    kstDate_Srt.setUTCHours(2);
    kstDate_Srt.setUTCMinutes(0);
}
```

`route.js`에서 데이터를 `fetch()`로 받아오는 것도 `Promise.all()`을 사용해서 동시에 병렬적으로 통신하도록 수정했다.
```javascript
try {
    // Promise.all로 두 요청을 동시에 보냄(병렬)
    const [resLive, resFcst, resSrt] = await Promise.all([
        fetch(url_live),
        fetch(url_fcst),
        fetch(url_srt)
    ]);

    const liveData = await resLive.json();
    const fcstData = await resFcst.json();
    const srtData = await resSrt.json();

    // 둘 중 하나라도 실패하면 오류
    if (liveData.response?.header?.resultCode !== '00' || fcstData.response?.header?.resultCode !== '00' || srtData.response?.header?.resultCode !== '00')
        return NextResponse.json({ error: '기상청 API 오류' }, { status: 500 })

    const parsedData = parseWeatherData(
        liveData.response.body.items.item,
        fcstData.response.body.items.item,
        srtData.response.body.items.item,
        baseDate_Srt
    )

    return NextResponse.json(parsedData)
} catch (e) {
    // error 처리로직
}
```

#### 임시로 완성된 UI ver2
!["임시로 완성된 날씨 UI 두 번째 버젼"](/images/weather_t2.png)

이렇게해도 뭔가 아쉽다..! 내 위치를 누르면 단순하게 '내 위치'만 사용하는데 사실 네이버처럼 **시군구 읍면동**까지 보여주면 좋겠다는 생각이 들었다.  
사실 이전에 동네 커뮤니티 서버를 구현하면서 **위/경도**를 바탕으로 행정동 구역을 알려주는 API가 있는 걸 알고 있고, 신청까지 했어서 더 마음이 쓰였다.
기왕 API 요청을 연습하는 겸 이것도 넣으면 재밌을 거 같아서 갖다 붙여넣어보기로 결심했다!  

먼저 <strong>좌표->행정동</strong>을 지원하는 API는 
<a href="https://www.vworld.kr/dev/v4dv_geocoderguide2_s002.do" style="color:  #2f9e44; text-decoration: none;">
브이월드 Geocoder API 2.0
</a>이다. 키를 발급받는 건 누구나 가능하니 개발용으로 6개월을 받고, 3번의 연장을 할 수 있다!

parameter는 사용 예제에 나오는 url에서 `format`만 `json`으로 바꾸고, 좌표계는 기본으로 주어지는 epsg를 사용해도 충분하다.
<strong>반드시 경도,위도(x,y) 순서</strong>로 넣어야 제대로 나오므로 그 점만 주의하고 내가 원하는 건 도로명 주소가 아니라 지번 주소이므로
<code>type</code>은 <strong>PARCEL</strong>로 설정했다.

이 요청 역시 클라이언트에서 요청하는 게 아니라 **Proxy** 서버를 거치도록 구현하기 위해서 `/api/are?queryParams`으로 요청을 보내기 위한
`route.js`를 만들고, 파싱 로직까지 구현해주었다.
```javascript
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const lng = searchParams.get('lng')
    const lat = searchParams.get('lat')

    const SERVICE_KEY = process.env.VWORLD_API_KEY;

    const url = `https://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=${lng},${lat}&format=json&type=PARCEL&zipcode=true&simple=false&key=${SERVICE_KEY}`    

    try {
        const res = await fetch(url);

        const data = await res.json();

        if (data.response?.status !== "OK")
            return NextResponse.json({ error: '장소 조회 API 에러' }, { status: 404 })

        const addr = parseAreaData(data)

        if (!addr) 
            return NextResponse.json({error: '장소 조회 결과 없음'}, { status: 500 })

        return NextResponse.json({ addr: addr })
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch area data' }, { status: 500 })
    }
}

function parseAreaData(data) {
    // data.response.result[0].text
    const addr = data.response?.result[0]?.text ?? "";
    // text 형식: 서울시 --구 --동 지번
    if (addr) {
        const sp = addr.split(' ')

        if (sp.length >= 3)
            return `${sp[1]} ${sp[2]}`;
        return addr;
    }
    return "";
}
```

데이터를 잘 가져오는 걸 확인을 했고, 기존의 단순한 **내 위치**에서 정확한 행정구역을 반영하기 위한 로직도 수정했다.  
```javascript
const handleMyLocation = () => {
    if (!navigator.geolocation) {
        setErrorMsg("브라우저가 위치 정보를 지원하지 않습니다.")
        return;
    }

    // 로딩 시작
    setLoading(true);

    // 브라우저 내장 팝업 트리거
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            // 성공 시, 내 위치로 api 다시 호출
            const { latitude, longitude } = position.coords;
            let locationName = "내 위치"

            try {
                const queryParams = new URLSearchParams({
                lng: longitude.toString(),
                lat: latitude.toString()
                })

                // 블로그 API로 요청
                const result = await fetch(`/api/area?${queryParams.toString()}`)
            
                if (result.ok) {
                    const data = await result.json();
                    if (data.addr) locationName = data.addr
                } else {
                    console.warn("주소 조회 API 실패, 기본 이름(종로구) 사용");
                }
            } catch (err) {
                console.error("주소 파싱 중 에러 발생: ", err);
            }

            // 위/경도 -> 격자(x,y)로 변환
            const rs = dfs_xy_conv("toXY", latitude, longitude);

            setLocation({ lat: latitude, lng: longitude, x: rs.x, y: rs.y })

            // 변환된 좌표로 날씨 API 호출
            fetchWeather(rs.x, rs.y, locationName);
        },
        (error) => {
            console.error(error);
            setLoading(false)
            if (error.code === 1) setErrorMsg("위치 정보를 가져올 수 없어서 서울 종로 날씨를 보여드립니다.");
            else setErrorMsg("위치 정보를 가져올 수 없습니다.")
        })
};
```
그렇게 장소도 제대로 반영되는 날씨 UI를 만들었다. 장소는 개인 정보이므로 따로 사진을 준비하지 않았다.

<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span className="text-red-400">트러블 슈팅(Json 파싱)</span>
</summary>

기상청 API 요청이 분명 제대로 오는데(`status 200`) 자꾸 어디선가 문제가 생겨서 날씨 정보를 못 가져오는 에러 처리로직이
실행되고 있었다.  

```javascript
return NextResponse.json({ error: '❌ Failed to fetch weather data' }, { status: 500 })
```
자꾸 이 Json 응답만 돌아와서 여러 가지를 수정하고 상세한 디버깅용 로그를 찍어봤다.

**1. 디코용된 서비스 키 + URLComponent 객체 사용**  
나는 이전까지는 백틱 **문자열**로 url을 만들어서 `${}`을 활용해 변수를 주입시킨 후 `fetch()`를 호출했었다.  
여기에는 **인코딩된 키**를 사용했었다. 로컬 환경에서는 문제없이 돌아가서 그대로 배포를 했었는데, `Node.js`의 최신 라이브 러리들
(`fetch()`, `URLComponent`, `axios` 등)은 보안과 전송 안정성을 위해서 **자동으로 인코딩**하는 기능을 내제하고 있다.

따라서 **이중 인코딩**이 발생해. 제대로된 서비스 Key를 사용하지 않게 될 수 있었다.  
이를 해결하기 위해서 정석적인 방식인 **디코딩 키 + URLSearchParams** 조합을 사용해서 URL 객체를 만들었다.
```javascript
const makeUrl = (baseUrl, baseDate, baseTime, rows) => {
    const url = new URL(baseUrl);

    // searchParams.append로 조합하기
    url.searchParams.append("serviceKey", SERVICE_KEY)
    url.searchParams.append("pageNo", "1")
    url.searchParams.append("numOfRows", rows.toString())
    url.searchParams.append("dataType", "JSON")
    url.searchParams.append("base_date", baseDate)
    url.searchParams.append("base_time", baseTime)
    url.searchParams.append("nx", nx)
    url.searchParams.append("ny", ny)

    return url.toString()
};
```
이 과정에서 디코딩 키는 자연스럽게 인코딩되어 사용되기 떄문에 이중 인코딩을 최대한 피할 수 있었다.  

하지만 이래도 정확한 원인을 못 찾은 채, 날씨 조회에 실패했기 때문에 에러를 검증하는 함수를 만들어서 디버깅을 했다.
```javascript
// res 상태 체크 및 안전한 Json 파싱 함수(text -> json)
const errorCheck = async (res, name) => {
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`🚨 ${name} API Error (${res.status}):`, errorText);
        throw new Error(`${name} API 요청 실패: ${res.status}`);
    }
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch (error) {
        console.error("API 응답이 JSON 형식이 아님: ", text.subString(0,100));
        throw new Error('잘못 형식의 응답 도착(Not Json)')
    }
}
```
이 함수를 통해서 `status 200`은 아니라는 걸 알았고, 3개의 기상청 조회 동시 검증 조건문에서 나오는 에러가 Json응답으로 돌아오고 있다는 걸 파악했고
원문(text)를 보고 분석하기 위해서 `res`를 문자열로 바꿔서 로그를 찍어봤고, text를 다시 `JSON.parse()`를 사용해 Json으로 만들었다.

이렇게 하니 날씨 조회가 성공하는 걸 볼 수 있었다.. 아무래도 기상청 API에서 돌아온 형식이 묘하게 JSON과 안 맞았었나보다.  
URL 로그를 찍어서 주소창에서 직접 본 응답에는 딱히 문제점을 못 느꼈었는데, 뭔가 잘못된 형식이 껴있던 게 아닐까 싶다.

어쨌든 허망하지만 어찌저찌 문제 해결..

</details>

<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span className="text-red-400">트러블 슈팅(브이월드 차단)</span>
</summary>

날씨를 제대로 가져오고나서, 내 위치를 가져오는 로직도 똑같이 수정해서 문제를 원천 차단하고 문제가 발생하더라도
상세한 디버깅 로깅 로직을 통해서 원인을 밝힐 수 있도록 만들었다.
```javascript
try {
    const res = await fetch(url, { 
        headers: header,
        next: { revalidate: 900 } 
    });
    // 응답 자체에 대한 검증
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`브이월드 위치 정보 API Error (${res.status}):`, errorText);
        throw new Error("위치 정보 API 요청 실패")
    }

    // 마찬가지로 text -> json으로 수정
    const text = await res.text();
    let data;

    try {
        // 안전한 파싱
        data = JSON.parse(text);
    } catch (e) {
        // 파싱 도중 에러 검증
        console.error("VWORLD 파싱 에러 원본: ", text)
        throw new Error("위치 조회 API 응답 형식 오류(Not Json)")
    }

    if (data.response?.status !== "OK") {
        // 파싱된 데이터 검증
        console.error("위치 정보 API status != OK", data.response?.status)
        return NextResponse.json({ error: '장소 조회 실패' }, { status: 404 })
    }

    const addr = parseAreaData(data)

    if (!addr)
        // 장소 자체가 없는 경우
        return NextResponse.json({error: '장소 조회 결과 없음'}, { status: 500 })

    return NextResponse.json({ addr: addr }, {
        headers: {
            'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=30'
        }
    })
} catch(e) {
    // 에러 처리 로직
}
```


나의 위치 찾는 API를 호출했을 때도 섭섭하지 않게 바로 실패를 했다.  
Vercel에선 **Logs** 탭을 통해서 Production의 로그를 실시간으로 볼 수 있다.(Live 버튼을 누르면 됌)

그렇게 날라온 로그를 보니 VWORLD로부터 <span style="color: red">차단</span>을 당했다는 로그가 나왔다...

!["VWORLD 차단 로그"](/images/blocked.png)
`[Socket Error]: other side closed`로 애초에 브이월드에서 나의 요청을 차단시켰다.  
너무 당황스러워서 Ip 벤이라도 먹었나 싶었지만, 그럴리없었다.  

처음에는 내 요청을 봇으로 생각한 건 줄 알고, header에 `User_Agent` 같은 것도 넣어봤으나 소용이 없었다.

문제의 원인은 내 Vercel Function이 <strong>미국(워싱턴)</strong>에서 돌아가기 때문에 **해외 Ip 차단**을 한 것이였다.
왜 그런 정책이 있는 건지는 모르겠지만 다행히 Vercel 무료 티어에서도 Function의 지역을 바꿀 수 있었다.

!["vercel function 지역 설정"](/images/vercel-fun.png)

혹시라도 브이월드 API를 사용하는 서버를 만든다면 반드시 Region을 <span style="color: red">한</span><span style="color: blue">국</span>으로 하자!  
Vercel은 한국의 경우 인천 지역을 지원하기 때문에 인천으로 설정했다.

</details>


### 3. 데이터 캐싱 설계하기

이젠 데이터 캐싱을 고민할 차례였다. 애초에 할지 말지를 고민을 했었다.
- **1. 캐싱 안 하기: 새로 들어오는 사람마다 fetch를 통해 실시간 정보를 보여준다.**
    - 내 블로그에는 하루에 1만명이 들어올리가 없었다. 새로고침 횟수를 고려하더라도, 큰 문제는 없을 지도 모른다.
- **2. 저장소를 통한 캐시를 적극 활용한다.**
    - 정석적인 개발의 의미라면 이 방식이 무조건 맞다고 생각한다. 다만 이렇게될 경우 cache에 있는 $$x,y$$좌표들을 기반으로
    fetch를 통해 <strong>최신화(lazy Loading)</strong>를 거치기.

2번 방식을 선택하되, 캐싱을 저장할 곳을 어찌할지도 문제였다.  
Vercel에서는 다양한 storage들을 제공해준다. 특히 <strong>upStash</strong>가 적당히 빠른 속도와 무료 티어에선
<strong>월 50만의 cmd</strong>라는 양이 있어서 매력적인 선택이 될 수 있겠지만, 이후에 내가 만들 기능에게 양보하고 싶었다.

따라서 나는 **Next.js**의 자체 캐시 기능을 사용하기로 했다. Next.js는 `fetch()` 자체에 캐싱 기능을 내장시키고 있다.  
Vercel의 Data Cache를 무료로 사용한다고 생각하면 될 거 같다.

심지어 방법도 너무나 간단하다. `fetch()` 옵션에 `next: { revalidate: sec }`를 넣어주기만 하면 된다!  
먼저 기상 API에 15분 정도 캐싱을 해봤다.
```javascript
try {
    const [resLive, resFcst, resSrt] = await Promise.all([
        // 15min(= 900s) 캐싱 해두기
        fetch(url_live, { next: { revalidate: 900 } }),
        fetch(url_fcst, { next: { revalidate: 900 } }),
        fetch(url_srt, { next: { revalidate: 900 } })
    ]);
}
```

이후에 개발자도구의 네트워크 탭에서 내 `weather` api 요청이 cache-hit가 발생하는지 보면 된다.
#### 결과
!["Vercel_Cache가 HIT된 사진"](/images/vercel_cache.png)
잘 동작하는 걸 볼 수 있다.  
다만 한 가지 아쉬운 점이 있었다.

초단기 실황이나, 초단기 예보는 1분단위로 요청을 시도하기 때문에 `url`을 key로 사용하는 Next.js의 캐시가 캐시의 의미를 잃을 정도로 자주 데이터가 쌓였다.
따라서 모든 요청을 10분 단위로 요청을 하도록 수정해서, 최소 10분 간의 캐싱을 이뤄지도록 코드를 수정했다.

```javascript
const formatDate = (date) => {
    const iso = date.toISOString();
    return {
        date: iso.slice(0, 10).replace(/-/g, ""),
        // 시간을 10분 단위로 만들어서 cache hit 높이기
        time: iso.slice(11, 15).replace(':',"") + "0"
    }
}
```