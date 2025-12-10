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

    const SERVICE_KEY = process.env.WEATHER_API_KEY; // 서버에서만 접근 가능한 환경 변수

    // 1. 초단기 실황 URL
    const url_live = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=12&dataType=JSON&base_date=${baseDate_Live}&base_time=${baseTime_Live}&nx=${nx}&ny=${ny}`;
    // console.log(`url_live입니다: ${url_live}`)

    // 2. 초단기 예보 URL
    const url_fcst = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${baseDate_Fcst}&base_time=${baseTime_Fcst}&nx=${nx}&ny=${ny}`;

    // 3. 단기 예보 URL
    const url_srt = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=200&dataType=JSON&base_date=${baseDate_Srt}&base_time=${baseTime_Srt}&nx=${nx}&ny=${ny}`;
    // console.log(`단기 예보 URL: ${url_srt}`);
    

    try {
        // Promise.all로 두 요청을 동시에 보냄(병렬)
        const [resLive, resFcst, resSrt] = await Promise.all([
            fetch(url_live, { next: { revalidate: 900 } }),
            fetch(url_fcst, { next: { revalidate: 900 } }),
            fetch(url_srt, { next: { revalidate: 900 } })
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
        console.debug(e)
        return NextResponse.json({ error: '❌ Failed to fetch weather data' }, { status: 500 })
    }
}

// data를 기반으로 날씨를 판별하는 함수
function parseWeatherData(liveItems, fcstItems, srtItems, baseDate) {
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
    srtItems.forEach((item) => {
        // 오늘 날짜만 확인
        if (item.fcstDate === baseDate) {
            if (item.category === 'TMX') tmxValue = Number(item.fcstValue);
            if (item.category === 'TMN') tmnValue = Number(item.fcstValue);
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