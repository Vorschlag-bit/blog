import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const lng = searchParams.get('lng')
    const lat = searchParams.get('lat')

    if (!lng || !lat) {
        console.error("좌표 누락: lng/lat이 없음.");
        return NextResponse.json({ error: '좌표값 누락' }, { status: 400 });
    }

    // console.log(`lng: ${lng}, lat: ${lat}`)

    const SERVICE_KEY = process.env.VWORLD_API_KEY.trim();
    const url = new URL("https://api.vworld.kr/req/address")
    url.searchParams.append("service", "address")
    url.searchParams.append("request", "getAddress")
    url.searchParams.append("version", "2.0")
    url.searchParams.append("crs", "epsg:4326")
    url.searchParams.append("point", `${lng},${lat}`)
    url.searchParams.append("format", "json")
    url.searchParams.append("type", "PARCEL")
    url.searchParams.append("zipcode", "true")
    url.searchParams.append("simple", "false")
    url.searchParams.append("key", `${SERVICE_KEY}`)
    // console.log(`위치 지역 url: ${url}`);
    // console.log("🔥 위치 API 호출됨! (캐시가 없거나 만료됨)");

    
    try {
        const res = await fetch(url, { 
            next: { revalidate: 900 } 
        });

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
            console.error("VWORLD 파싱 에러 원본: ", text)
            throw new Error("위치 조회 API 응답 형식 오류(Not Json)")
        }

        if (data.response?.status !== "OK") {
            console.error("위치 정보 API status != OK", data.response?.status)
            return NextResponse.json({ error: '장소 조회 실패' }, { status: 404 })
        }

        const addr = parseAreaData(data)

        if (!addr) 
            return NextResponse.json({error: '장소 조회 결과 없음'}, { status: 500 })

        return NextResponse.json({ addr: addr }, {
            headers: {
                'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=30'
            }
        })
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: '❌ Failed to fetch area data' }, { status: 500 })
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