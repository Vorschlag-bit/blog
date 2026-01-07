---
title: "날씨 UI를 server actions를 사용하도록 리팩토링해보자."
date: "2026-01-06 22:03:13"
category: "개발"
description: "날씨 UI에 server actions와 서버와 클라이언트 컴포넌트를 하이브리드 패턴을 적용해보자."
---

## 서론: 아 느리다...
내가 이전에 개발한 <a href="https://vorschlag-blog.vercel.app/posts/weather" class="plink">
  날씨 UI
</a>는 Next.js의 Route Handler를 통해서 구현되어 있다.

이는 기본적으로 클라이언트 컴포넌트로 구현되는 React를 서버 컴포넌트의 역할을 수행할 수 있도록 도와주는 훌륭한 방법이다.  
클라이언트에서 직접적으로 요청을 보내는 것은 보안상 매우 위험하기 때문에 proxy로 요청을 하는 건 올바른 판단이었다.

하지만 Next.js의 <b>server actions</b>에 대해서 학습하면서 server actions을 도입하는 게 더 낫다고 생각했다.

내 날씨 UI는 '사용자 위치 기반' 날씨 조회 기능을 위해서 분명 클라이언트 컴포넌트로서 설계되는 게 당연했지만, 사용자가 자신의 위치
기반 날씨 조회를 하지 않는다면 그냥 단순히 종로구에 있는 서울 기상 관측소의 날씨를 보여주는 <b>서버 컴포넌트</b>의 기능을 하게될 뿐이다.

안 그래도 클라이언트 컴포넌트라서 초기 렌더링 속도가 서버 컴포넌트에 비해 느린데 거기에 현재 구조는 그러한 클라이언트 컴포넌트인 날씨 UI가
날짜를 계산하고, URL을 생성해서 요청하는 등 무거운 코드들이 많았다. 

때문에 로딩 시간이 항상 존재했었고(최초 혹은 새로고침 시), 이는 UX에 있어서 좋지 않다고 생각했다.

따라서 클라이언트 컴포넌트적인 기능은 최대한 살리되, 서버 컴포넌트로서의 이점도 함께 얻고 싶은 상황이었다.

이러한 문제를 해결하기 위해서 나는 초기 데이터는 서버에서 주입하고(Hydration), 상호작용만 클라이언트에서 처리하는 하이브리드 방식을 택했다.  

즉, 날씨를 조회하는 기능은 server actions로, 사용자 위치 조회만 클라이언트 컴포넌트에서 수행하도록 기능을 분리함으로써
클라이언트 UI인 날씨 어플이 최대한 JS 번들에 대한 부담감을 덜어내도록 하고, 최소한으로 필요한 사용자 위치를 얻는 기능만 수행하도록 했다.

또한 server actions를 client 컴포넌트로 호출하는 것이 아니라 이 클라이언트 컴포넌트의 부모 컴포넌트로 보이진 않는 서버 컴포넌트(이하 WeatherContainer)를 만든 후
이 서버 컴포넌트에서 action 함수를 호출해 기본 데이터인 종로구 날씨를 가져오도록 수행하고, 자식이자 클라이언트 컴포넌트인 날씨 UI에선
초기에 이 데이터를 그냥 보여주기만 하다가, 위치 조회 버튼을 누를 경우에 다시 actions 함수를 통해 데이터를 받는 방식으로 수정하기로 결정했다.

이렇게 함으로써 클라이언트로서의 반드시 필요한 기능과 느린 속도를 보완할 수 있을 거라고 생각했다.

### 리팩토링 시, 얻는 이점 정리
아래는 server actions를 도입 시 얻을 수 있는 이점에 대해서 정리해본 표이다.
<table>
    <thead>
        <tr>
            <th>구분</th>
            <th>기존 방식 (Client Fetch + API Route)</th>
            <th>Server Actions 도입 후</th>
            <th>얻게 되는 이점</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>네트워크 구조</strong></td>
            <td>클라이언트 → <code>/api/weather</code> (API Route) → 기상청 서버<br>(별도의 API 엔드포인트 관리 필요)</td>
            <td>클라이언트 → Server Action 함수 실행 → 기상청 서버<br>(API 엔드포인트 생성 불필요)</td>
            <td><strong>API 관리 비용 제거</strong><br>불필요한 라우트 핸들러 파일을 만들지 않아도 됨</td>
        </tr>
        <tr>
            <td><strong>번들 사이즈</strong></td>
            <td>날짜 계산, 좌표 변환, 파라미터 포맷팅 로직이 <strong>브라우저로 전송됨</strong></td>
            <td>무거운 계산 로직은 <strong>서버에만 존재</strong>하며, 클라이언트는 결과값만 받음</td>
            <td><strong>초기 로딩 속도 향상</strong><br>클라이언트가 다운로드할 JS 파일 크기 감소 (Zero Bundle)</td>
        </tr>
        <tr>
            <td><strong>데이터 요청 방식</strong></td>
            <td><code>fetch('/api/...')</code>, <code>res.json()</code>, URL 파라미터 조합 등 <strong>연결 코드(Glue Code)</strong> 필요</td>
            <td>JS 함수 호출하듯이 <code>await fetchWeather()</code>로 사용</td>
            <td><strong>코드 간결화 & 가독성 증대</strong><br>직관적인 함수 호출 형태로 로직 단순화</td>
        </tr>
        <!-- <tr>
            <td><strong>타입 안정성<br>(TypeScript)</strong></td>
            <td>API 응답 타입을 수동으로 지정하거나 공유해야 함</td>
            <td>함수의 반환 타입이 자동으로 클라이언트에 추론됨</td>
            <td><strong>End-to-End 타입 안전성</strong><br>개발 실수 방지 및 생산성 향상</td>
        </tr> -->
        <tr>
            <td><strong>초기 렌더링<br>(UX)</strong></td>
            <td>페이지 로드 후 <code>useEffect</code> 실행 → 로딩 스피너 깜빡임 발생 (CSR)</td>
            <td>부모(서버 컴포넌트)에서 미리 가져와 <code>props</code>로 주입 가능 (SSR)</td>
            <td><strong>LCP(최대 콘텐츠 페인트) 최적화</strong><br>초기 접속 시 로딩 없이 즉시 완성된 화면 제공</td>
        </tr>
    </tbody>
</table>

## 구현 과정
먼저 부모인 서버 컴포넌트와 자식인 클라이언트 컴포넌트에서 재사용할 <b>server actions</b> 함수를 만들었다.

기존의 `/api/weather/route.js`에 있던 `GET()` 함수의 로직을 그대로 재사용했고, 클라이언트에서 수행하면 시간 계산 로직만 추가로
별도의 함수로 만들어서 넣어줬다.

```javascript
"use server"
import { dfs_xy_conv } from "@/app/utils/positionConverter"

/**
 * 좌표(x,y)를 기반으로 기상청 API를 호출하고 return 받은 걸 그대로 return 하는 함수입니다.
 * type이 'xy'인 경우에는 그대로 사용하고, 위/경도일 경우에는 입력받은 x가 위도(latitude), y는 경도(longitude)
 * 이고, dfs_xy_conv() 함수를 통해 x,y 좌표로 변환한 후에 사용합니다.
 * @param { number } x,
 * @param { number } y,
 * @param { string } type,
 */
export default async function getWeather({ x, y, type="xy" }) {
    //  내용 생략...
    //  Promise.all()을 사용해 3가지 웹 요청을 병렬로 처리하는 로직
}

// 현재 한국 시간을 계산을 함수
function get_currentTime() {
    //  내용 생략...
    return {
        baseDate_Fcst: fcstParams.date,
        baseTime_Fcst: fcstParams.time,
        baseDate_Live: liveParams.date,
        baseTime_Live: liveParams.time,
        baseDate_Srt: srtParams.date,
        baseTime_Srt: srtParams.time
    }
}

// data를 기반으로 날씨를 판별하는 함수
function parseWeatherData(liveItems, fcstItems, srtItems) {
    //  내용 생략...
    return {
        temperature: liveMap['T1H'].toFixed(1), // 실황 기온
        tmx: tmxValue.toFixed(1),               // 최고 기온
        tmn: tmnValue.toFixed(1),               // 최저 기온
        humidity: liveMap['REH'],    // 실황 습도
        wind: liveMap['WSD'],        // 실황 풍속
        PTY: liveMap['PTY'],         // 실황 강수상태 (0: 없음, 1: 비, 2: 눈/비, 3:눈, 5: 빗방울, 6: 빗방울 날림, 7: 눈날림)
        SKY: fcstMap['SKY'],         // 예보 하늘 상태
        LGT: fcstMap['LGT'] > 0      // 예보 낙뢰 여부
    };
}
```

<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span className="text-red-400">트러블 슈팅(클라이언트 컴포넌트의 자식인 서버 컴포넌트)</span>

기존에 내가 사용하던 날씨 UI(클라이언트 컴포넌트)는 자식 컴포넌트로 서버 컴포넌트인 날씨 아이콘 UI를 갖고 있었다.
```javascript
return (
    <div className="">
        {/** Header */}
        <div className="">
            {/* 생략 */}
        </div>
        <div className="">
            {loading ? (
                // 로딩 중일 때
                <div className="">SEARCHING...</div>
            ) : weather ? (
                // 날씨 정보 표시
                <div className="">
                    <div className="">
                        {/* 기상 정보(하늘,강수량 등)을 바탕으로 화면을 그리는 서버 컴포넌트 */}
                        <WeatherIcon 
                            pty={weather.PTY}
                            sky={weather.SKY}
                            lgt={weather.LGT}
                        />
                    </div>
                    {/* 이하 생략 (온도 정보들) */}
                </div>
            ) : (
                // 에러 표시
                <div className="">
                    {errorMsg || "날씨 정보 없음"}
                </div>
            )}
        </div>
    </div>
)
```
이렇게 클라이언트 컴포넌트의 자식으로 직접 `import`되어 사용되는 서버 컴포넌트는 <b>클라이언트 컴포넌트로 변질</b>된다.

Next.js의 규칙상, `use client`가 선언된 부모 내부에서 `import`된 모든 컴포넌트는 <b>자동으로 클라이언트 번들로 포함되어 브라우저에서 실행</b>된다.
해당 컴포넌트가 별도로 `use client`를 선언하지 않아도 말이다.

<!-- Next.js 공식 문서 근거들기 -->

따라서 서버 컴포넌트의 이점인 빠른 렌더링을 전혀 살리지 못 하고 도리어 클라이언트 컴포넌트가 되어 브라우저에게 큰 부담만 주고 있었던 셈.  

이런 상황에서 날씨 아이콘을 진짜 서버 컴포넌트로 동작하기 위해서 Children 패턴을 적용했다.

앞서 설계했던 서버 컴포넌트 기능을 하기 위한 보이지 않게 만들 `WeatherContainer`에서 `WeatherIcon`을 만들어 `WeatherWidget`의 자식(`chilren` props)으로
넘겨주는 방법이다. 

아래와 같은 코드로 부모인 서버 컴포넌트에서 import하면 서버 컴포넌트가 유지되고, 클라이언트 자식에게 props로 물려줌으로써
`layout.js`의 방식처럼 그대로 갖다 박듯이 화면을 그릴 수 있는 Next.js의 방식을 사용했다.

```javascript
// [Server Component] app/components/WeatherContainer.js
import WeatherWidget from "./WeatherWidget";
import WeatherIcon from "./WeatherIcon"; // 여기서 import 해야 서버 컴포넌트로 유지됨!

export default async function WeatherContainer() {
  const data = await getSeoulWeather(); // 서울 날씨 가져오기

  return (
    <WeatherWidget initialData={data}>
      {/* 
         핵심: 서버 컴포넌트인 WeatherIcon을 
         클라이언트 컴포넌트(WeatherWidget)의 자식(Children)으로 주입 
      */}
      <WeatherIcon pty={data.PTY} sky={data.SKY} lgt={data.LGT} />
    </WeatherWidget>
  );
}
```
</summary>

이후에는 서버 컴포넌트의 기능을 부모 컴포넌트인 `WeatherContainer.js`를 구현했다.

```javascript
```

그리고 기존의 `<WeatherIcon>` 대신에 넣고 감쌌다.

```javacsript
```