// 브라우저 대신 기상청에 요청을 보낼 백엔드
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    // 클라이언트에서 보낸 쿼리 파라미터 받기 (날짜, 시간, 좌표 등)
    const baseDate_Fcst = searchParams.get('baseDate_Fcst')
    const baseTime_Fcst = searchParams.get('baseTime_Fcst')
    const baseDate_Live = searchParams.get('baseDate_Live')
    const baseTime_Live = searchParams.get('baseTime_Live')
    const baseDate_Srt = searchParams.get('baseDate_Srt')
    const baseTime_Srt = searchParams.get('baseTime_Srt')
    const nx = searchParams.get('nx')
    const ny = searchParams.get('ny')

    const SERVICE_KEY = process.env.WEATHER_API_KEY?.trim(); // 서버에서만 접근 가능한 환경 변수(디코딩 키)
    if (!SERVICE_KEY) return NextResponse.json({ error: 'API KEY 없음!' }, {status: 500})

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

    // 1. 초단기 실황 URL
    const url_live = makeUrl(
        "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",
        baseDate_Live,
        baseTime_Live,
        12
    )
    console.log(`초단기 실황 URL: ${url_live}`)

    // 2. 초단기 예보 URL
    const url_fcst = makeUrl(
        "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst",
        baseDate_Fcst,
        baseTime_Fcst,
        100
    )
    console.log(`초단기 예보 URL: ${url_fcst}`)

    // 3. 단기 예보 URL
    const url_srt = makeUrl(
        "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",
        baseDate_Srt,
        baseTime_Srt,
        200
    )
    console.log(`단기 예보 URL: ${url_srt}`);

    try {
        // Promise.all로 두 요청을 동시에 보냄(병렬)
        const [resLive, resFcst, resSrt] = await Promise.all([
            fetch(url_live, { next: { revalidate: 900 } }),
            fetch(url_fcst, { next: { revalidate: 900 } }),
            fetch(url_srt, { next: { revalidate: 900 } })
        ]);

        const errorCheck = async (res, name) => {
            if (!res.ok) {
                const errorText = await res.text();
                console.error(`🚨 ${name} API Error (${res.status}):`, errorText);
                throw new Error(`${name} API 요청 실패: ${res.status} ${errorText}`);            
            }
            return res.text() // 바로 json하지 않고 text()로 받아서 로그 기록
        }

        const textLive = await errorCheck(resLive, "초단기실황");
        const textFcst = await errorCheck(resFcst, "초단기예보");
        const textSrt = await errorCheck(resSrt, "단기예보");

        console.debug("----- [디버깅 로그 시작] -----");
        console.debug("1. 초단기실황 원본:", textLive.substring(0, 200)); // 너무 길면 자름
        console.debug("2. 초단기예보 원본:", textFcst.substring(0, 200));
        console.debug("3. 단기예보 원본:", textSrt.substring(0, 200));
        console.debug("----- [디버깅 로그 끝] -----");

        // 텍스트를 다시 JSON으로 변환
        const liveData = JSON.parse(textLive)
        const fcstData = JSON.parse(textFcst)
        const srtData = JSON.parse(textSrt)

        // 셋 중 하나라도 실패하면 오류
        if (liveData.response?.header?.resultCode !== '00' || fcstData.response?.header?.resultCode !== '00' || srtData.response?.header?.resultCode !== '00') {
            console.debug("초단기실황 resultCode: ", liveData.response?.header?.resultCode);
            console.debug("초단기예보 resultCode: ", fcstData.response?.header?.resultCode);
            console.debug("단기예보 resultCode: ", srtData.response?.header?.resultCode);
            return NextResponse.json({ error: '기상청 API 오류: resultCode' }, { status: 500 })
        }
            

        const parsedData = parseWeatherData(
            liveData.response.body.items.item,
            fcstData.response.body.items.item,
            srtData.response.body.items.item,
        )

        return NextResponse.json(parsedData, {
            headers: {
                // public: 모든 사람(브라우저, CDN)이 캐싱 가능
                // s-maxage=900: CDN(Vercel) 서버에 900초(15분) 동안 저장
                // stale-while-revalidate=30: 캐시가 만료돼도 30초 동안은 일단 옛날 거 보여주고 뒤에서 갱신 (속도 향상)
                'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=30'
            }
        })
    } catch (e) {
        console.debug(e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

// data를 기반으로 날씨를 판별하는 함수
function parseWeatherData(liveItems, fcstItems, srtItems) {
    const now = new Date()
    const kstAbs = now.getTime() + (9 * 60 * 60 * 1000)
    
    const baseDate = new Date(kstAbs).toISOString().slice(0,10).replace(/-/g, "")

    // 1. 실황 데이터
    const liveMap = {}
    liveItems.forEach(item => {
        liveMap[item.category] = Number(item.obsrValue);
    });

    // 2. 예보 데이터(SKY,LGT 추출)
    const fcstMap = {}
    // 예보 데이터에서 가장 빠른 시간대만 추출
    fcstItems.forEach((item) => {
        // 이미 있다면 pass
        if (!fcstMap[item.category]) fcstMap[item.category] = Number(item.fcstValue);
    })

    // 3. 단기 예보 데이터(TMX(최고), TMN(최저))
    let tmxValue = 0
    let tmnValue = 0
    console.log("baseDate: ", baseDate);
    
    srtItems.forEach((item) => {
        // 오늘 날짜만 확인
        if (item.fcstDate === baseDate) {
            if (item.category === 'TMX') {
                tmxValue = Number(item.fcstValue);
                console.log("tmx: ", item.fcstValue);
                
            }
            if (item.category === 'TMN') {
                tmnValue = Number(item.fcstValue);
                console.log("tmn: ", item.fcstValue);
                
            }
        }
    })
    
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