// 브라우저 대신 기상청에 요청을 보낼 백엔드
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    // 클라이언트에서 보낸 쿼리 파라미터 받기 (날짜, 시간, 좌표 등)
    const baseDate = searchParams.get('base_date')
    const baseTime = searchParams.get('base_time')
    const nx = searchParams.get('nx')
    const ny = searchParams.get('ny')

    const SERVICE_KEY = process.env.WEATHER_API_KEY; // 서버에서만 접근 가능한 환경 변수

    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

    try {
        const res = await fetch(url);
        const data = await res.json()
        return NextResponse.json(data)
    } catch (e) {
        return NextResponse.json({ error: '❌ Failed to fetch weather data' }, { status: 500 })
    }
}