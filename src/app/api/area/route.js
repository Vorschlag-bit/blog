import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const lng = searchParams.get('lng')
    const lat = searchParams.get('lat')

    const SERVICE_KEY = process.env.VWORLD_API_KEY;

    const url = `https://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=${lng},${lat}&format=json&type=PARCEL&zipcode=true&simple=false&key=${SERVICE_KEY}`
    // console.log(`위치 지역 url: ${url}`);
    console.log("🔥 위치 API 호출됨! (캐시가 없거나 만료됨)");
    
    try {
        const res = await fetch(url, { next: { revalidate: 600 } });

        const data = await res.json();

        if (data.response?.status !== "OK")
            return NextResponse.json({ error: '장소 조회 API 에러' }, { status: 404 })

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