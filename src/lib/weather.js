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
export default async function getWeather({ cx, cy, type="xy" }) {    
    // 서비스 키
    const SERVICE_KEY = process.env.WEATHER_API_KEY?.trim()
    if (!SERVICE_KEY) {
        console.error(`WEATHER_API_KEY 부재`);
        return null
    }

    let nx = cx
    let ny = cy
    if (type !== "xy") {
        const { x,y } = dfs_xy_conv("toXY",cx,cy)
        nx = x
        ny = y
    }

    // 날짜 계산
    const { baseDate_Fcst,baseTime_Fcst,baseDate_Live,baseTime_Live,baseDate_Srt,baseTime_Srt } = get_currentTime()
    // x,y를 기반으로 날씨 조회
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

        return url.toString();
    }

    // 1. 초단기 실황 URL
    const url_live = makeUrl(
        "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",
        baseDate_Live,
        baseTime_Live,
        12
    )
    // console.log(`초단기 실황 URL: ${url_live}`)

    // 2. 초단기 예보 URL
    const url_fcst = makeUrl(
        "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst",
        baseDate_Fcst,
        baseTime_Fcst,
        100
    )
    // console.log(`초단기 예보 URL: ${url_fcst}`)

    // 3. 단기 예보 URL
    const url_srt = makeUrl(
        "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",
        baseDate_Srt,
        baseTime_Srt,
        200
    )
    // console.log(`단기 예보 URL: ${url_srt}`);

    try {
        const [resLive, resFcst, resSrt] = await Promise.all([
            fetch(url_live, { next: { revalidate: 600 } }),
            fetch(url_fcst, { next: { revalidate: 600 } }),
            fetch(url_srt, { next: { revalidate: 900 } })
        ])

        // res 상태 체크 및 안전한 Json 파싱 함수(text -> json)
        const errorCheck = async (res, name) => {
            if (!res.ok) {
                const errorText = await res.text();
                console.error(`${name} API Error (${res.status}):`, errorText);
                throw new Error(`${name} API 요청 실패: ${res.status}`);
            }
            const text = await res.text();
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error("API 응답이 JSON 형식이 아님: ", text.substring(0,100));
                throw new Error('잘못 형식의 응답 도착(Not Json)')
            }
        }

        const liveData = await errorCheck(resLive, "초단기실황")
        const fcstData = await errorCheck(resFcst, "초단기예보")
        const srtData = await errorCheck(resSrt, "단기예보")

        // console.log('liveData: ', liveData);
        // console.log('fcstData: ', fcstData);
        // console.log('srtData: ', srtData);
        

        // 셋 중 하나라도 실패하면 오류
        if (liveData.response?.header?.resultCode !== '00' || fcstData.response?.header?.resultCode !== '00' || srtData.response?.header?.resultCode !== '00') {
            console.error("API Error - header.resultCodes(초단기실황,초단기예보,단기예보 순):", 
                liveData.response?.header?.resultCode,
                fcstData.response?.header?.resultCode,
                srtData.response?.header?.resultCode
            );

            return null
        }

        const parsedData = parseWeatherData(
            liveData.response.body.items.item,
            fcstData.response.body.items.item,
            srtData.response.body.items.item,
        )

        return parsedData
    } catch (err) {
        console.debug(`weather api debug: `, err);
        return null
    }
}

function get_currentTime() {
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

    // 문자열 변환 함수
    const formatDate = (date) => {
        const iso = date.toISOString();
        return {
            date: iso.slice(0, 10).replace(/-/g, ""),
            // 시간을 10분 단위로 만들어서 cache hit 높이기
            time: iso.slice(11, 15).replace(':',"") + "0"
        }
    }

    const liveParams = formatDate(kstDate_Live);
    const fcstParams = formatDate(kstDate_Fcst);
    const srtParams = formatDate(kstDate_Srt);

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
    // console.log("baseDate: ", baseDate);
    
    srtItems.forEach((item) => {
        // 오늘 날짜만 확인
        if (item.fcstDate === baseDate) {
            if (item.category === 'TMX') {
                tmxValue = Number(item.fcstValue);
                // console.log("tmx: ", item.fcstValue);
            }
            if (item.category === 'TMN') {
                tmnValue = Number(item.fcstValue);
                // console.log("tmn: ", item.fcstValue);
                
            }
        }
    })

    // 아이콘 이름 결정 로직 추가
    // 1. 현재 시간을 기준으로 밤낮 계산
    const currentHour = new Date(kstAbs).getHours()
    const isNight = currentHour >= 19 || currentHour < 6
    const pty = liveMap['PTY']
    const sky = fcstMap['SKY']
    const lgt = fcstMap['LGT'] > 0

    const iconName = getWeatherIcon(pty,sky,lgt,isNight)
    
    return {
        temperature: liveMap['T1H'].toFixed(1), // 실황 기온
        tmx: tmxValue.toFixed(1),               // 최고 기온
        tmn: tmnValue.toFixed(1),               // 최저 기온
        humidity: liveMap['REH'],    // 실황 습도
        wind: liveMap['WSD'],        // 실황 풍속
        PTY: liveMap['PTY'],         // 실황 강수상태 (0: 없음, 1: 비, 2: 눈/비, 3:눈, 5: 빗방울, 6: 빗방울 날림, 7: 눈날림)
        SKY: fcstMap['SKY'],         // 예보 하늘 상태
        LGT: fcstMap['LGT'] > 0,     // 예보 낙뢰 여부
        location: '종로구 송월동',     // 기본값으로 위치 제공하고, setWeather에서 덮어씀
        iconName: iconName
    };
}

/**
 * param을 바탕으로 날씨 아이콘 문자열을 return 하는 함수입니다.
 * @param { number } pty - 강수형태 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 5: 빗방울, 6: 진눈깨비, 7: 눈날림)
 * @param { number } sky - 하늘상태 (1: 맑음, 3: 구름 많음, 4: 흐림)
 * @param { boolean } lgt - 낙뢰여부 (true/false) - 초단기예보 LGT 값 > 0이면 true else false
 * @param { boolean } isNight - 밤 여부 (true/false) - 현재 시간이 17:00 이상이면 true else false
 */
function getWeatherIcon(pty, sky, lgt, isNight) {
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