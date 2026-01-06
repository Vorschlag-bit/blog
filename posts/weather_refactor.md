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

또한 server actions를 client 컴포넌트로 호출하는 것이 아니라 이 클라이언트 컴포넌트의 부모 컴포넌트로 보이진 않는 서버 컴포넌트를 만든 후
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

```javascript

```