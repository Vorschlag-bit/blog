---
title: "AI를 활용한 새로운 프로젝트를 해보자 (with Fast API)"
date: "2026-02-04 13:12:40"
category: "개발"
description: "AI를 활용한 데이터 파이프 라인을 구축해보는 프로젝트를 시작해보자."
---

## 서론: 뭔갈 새로운 걸 해보고 싶어요
블로그 개발이 끝나고 다시 공고를 지원해보다가, 면접 중 한 현직 개발자 분께서 $I$형 인재보다 $T$자형 인재가 되길 추천한다고 말씀하셨다.

개발자로서 AI를 매일 사용하면서, AI의 개발 실력을 보면 누구나 다 감탄할 것이다.

하지만 이 감탄 뒤에는 언제나 걱정이 뒤따라 온다. 웬만한 경력 개발자 이상의 실력을 갖춘 AI를 경력 개발자가 이용한다면,
같은 경력 개발자끼리의 경쟁도 힘겨운 마당에 나 같은 신입에겐 이는 사형선고와 다름이 없을 것이다.

그 분께선 결론적으로 한 가지 능력을 깊게 파는 것보다 여러 능력을 조금 얕더라도 두루 갖춘 개발자일수록 회사에선 더 매력적으로 생각할 수밖에
없다고 말씀하셨다. 이젠 한 가지 발차기를 만 번하는 것보다 여러 발차기를 1000번 연습하는 게 나은 시대가 된 셈이다..

하지만 새로운 걸 학습하는 건 언제나 즐거운 일이고, 단순히 취미를 떠나서 이 학습 내용이 나의 시야와 실력을 폭넓게 향상시켜 줄 것이라는 믿음은
절대적이므로 나 역시 새로운 프로젝트를 완전히 새로운 기술 스택을 사용해 개발해보기로 결심했다.

## 뭘 써보지?
사실 주제를 먼저 결정하는 것이 우선이겠지만, 내 프로젝트는 개발자로서의 의의가 더 강하기 때문에 어떠한 기술을 써보느냐가 더 중요했다.

내가 이번 프로젝트에서 사용해보고 싶었던 건 크게 2가지였다.

### 1. Fast API
Python 기반 서버를 운영해보고 싶었어. 요즘 중소/중견 기업에서 Fast API 개발자를 찾는 걸 정말 자주 볼 수 있다. 
Fast API 코드를 볼 때마다 그렇게 복잡하진 않다고 느꼈고, 평소 코테 언어가 python이다보니 익듁하게 사용할 수 있을 거라 판단해서 써보고 싶었다.

### 2. 크롤링 봇 + AI를 활용한 데이터 전처리
특정 주제에 맞는 데이터를 크롤링해서 내가 정의한 스키마에 맞게 전처리한 후 저장하는 파이프 라인 구축이 궁극적 목표다보니 이 부분도 매우 중요했다.  
둘 다 당연히 처음하는 것이고, AI를 활용해서 단순히 프롬프트 기반으로 데이터 전처리가 그렇게 효율적으로 이뤄질까가 매우 궁금했었다.

## 뭘 만들지?
이제 주제를 정할 차례였다. 크게 2가지 후보군이 있었다.

### 1. 영화 관련 사이트
영화 리뷰 감상 분석 및 AI 큐레이션을 제공해주는 사이트를 만드는 것이다. 왓챠피디아나 네이버 영화, IMDB 같은 영화 리뷰 사이트를 대상으로 데이터를 크롤링한 후
AI에게 맡겨 데이터를 내가 정의한 스키마에 맞게 저장하고 박스 오피스의 AI 긍정 지수 순위를 제공.

### 2. 주식 관련 사이트
주가 데이터를 크롤링해서 데이터를 분석한 후에 AI 전망과 통계를 제공해주는 사이트. 

몇 가지 이유때문에 '영화 관련 사이트'를 만들기로 결정했다.

1. 비정형화된 데이터
LLM은 주가 정보처럼 숫자 계산보단 <b>텍스트의 맥락 이해</b>에 훨씬 강력하다.
2. 정보 보안
주가 정보에 대한 데이터 크롤링은 보안이 까다롭고, 잘못된 정보 제공에 따른 리스크가 너무 크다. 

이러한 결론을 바탕으로 단순한 영화의 평점이 아니라 그 너머에 있는 상세한 리뷰를 바탕으로 <b>'현재 대중의 감정과 분위기'</b>를 분석해 영화를 추천해주는 서비스를 구현하기로 결정했다.

## 프로젝트 구조 설계
우선 프로젝트 구조에 대한 간단한 설계를 했다.

당연히 가장 중요한 건 가격이다. 완전한 무료를 꿈꾸는 내게 최적화된 아키텍쳐여야 했다. 우선 3티어 아키텍쳐를 바탕으로 제공되는 서비스가 내겐 가장 익숙하고,
Fast API를 돌릴 서버가 당연히 존재해야 하므로 3티어 아키텍쳐를 선택했다.

FE는 내게 가장 익숙한 현재 사용 중인 Vercel + Next.js 조합을 사용하고, BE는 Render를 사용해서 무료 티어에서 서버를 돌리기로 결정했다. 다만 사용자가 없으면 잠드므로 주기적으로 ping을 날리는 daemon을 추가적으로 만들면 좋을 거 같았다.

마지막으로 DB는 무료 DB로 유명한 Superbase를 사용하기로 했다. Postgresql은 이전에도 사용해보았기 때문에 익숙하고, Postgresql이 제공해주는 JSON 데이터 저장 기능 또한 내가 제공하는 <b>비정형 데이터</b>에 매우 최적화되어 있으므로 아주 적절하다.

### 데이터 스키마를 어떻게 정의할까?
이렇게 구조까지 대강 결정하고 나니 BE 개발 방식대로 DB 설계부터 하고 싶었다. 하지만 가장 큰 문제가 있었다.

데이터가 어떤 식으로 크롤링되고 어떻게 전처리되어 제공될지 전혀 모르는 상황에선 DB를 설계하는 건 어불성설이다. 이에 따라 크롤링 봇과
LLM 기능부터 가볍게 구현을 해봐야 했었다.

AI 프로젝트에선 <b>ELT(Extract, Load, Transform)</b> 방식이 유용하다. 일단 긁어서 저장하고(Extract, Load), 나중에 전처리(Transform)하는 것이 편하다는 의미이다. 따라서 테이블을 2개로 나눴다.

1. <b>Raw Table</b>: 크롤링한 날 것의 데이터를 저장할 테이블, 스키마 정의를 지키기 위해서 JSON으로 저장할 예정
```SQL
CREATE TABLE raw_reviews (
    id SERIAL PRIMARY KEY,
    movie_title VARCHAR(255),
    crawl_date TIMESTAMP,
    raw_content JSONB -- 여기에 크롤링한 딕셔너리 통째로 저장
);
```

2. <b>Processed Table</b>: 정형화된 데이터를 저장할 테이블, 정규화된 스키마이며 LLM에게 이 스키마에 맞춰 데이터를 제공하라고 말할 것이다.

```SQL
CREATE TABLE movie_insights (
    id SERIAL PRIMARY KEY,
    movie_title VARCHAR(255),
    summary TEXT,           -- AI가 요약한 3줄
    sentiment_score INT,    -- AI가 분석한 점수 (0~100)
    keywords TEXT[],        -- AI가 추출한 태그 배열 (Postgres 배열 타입 지원)
    updated_at TIMESTAMP
);
```

재밌는 점은 크롤링할 데이터의 형태를 전혀 몰라도 Processed Table을 정의할 수 있었다는 점이다. 어차피 LLM이 전처리를 이에 맞춰 해줄 것이기 때문이다.

<figure>
    <img src="/images/superbase1.png" alt="superbase 화면 모습" />
    <figcaption>Superbase 화면 모습, SQL Editor를 사용해 SQL로 쉽게 테이블을 생성할 수 있다.</figcaption>
</figure>

<figure>
    <img src="/images/sbase1.png" alt="superbase 화면 모습" />
    <figcaption>Superbase 테이블 화면 모습, 테이블 생성된 걸 확인할 수 있고 데이터 row와 보안 수준까지 설정이 가능하다.</figcaption>
</figure>

<code>movie_insights</code> 테이블에 대한 보안 설정은 아래 사진처럼 해놓았다. <b>Permissive</b>로 두면, 하나라도 통과하면 pass하는 OR 조건문으로 동작하고, <b>Restrictive</b>로 두면, 모든 정책을 통과해야만 pass가 되는 AND 조건문이다.

이 테이블은 단순히 내 페이지를 방문하는 사람들이 볼 데이터이므로, 누구나 볼 수 있고(<code>public</code>), select만 가능하도록 하기 위해 <code>SELECT</code>만 설정하고 <code>true</code>를 통해 select 이외에는 모두 차단했다.

<figure>
    <img src="/images/sbase2.png" alt="superbase 화면 모습" />
    <figcaption>Superbase 테이블 화면 모습, 테이블 생성된 걸 확인할 수 있고 데이터 row와 보안 수준까지 설정이 가능하다.</figcaption>
</figure>

<code>raw_reviews</code> 테이블은 RLS만 설정해두고 별다른 정책을 만들지 않았다. 이렇게 하면, 기본적으로 <code>DENY ALL</code>로 되어 외부에선 접근하지 못 한다. Fast API 서버에선 <code>service_role</code> key를 사용해서, DB에 접근할 것이기 때문에 이 키를 사용하지 않은 외부 접근은 다 차단하면 된다.

### DB 용량의 문제
Superbase의 무료 티어의 용량 제한선은 최대 <b>500MB</b>이다. 세상의 모든 영화와 그 영화들의 수많은 리뷰를 저장하는 건 5TB라도 힘들 것이다.

역시 제한된 조건인 만큼 선택과 집중이 필요해진 순간이었다. 한글 기준 한 글자당 <b>3byte(UTF-8)</b>이라고 치고, 한 리뷰당 평균 글자 수가 300자(1KB) 정도된다고 치면 대략 50만 개의 리뷰를 저장할 수 있다.

여기서 영어 리뷰에 대해선 포기하고 한글 리뷰(특히 왓챠피디아)에 대한 리뷰에 대해서만 집중하기로 했다. 좀 더 구체적으로 제한을 둘 필요가 있었다. 왓챠의 모든 리뷰는 약 7.5억개이다. 물론 이건 영화뿐만 아니라 소설과 만화, 다른 미디어까지 포함한 것이긴 하지만 영화만 따져도 어마어마할 것이다.

이를 다 저장하는 건 당연히 불가능한 일이므로, 나는 박스 오피스 TOP 10과 왓챠 트렌드 30개 그리고 왓챠 랭킹 TOP 10 영화의 추천순 내림차순 리뷰에서 상위 50개를 매일 크롤링해서 저장할 계획이다. 여론조사나 시청률을 계산할 때도 항상 표본을 바탕으로 판단하므로 이러한 선택이 적절하다고 판단했다.

영화 50개 * 50개의 리뷰 * 각 리뷰당 1KB라고 가정할 경우, 2.5MB/일이라는 값이 나온다. 즉 내 프로젝트는 최대 200일 동안 활동이 가능한 프로젝트가 된다.

### 중복된 데이터의 문제
내 프로젝트는 주기적으로 배치 프로그램을 통해 새로운 영화 데이터들을 긁어서 DB에 저장할 것이다. 하지만 저장되는 데이터가 항상 새로울 수는 없을 것이다.
새로운 데이터를 가져오려면 항상 최신글을 기준으로 긁어오도록 코드를 작성해야 하는데 이는 코드적으로 복잡해질 거라 생각했다.

따라서 중복된 데이터에 대한 방지 대책이 필요했었고, 이를 <b>Hash</b>를 사용해서 해결하기로 결정했다. <b>영화제목</b> + <b>리뷰 내용(앞 20자)</b>를 바탕으로 Hash값을 만들고, 이를 `movie_insights` 테이블의 PK로 사용하면 중복을 방지할 수 있을 것이다.

## 정리된 서비스 명세
<b>주제: 오늘의 무비 브리핑 (Daily Briefing)</b>

**컨셉:** "바쁜 현대인을 위해, 지금 가장 핫한 영화의 여론만 딱 3줄로 알려줌."  

**타겟 영화 선정 기준 (크롤링 대상):**
- <b>박스오피스 TOP 10</b> (현재 상영작)
- <b>왓챠 랭킹 TOP 10</b>
- <b>왓챠 실시간 급상승 TOP 30</b>

*총 50개 내외의 영화만 매일 관리.*

**데이터 갱신 주기:**
- 매일 자정(00:00)에 크롤러가 돔.
- 기존 DB에 있는 영화라도 **리뷰가 업데이트되었을 수 있으니** 다시 긁어서 분석.

**보여줄 화면 (Front-end):**
- **Rank Board:** 1위~10위 리스트. 옆에 AI가 분석한 <b>"한 줄 평"</b>과 <b>"긍정 점수"</b> 배지 부착.
- **Detail Modal:** 클릭하면 상세 분석(3줄 요약, 키워드, 5각 차트) 표시.

## 본격적인 구현
### 프로젝트 구조 및 의존성 설치
JVM 환경(Gradle/Maven)과 달리 Python에선 `pip`로 패키지들을 관리한다. 

가장 먼저 할 것은 가상환경을 생성하는 것이다. JVM처럼 프로젝트만의 독립된 환경을 구축하는 셈이다.

```bash
# 1. 프로젝트 폴더로 이동 (이미 들어가 있다면 패스)
cd your-repo-name

# 2. 가상환경(venv) 생성
python -m venv venv

# 3. 가상환경 활성화 (운영체제에 맞게 입력)
# [Mac/Linux]
source venv/bin/activate
# [Windows (PowerShell)]
.\venv\Scripts\Activate
# [Windows (cmd)]
.\venv\Scripts\activate
```

이후엔 필수 라이브러리들을 설치했다. 필요한 라이브러리들은 아래와 같았다.

- <b>웹서버</b>: <code>fastapi</code>, <code>uvicorn</code> (Java의 TomCat/Netty 같은 역할)
- <b>크롤링</b>: <code>playwright</code> (브라우저 자동화)
- <b>DB</b>: <code>Superbase</code>
- <b>스케줄러</b>: <code>apscheduler</code> (주기적 실행, cron job)
- <b>환경변수</b>: <code>python-dotenv</code> (.env 로드)
- <b>HTTP 요청</b>: <code>httpx</code> (비동기 요청용, playwright 보조)

<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span className="text-red-400">라이브러리 선택 이유</span>
</summary>

<b>1. Playwright</b>
왓챠피디아는 React/Next.js 기반의 SPA으로 동작하는 것으로 보였다. 따라서 정적 분석 도구(BeautifulSoup)로는 빈 껍데기인 HTML만 가져오게 된다. 하지만 내게 필요한 건 브라우저가 JS가 실행된 이후의 DOM이었다.

또한 왓챠피디아는 Lazy Loading을 사용한다. 즉 페이지가 처음 제공될 때 모든 DOM이 완성된 것이 아니라 세로/가로 스크롤을 통해 실제 DOM에 접근을 해야지만 데이터가 로딩된다. 따라서 <b>브라우저 조작</b>이 필수적인 상황이었다, Playwright는 CSS Selector나 XPath뿐만 아니라 <code>get_by_text</code>, <code>filter</code> 등 내가 원하는 <b>요소(element)</b>를 찾는데에 매우 직관적이다. 또한, <code>Auto-waiting</code> 기능을 사용해서 데이터 로딩까지 기다릴 수 있어서 매우 적합했다.

---

굳이 DOM 요소를 조작하고 기다리는 게 너무 싫어서 순수 api 응답으로 크롤링을 하도록 리팩토링하도록 결정.

왜 이렇게 수정하면서 사실상 playwright는 아예 쓸모가 없어졌다. 왓챠피디아는 개발자 도구의 네트워크 탭에서 `fetch/xhr`만 보면 로그인을 하지 않더라도 리뷰들을 모두 볼 수 있다. 

또한 해당 api에 대한 정보까지 아주 상세히 제공해줘서 로그인 세션 저장까지 필요없어서 playwright를 쓸 필요가 아예 없어졌다. 초반에 api와 json 응답 형식만 보기 위해 사용했다.

<b>2. Apschedueler</b>
이유 작성해야 함

<b>3. httpx</b>
이유 작성해야 함

</details>

```bash
pip install fastapi "uvicorn[standard]" playwright supabase python-dotenv apscheduler httpx
```

playwright가 사용할 실제 브라우저 엔진을 설치했다. 크롬으로만 사용하도록 `chromium`만 설치했다.

```bash
playwright install chromium
```

새로운 프로젝트 구조는 아래와 같이 구성했다. SpringBoot의 구조(Controller, Service, Repository)와 비슷하게 구성해서 눈에 익도록 만들었다.

<figure>
    <img src="/images/np_ach.png" alt="새로운 프로젝트 디렉토리 구조 사진" />
    <figcaption>새로운 프로젝트의 디렉토리 구조 사진. (상세 설명은 아래)</figcaption>
</figure>

```TEXT
my-project/
├── .env                 # DB 키, API 키 등 비밀번호 저장
├── .gitignore           # 깃에 올리면 안 되는 파일 설정
├── requirements.txt     # 설치한 라이브러리 목록
├── main.py              # 앱 실행 진입점 (Application.java 역할)
└── app/                 # 소스 코드 폴더
    ├── __init__.py      # (빈 파일) 파이썬 패키지 인식용
    ├── api/             # Controller (Endpoint)
    │   └── __init__.py
    ├── core/            # Config (설정)
    │   └── config.py    # 환경변수 로드 로직
    ├── repository/      # Database Connection
    │   └── supabase.py  # Supabase 연결 객체
    ├── services/        # Service (비즈니스 로직 + 크롤러)
    │   ├── crawler.py   # 크롤링 봇
    │   └── llm.py       # AI 전처리 로직
    └── schemas/         # DTO (Pydantic 모델)
        └── movie.py
```

그 후에 root의 `main.py`에 health check와 루트 엔드 포인트에 대한 간단한 api를 만들어서 테스트 해보았다.

```python
from fastapi import FastAPI
from contextlib import asynccontextmanager

# 앱 시작/종료 시 실행될 로직
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 서버가 시작되었습니다! 크롤러 스케줄러를 준비합니다...")
    yield
    print("👋 서버가 종료됩니다.")

app = FastAPI()

@app.get('/')
def read_root():
    return {"message" : "Hello! World!"}

@app.get('/health')
def health_check():
    return {"status": "ok"}
```

FastAPI는 기본 port가 8000으로 되어 있다. 따라서 `localhost:8000`으로 접속해 테스트를 해보면 된다.

<figure>
    <img src="/images/fastapi1.png" alt="fast api 서버를 구동시킨 모습, 기본 8000 port이다." />
    <figcaption><code>uvicorn main:app --reload</code>로 서버를 킨 모습, 기본 8000 포트인 걸 볼 수 있다.</figcaption>
</figure>

<figure>
    <img src="/images/fastapi2.png" alt="fast api 서버에 접속한 모습" />
    <figcaption>서버가 잘 실행되는 걸 볼 수 있다.</figcaption>
</figure>

추가로 FastAPI는 자체적으로 <b>Swagger</b>를 함께 제공하기 때문에 <code>/docs</code>로 접속하면 Swagger UI도 쉽게 확인할 수 있다.

<figure>
    <img src="/images/fastapi3.png" alt="fastapi가 제공하는 기본적인 Swagger UI 모습" />
    <figcaption>FastAPI가 제공하는 Swagger UI 모습. <code>/docs</code>로 접속하기만 하면 된다.</figcaption>
</figure>

### 크롤링 봇 구현
LLM에게 크롤링 봇을 한 번 짜보라고 시켰다. 그랬더니 URL(영화 리뷰)을 직접 넣어야 하는 크롤링 봇 코드를 작성해줬다.

이는 매우 번거로우니 크롤러를 2단계로 나누기로 했다. 

먼저, 왓챠의 무비 탭에 접속해 박스 오피스 TOP 10과 왓챠 TOP 10 그리고 왓챠 실시간 급상승 TOP 30에 대한 <b>상세 주소와 제목</b>을 배열로 return하는 크롤러 코드가 필요했다.

그 후엔 해당 주소를 바탕으로 리뷰 50개를 JSON으로 만들어 DB에 저장하는 봇이 필요했다.

#### 영화 상세 페이지 주소를 크롤링하는 코드
<details>
<summary>
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h10v2H6V2zM4 6V4h2v2H4zm0 12H2V6h2v12zm2 2H4v-2h2v2zm12 0H6v2h12v-2zm2-2v2h-2v-2h2zm0 0h2V8h-2v10zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4z" fill="currentColor"/></svg>
<span className="text-red-400">Playwright를 사용한 크롤링 코드 (기록용) </span>
</summary>

일단 테스트를 리뷰를 크롤링할 주소와 제목 List를 return하는 헬퍼 함수를 하나 구현하고 테스트를 해보았다.

```python
async def collect_tx_links() -> List[Dict]:
    """
    메인 페이지에서 박스오피스, 왓챠랭킹, 급상승 섹션을 찾아 URL을 수집.
    """
    targets = []
    seen_urls = set() # 중복 URL 제거용
    # 수집할 섹션 키워드 : 해당 키워드 링크 개수
    tg_configs = {
        "박스오피스 순위" : 10,
        "왓챠 Top 10 영화": 10,
        "왓챠 실시간 급상승 Top 30": 30
    }

    async with async_playwright() as p:
        print("🕵️ Scout: 왓챠피디아 메인 페이지 탐색 시작...")
        browser = await p.chromium.launch(headless=True) # 디버깅 시에는 False
        page = await browser.new_page()

        # 왓챠피디아 무비탭 접속
        await page.goto('https://pedia.watcha.com/ko-KR/?domain=movie')
        await page.wait_for_timeout(2000)


        # 설정된 섹션별로 순회하면서 수집
        for section_title,limit in tg_configs.items():
            print(f"   👉 섹션 찾는 중: '{section_title}'...")

            try:
                # [Playwright 필터링 전략]
                # 1. section_title을 갖춘 요소를 찾음
                # 2. 해당 요소와 가장 가까운 섹션 컨테이너(<div>)를 찾음.
                # (p 태그의 부모의 부모가 서로의 공통 부모 태그)

                # locator(..).filter(has_text=..)를 사용해서 제목을 포함한 부모 태그를 특정
                section = page.locator('div').filter(has=page.get_by_text(section_title, exact=False)).first

                if await section.count() == 0:
                    print(f"      ⚠️ 섹션을 찾을 수 없습니다: '{section_title}' (텍스트 불일치 가능성)")
                    continue

                # 해당 섹션에서 a 태그 찾고 제목 찾기
                # div -> ul -> li -> a 구조
                links = await section.locator("li a[href*='/contents/']").all()

                print(f"      ✅ 발견된 컨텐츠: {len(links)}개 -> 상위 {limit}개만 수집")

                cnt = 0

                for link in links:
                    if cnt >= limit: break

                    url = await link.get_attribute('href')
                    title = await link.get_attribute('title')

                    # title 속성 없으면 내부 텍스트로 대체
                    if not title:
                        title = await link.inner_text()

                    if url and title and (url not in seen_urls):
                        full_url = f"https://pedia.watcha.com{url}"
                        seen_urls.add(url)
                        targets.append({
                            "section": section_title,
                            "title": title,
                            "url": full_url
                        })
                        cnt += 1

            except Exception as ex:
                print(f"      ❌ 에러 발생 ({section_title}): {ex}")
            
        await browser.close()
    
    print(f"📋 총 {len(targets)}개의 타겟 영화 URL 확보 완료.")
    return targets
```

그 결과 아래와 같이 <b>박스오피스 순위</b>는 제대로 가져오나(사실 이것도 30개지만 25개만 있다고 나옴) 나머지 2개(왓챠 Top 10과 실시간 급상승 Top 30)는 아예 가져오질 못 하고 있었다.

<figure>
    <img src="/images/cw1.png" alt="크롤링 코드가 제대로 동작하지 않는 모습" />
    <figcaption>박스오피스는 총 30개가 있지만 25개가 있다고만 나오고, 나머지 두 개는 가져오는데에 아예 실패한 모습.</figcaption>
</figure>

문제의 원인은 <b>Lazy Loading</b>과 <b>Locator 범위 오류</b> 때문이었다.

<b>박스 오피스</b>는 해당 페이지의 최상단에 위치해서 DOM이 곧바로 생성되지만, 왓챠 Top 10과 실시간 급상승은 스크롤을 내려야 생성되는 구조이다.

하지만 내 코드엔 사이트에 접속하고 2초를 기다린 뒤에 바로 탐색을 시작하는데, 스크롤이 이뤄지지 않아 나머지 2개의 DOM은 아예 생성되지 않았기 때문에
링크고 나발이고 아무것도 가져올 수가 없었던 것이다.

<figure>
    <img src="/images/wt2.png" alt="왓챠 무비탭의 HTML 태그 구조" />
    <figcaption>왓챠 무비탭의 HTML 태그 구조</figcaption>
</figure>

또한 위의 사진을 보면 왓챠의 태그 구조가
```Html
<div class="Container"> (우리가 잡아야 할 놈)
   ├── <div class="TitleBox"> (여기에 텍스트가 있음!) </div>
   └── <section class="ListSection"> (여기에 영화 목록 ul/li가 있음) </section>
</div>
```
이러한 구조로 되어 있음을 알 수 있다.

하지만 내가 작성한 코드는 `locator('div').filter(has=text).first`로 Playwright 입장에서 `div` 태그를 찾는데 `has=text`로 조건을 걸면, <b>Container</b>도 잡히나 <b>TitleBox</b>도 잡힌다.

즉, `.first`로 TitleBox에 접근하게 되면 당연히 그 안에는 `li` 태그가 없기 때문에 링크를 전혀 찾을 수 없었다.
아래의 그림을 보면 쉽게 이해할 수 있다.

<figure>
    <img src="/images/wt3.png" alt="왓챠피디아 영화탭의 HTML 요소 구성" />
    <figcaption>무비탭 전체가 <code>&lt;section&gt;</code> 태그로 감싸져 있고 그 아래론 &lt;div&gt; 태그로 감싸져 있다.</figcaption>
</figure>

위의 그림처럼 무비탭 전체가 `<section>`으로 감싸져 있었고, 그 아래론 `<div>` 태그로 감싸져 있어서 내가 찾는 `text` 요소를 정확하게 갖는 `section`이나 `div` 태그를 검색하는 `locator` 함수로는 이 최상위 2개의 태그가 잡힐 것이 분명했다.

따라서 이 두 가지 문제를 해결하기 위해서 천천히 <b>세로 스크롤을 하는 기능</b>과 <b>가로 스크롤을 하는 기능</b> 그리고 정확한 텍스트 기반으로 내가 원하는 요소를 찾은 후 거기서 가장 가까운 `<ul>` 태그로 이동하도록 locator 함수를 작성해야 했다.

```python
async def collect_tx_links() -> List[Dict]:
    # 중간 생략
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True) # 디버깅 시에는 False
        page = await browser.new_page()

        # 왓챠피디아 무비탭 접속
        await page.goto('https://pedia.watcha.com/ko-KR/?domain=movie')
        await page.wait_for_timeout(2000)

        # [핵심] 세로 스크롤 실행
        await slow_scroll(page)

        # 설정된 섹션별로 순회하면서 수집
        for section_title,limit in tg_configs.items():

            try:
                # [핵심] [Playwright 필터링 전략]
                # 1. 제목 텍스트 요소를 정확하게 찾기
                title_el = page.get_by_text(section_title, exact=True)

                if await title_el.count() == 0:
                    print(f"      ⚠️ 섹션을 찾을 수 없습니다: '{section_title}' (텍스트 불일치 가능성)")
                    continue

                # 2. '안에서 밖으로 탐색'
                # title_el에서 상위(ancestor)로 올라가면서 'ul' 태그를 포함한 가장 가까운 div,section 찾기
                # xpath: ./ancestor::*[.//ul][1] -> 조상 요소 중 ul을 가진 첫 번째 요소
                section = title_el.locator("xpath=./ancestor::*[.//ul][1]")

                # [핵심] 해당 섹션 위치로 화면 이동 (Focus)
                await section.scroll_into_view_if_needed()
                await page.wait_for_timeout(500) # 이동 후 렌더링 안정화 대기

                # 가로 이동 버튼 실행
                await click_next_buttons(section)

                # 해당 섹션에서 a 태그 찾고 제목 찾기
                # div -> ul -> li -> a 구조
                links = await section.locator("li a[href*='/contents/']").all()
                # 이하 생략...
    return targets
```

왓챠피디아를 접속해보면 알겠지만, Lazy Loading을 적용시켜놔서 (아마 Next.js를 사용해서 그러지 않을까) 스크롤을 하지 않는한 페이지가 완전히 로딩되지 않는다.

또한, 내가 필요한 3가지 요소들 역시 `<button>` 태그를 눌러서 데이터를 로딩하지 않으면 최대 10개의 데이터만 로딩되는 문제가 있었다.

```shall
🕵️ Scout: 왓챠피디아 메인 페이지 탐색 시작...
⬇️ 페이지 데이터를 로딩하기 위해 스크롤 중...
👉 섹션 찾는 중: '박스오피스 순위'...
✅ 발견된 컨텐츠: 145개 -> 상위 10개만 수집
👉 섹션 찾는 중: '왓챠 Top 10 영화'...
✅ 발견된 컨텐츠: 145개 -> 상위 10개만 수집
```

이러한 문제들을 위해 Playwright의 DOM 조작 함수들을 적극적으로 활용했다.

```python
from playwright.async_api import async_playwright, Page, Locator
# 부드러운 스크롤 함수 (세로)
async def slow_scroll(page: Page):
    print("   ⬇️ 페이지 데이터를 로딩하기 위해 스크롤 중...")
    for _ in range(5): # 5번으로 나눠 스크롤
        await page.mouse.wheel(0, 1000) # 아래로 1000px
        await page.wait_for_timeout(1000) # 로딩 대기 1초

# 내가 찾은 section 위치로 화면 이동 (Focus)
await section.scroll_into_view_if_needed()

# 스크롤 버튼 클릭 함수(가로)
async def click_next_buttons(section_locator: Locator):
    try:
        # title="right" 속성을 가진 버튼 찾기
        next_btn = section_locator.locator('button[title="right"]')
        
        # 버튼이 아예 없는 섹션일 수도 있으니 체크
        if await next_btn.count() == 0:
            return

        print("      ➡️ 데이터 로딩을 위해 'Next' 버튼 클릭 중...")

        # 최대 5번 클릭 (Top 30 기준 충분)
        for i in range(5):
            # 버튼이 화면에 보이고 클릭 가능한 상태인지 확인
            if await next_btn.is_visible():
                await next_btn.click()
                await asyncio.sleep(1.0) # 슬라이드 애니메이션 대기
            else:
                # 더 이상 오른쪽으로 갈 수 없으면 버튼이 사라질 수 있음
                break
                
    except Exception as e:
        print(f"      ⚠️ 버튼 클릭 중 에러: {e}")
```

Playwright가 제공하는 JS 조작함수들 덕분에 브라우저를 원하는대로 조작하면서 데이터들을 전부 loading할 수 있었고, fetch하는 걸 확인할 수 있었다.

<figure>
    <img src="/images/cw2.png" alt="중복되지 않은 영화 데이터들을 반환하는 모습" />
    <figcaption><b>중복되지 않은</b> 영화 데이터들을 제대로 반환하는 걸 볼 수 있다.</figcaption>
</figure>

#### 영화 리뷰를 크롤링하는 코드
이제 제공받은 `url`을 바탕으로 영화 리뷰를 크롤링할 코드를 작성해야 했다.

일단 어떤 태그를 기준으로 `locator` 함수를 작성해야 하는지 확인하기 위해서 '범죄도시4' 리뷰를 들어가봤다.

<figure>
    <img src="/images/wt4.png" alt="리뷰를 보기 위해선 로그인을 해야 한다." />
    <figcaption>리뷰 상세 페이지는 반드시 로그인을 요구했다.</figcaption>
</figure>

위와 같이 로그인 없이는 리뷰 상세 페이지에 들어가는 것조차 불가능했다.

<figure>
    <img src="/images/wt5.png" alt="그냥 영화 상세 페이지에서도 단 하나의 리뷰는 볼 수 없음." />
    <figcaption>단 하나의 리뷰도 로그인 없이는 볼 수 없는 걸 확인할 수 있었다.</figcaption>
</figure>

따라서 자동 로그인을 하는 함수를 만들어서 리뷰를 긁어오기 전에 로그인하도록 만들어야 했다.

정말 다행히도 나는 oauth를 사용해서 로그인하는 것이 아니라 순수하게 이메일 바탕으로된 계정이라서 비교적 난이도가 쉬운 편이었고,
Playwright는 로그인을 자동화하고, 로그인된 세션을 쿠키에 저장해 계속 우려먹는 기능이 잘 되어 있었다.

먼저 환경변수 파일(`.env`)에 계정 정보들을 입력한 후, 자동 로그인 코드를 구현할 예정이었다.

</details>

LLM과 대화를 통해 현재 구조가 불편하다는 걸 파악하고 대대적인 리팩토링을 하도록 결정했다.

대화 대용을 정리해서 요약하면 아래와 같다.

1. 현재 브라우저 조작(with Playwright)는 `wait_for_timeout()`와 같은 비동기 호출 함수를 매우 많이 유발하고(DOM이 생성될 때까지 안정화되도록 기다려야 하므로), 이로 인해 성능이 구리다.

2. 왓챠피디아와 같은 SPA은 Lazy Loading을 cursor/button를 이용해 api로 자연스럽게 구현해놓는 게 대부분이다. 실제로 영화탭에 들어간 뒤 개발자 도구에서 네트워크 탭의 `fetch/xhr`만 보면 스크롤 및 영화 리스트들을 차례로 넘겨볼 때마다 api가 호출되는 걸 확인할 수 있다.

3. 따라서 이러한 api와 응답 json 형식만 안다면 playwright를 이용한 브라우저 조작은 아예 사용할 필요가 없다. `httpx`를 사용해서 직접
api를 호출하고 응답만 빠르게 받아 저장하는 훨씬 효율 좋은 크롤링 코드를 만들 수 있다.

위와 같은 사고처리 과정에 따라 내 크롤링 함수를 API 응답 수준에서 데이터를 크롤링하는 코드로 대대적인 리팩토링을 하기로 결정했다. 그 과정에서 <b>상태머신</b>으로 리팩토링하여 훌륭한 유지보수와 예외 처리를 할 수 있도록 리팩토링을 하고자 했다.

