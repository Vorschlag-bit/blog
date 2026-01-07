---
title: "날씨 UI를 server actions를 사용하도록 리팩토링해보자."
date: "2026-01-06 22:03:13"
category: "개발"
description: "날씨 UI에 server actions와 서버와 클라이언트 컴포넌트를 하이브리드 패턴을 적용해보자."
---

## 서론: 아 느리다...
내가 이전에 개발한 <a href="https://vorschlag-blog.vercel.app/posts/weather" class="plink">날씨 UI</a>는 Next.js의 **Route Handler**를 통해서 구현되어 있다.

이는 기본적으로 클라이언트 컴포넌트로 구현되는 React를 서버 컴포넌트의 역할을 수행할 수 있도록 도와주는 훌륭한 방법이다. 클라이언트에서 직접적으로 기상청 API 요청을 보내는 것은 API Key 노출 등 보안상 매우 위험하기 때문에 Proxy 서버 역할을 하는 Route Handler를 두는 건 올바른 판단이었다.

하지만 **초기 렌더링 속도**가 문제였다.
안 그래도 클라이언트 컴포넌트라서 초기 로딩이 늦는데, 날짜 계산이나 URL 생성 같은 무거운 로직까지 클라이언트에서 수행하다 보니 페이지에 진입하거나 새로고침을 할 때마다 '로딩 중' 화면을 봐야만 했다. 이는 UX에 있어서 좋지 않다고 생각했다.

### Server Actions의 도입
Next.js의 **Server Actions**에 대해 학습하면서 이를 도입하는 게 더 낫다고 판단했다.

내 날씨 UI는 '사용자 위치 기반' 조회를 위해 클라이언트 컴포넌트로 설계되는 게 당연했지만, 사용자가 굳이 위치 조회를 하지 않는다면 기본값인 '종로구(서울 기상 관측소)'의 날씨를 보여주는 **서버 컴포넌트**로서 동작해도 무방했기 때문이다.

따라서 나는 **초기 데이터는 서버에서 주입(Hydration)하고, 상호작용만 클라이언트에서 처리하는 하이브리드 방식**을 택했다.

1.  **기본 날씨(서울):** 부모인 서버 컴포넌트(`WeatherContainer`)가 Server Action을 호출해 데이터를 미리 가져와 자식에게 뿌려준다.
2.  **내 위치 날씨:** 사용자가 버튼을 누르면 자식인 클라이언트 컴포넌트(`WeatherWidget`)가 Server Action을 호출해 데이터를 갱신한다.

이렇게 함으로써 클라이언트 컴포넌트는 날짜 계산 로직 같은 무거운 짐을 서버로 덜어내고, 화면을 그리는 역할에만 집중할 수 있게 되었다.

---

## 트러블 슈팅: 클라이언트 컴포넌트의 자식인 서버 컴포넌트?

리팩토링 과정에서 가장 고민했던 지점은 **서버 컴포넌트와 클라이언트 컴포넌트의 경계**였다.

기존에 사용하던 날씨 UI(`WeatherWidget`)는 자식 컴포넌트로 날씨 아이콘 UI(`WeatherIcon`)를 갖고 있었다. 처음에는 이 아이콘 컴포넌트를 서버 컴포넌트로 만들어서 import 하면 될 것이라 생각했다.

```javascript
// WeatherWidget.js (Client Component)
import WeatherIcon from "./WeatherIcon"; // 서버 컴포넌트라고 생각함

return (
    <div>
        {/* 생략 */}
        <WeatherIcon pty={weather.PTY} sky={weather.SKY} />
    </div>
)
```

하지만 이렇게 클라이언트 컴포넌트의 자식으로 직접 `import`되어 사용되는 서버 컴포넌트는 **클라이언트 컴포넌트로 변질**된다.

Next.js 공식 문서의 <a class="plink" href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#importing-server-components-into-client-components">
   Composing Client and Server Components
</a> 항목을 보면 다음과 같이 명시되어 있다.

<img src="/images/n_c.png" alt="Next.js 공식 문서 내용, 'use client'가 적힌 컴포넌트의 imports와 자식 컴포넌트들은 전부 JS 번들로 취급받음">

즉, `WeatherWidget`(`use client`) 내부에서 `import`된 모든 컴포넌트는, 설령 그게 서버 로직을 포함하고 있더라도 **자동으로 클라이언트 번들로 포함되어 브라우저에서 실행**된다. 따라서 서버 컴포넌트의 이점인 'JS 번들 감소'나 '빠른 렌더링'을 전혀 살리지 못하고 도리어 브라우저에게 부담만 주고 있었던 셈이다.

### Children 패턴의 한계와 해결
이 문제를 해결하는 정석적인 방법은 **Children 패턴**이다. 부모인 서버 컴포넌트에서 `WeatherIcon`을 렌더링해서 `WeatherWidget`의 `children`으로 넘겨주는 방식이다.

```javascript
// WeatherContainer.js (Server)
export default async function WeatherContainer() {
  const data = await getWeather(...);
  return (
    <WeatherWidget>
      {/* 이렇게 넘기면 WeatherIcon은 서버 컴포넌트로 유지됨 */}
      <WeatherIcon pty={data.PTY} ... />
    </WeatherWidget>
  );
}
```

하지만 이 방식에도 치명적인 문제가 있었다. 초기 로딩(서울 날씨) 때는 문제가 없지만, **사용자가 '내 위치 찾기'를 눌러 부산 날씨를 불러올 때**가 문제였다.
`children`으로 넘겨받은 아이콘은 서버에서 '서울 날씨'로 이미 렌더링 된 결과물(`React Node`)이기 때문에, 클라이언트에서 데이터를 새로 받아와도 아이콘을 동적으로 갈아끼우기가 매우 까다로웠다. 부산은 비가 오는데 아이콘은 여전히 서울의 맑은 해를 보여주는 상황이 발생할 수 있는 것이다.

결국 나는 **컴포넌트 주입을 포기하고 데이터 주입 방식**을 선택했다.
Server Action(`getWeather`)에서 아예 날씨에 맞는 `iconName` 문자열까지 결정해서 반환하도록 하고, 클라이언트는 `<Image>` 태그를 사용해 해당 리소스를 렌더링하는 방식으로 구조를 단순화했다.

---

## 구현 과정

### 1. Server Actions (날씨 로직 서버로 이동)
먼저 부모인 서버 컴포넌트와 자식인 클라이언트 컴포넌트에서 재사용할 **server actions** 함수를 만들었다. 기존 Route Handler에 있던 로직을 그대로 가져오되, 클라이언트에 불필요한 시간 계산 로직 등을 전부 이곳으로 옮겼다.

```javascript
"use server"
import { dfs_xy_conv } from "@/app/utils/positionConverter"

/**
 * 좌표(x,y)를 기반으로 기상청 API를 호출하고 데이터를 반환하는 Server Action
 */
export default async function getWeather({ x, y, type="xy" }) {
    // API Key 사용 및 날짜 계산 로직 (서버에서만 실행됨)
    // Promise.all()을 사용해 3가지 기상청 API 병렬 호출
    
    // ... 데이터 파싱 ...

    // 아이콘 이름까지 서버에서 결정해서 내려준다
    const iconName = getWeatherIcon(pty, sky, lgt, isNight)

    return {
        temperature: liveMap['T1H'].toFixed(1),
        sky: fcstMap['SKY'],
        iconName: iconName, 
        // ... 생략
    };
}
```

### 2. 부모 컴포넌트 (WeatherContainer.js)
서버 컴포넌트인 컨테이너는 페이지 로드 시 즉시 실행되어 기본 지역(서울) 데이터를 가져온다. 그리고 자식에게 `initialData`로 넘겨준다.

```javascript
const SEOUL_CODE = { nx: '60', ny: '127' }

export default async function WeatherContainer() {
    // 기본값으로 종로구 송월동에 위치한 '서울 기상 관측소' 날씨 제공
    // 서버 사이드에서 실행되므로 초기 로딩 속도가 매우 빠르다.
    const data = await getWeather({
        cx: SEOUL_CODE.nx, 
        cy: SEOUL_CODE.ny, 
        type: "xy"
    })
    
    return (
        <div className="w-full">
            <WeatherWidget initialData={data} />
        </div>
    )
}
```

### 3. 자식 컴포넌트 (WeatherWidget.js)
이제 `WeatherWidget`은 `useEffect`를 사용해 데이터를 fetch 하지 않는다. `useState`의 초기값으로 서버에서 받은 데이터를 바로 꽂아 넣는다.

네트워크 요청은 사용자가 **'내 위치 찾기'** 버튼을 누를 때만, 브라우저의 Geolocation API로 얻은 좌표를 `getWeather` 액션에 넘겨서 수행한다.

```javascript
"use client"
export default function WeatherWidget({ initialData }) {    
    const [weather, setWeather] = useState(initialData); // 초기값 할당

    // 내 위치 찾기 핸들러
    const handleMyLocation = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            // Server Action 호출 (클라이언트 -> 서버)
            const newData = await getWeather({ ... });
            setWeather(newData);
            setLoading(false);
        });
    };

    return (
        // ... JSX 생략 ...
        // weather 상태에 따라 즉시 렌더링
    )
}
```

### 4. 로딩 및 실패 화면 개선
리팩토링을 진행하면서 단순 텍스트였던 로딩/에러 화면도 직관적인 아이콘으로 개선했다.

<div className="flex gap-4">
    <figure>
        <img src="/images/n_loading.png" alt="새로운 로딩 화면, windsock이 바람에 날리는 모습">
        <figcaption>Loading: 바람에 날리는 Windsock</figcaption>
    </figure>
    <figure>
        <img src="/images/n_error.png" alt="새로운 에러 화면, 스모그 구름 모양이 있음">
        <figcaption>Error: 우울한 스모그 구름</figcaption>
    </figure>
</div>

---

## 리팩토링 결과

이번 리팩토링을 통해 **Server Actions**를 도입했을 때 얻을 수 있는 이점을 정리하면 다음과 같다.

<table>
    <thead>
        <tr>
            <th>구분</th>
            <th>기존 방식 (API Route)</th>
            <th>Server Actions 도입 후</th>
            <th>이점</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>네트워크 구조</strong></td>
            <td>클라이언트 → <code>/api/weather</code> → 기상청</td>
            <td>클라이언트 → Server Action 함수 → 기상청</td>
            <td><strong>API 관리 비용 제거</strong><br>불필요한 라우트 핸들러 파일 삭제</td>
        </tr>
        <tr>
            <td><strong>번들 사이즈</strong></td>
            <td>날짜 계산, 좌표 변환 로직이 <strong>브라우저로 전송됨</strong></td>
            <td>무거운 계산 로직은 <strong>서버에만 존재</strong></td>
            <td><strong>초기 로딩 속도 향상</strong><br>클라이언트 JS 번들 다이어트</td>
        </tr>
        <tr>
            <td><strong>데이터 요청</strong></td>
            <td><code>fetch</code>, <code>res.json()</code> 등 연결 코드 필요</td>
            <td>함수 호출하듯 <code>await getWeather()</code></td>
            <td><strong>코드 간결화 & 가독성 증대</strong></td>
        </tr>
        <tr>
            <td><strong>초기 렌더링</strong></td>
            <td>페이지 로드 후 <code>useEffect</code> 실행 (CSR)</td>
            <td>부모에서 데이터 주입 (SSR)</td>
            <td><strong>LCP 최적화</strong><br>접속 즉시 완성된 화면 제공</td>
        </tr>
    </tbody>
</table>

결과적으로, 사용자가 페이지에 들어오자마자 날씨 정보를 즉시 확인할 수 있게 되었다(SSR). 또한 내 위치 기반 조회 시에도 복잡한 연산을 서버가 대신 수행해주므로, 체감 속도가 훨씬 빨라진 것을 확인할 수 있었다.