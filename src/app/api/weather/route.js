// 브라우저 대신 기상청에 요청을 보낼 백엔드
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    // 클라이언트에서 보낸 쿼리 파라미터 받기 (날짜, 시간, 좌표 등)
    const baseDate_Fcst = searchParams.get('baseDate_Fcst')
    const baseTime_Fcst = searchParams.get('baseTime_Fcst')
    const baseDate_Live = searchParams.get('baseDate_Live')
    const baseTime_Live = searchParams.get('baseTime_Live')
    const nx = searchParams.get('nx')
    const ny = searchParams.get('ny')

    const SERVICE_KEY = process.env.WEATHER_API_KEY; // 서버에서만 접근 가능한 환경 변수

    // 1. 초단기 실황 URL
    const url_live = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=12&dataType=JSON&base_date=${baseDate_Live}&base_time=${baseTime_Live}&nx=${nx}&ny=${ny}`;
    console.log(`url입니다: ${url}`)

    // 2. 초단기 예보 URL
    const url_fcst = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=12&dataType=JSON&base_date=${baseDate_Fcst}&base_time=${baseTime_Fcst}&nx=${nx}&ny=${ny}`;

    try {
        // Promise.all로 두 요청을 동시에 보냄(병렬)
        const [resLive, resFcst] = await Promise.all([
            fetch(url_live),
            fetch(url_fcst)
        ]);

        const liveData = await resLive.json();
        const fcstData = await resFcst.json();

        // 둘 중 하나라도 실패하면 오류
        if (liveData.response?.header?.resultCode !== '00' || fcstData.response?.header?.resultCode !== '00')
            return NextResponse.json({ error: '기상청 API 오류' }, { status: 500 })

        return NextResponse.json({
            live: liveData.response.body.items.item,
            fcst: fcstData.response.body.items.item
        });
    } catch (e) {
        console.debug(e)
        return NextResponse.json({ error: '❌ Failed to fetch weather data' }, { status: 500 })
    }
}