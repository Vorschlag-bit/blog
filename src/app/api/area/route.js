import { NextResponse } from "next/server";

export default async function getArea(request) {
    const { searchParams } = new URL(request.url)
    const lng = searchParams.get('longitude')
    const lat = searchParams.get('latitude')

    const SERVICE_KEY = process.env.VWORLD_API_KEY;

    const url = `https://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=${lng},${lat}&format=json&type=PARCEL&zipcode=true&simple=false&key=${SERVICE_KEY}`

    try {
        const res = fetch(url);

        const data = await res.json();
        if (data.response?.status !== "OK")
            return NextResponse.json({ error: '장소 조회 API 에러' }, { status: 500 })
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: '❌ Failed to fetch area data' }, { status: 500 })
    }
}