"use server"

interface getAreaParams {
    lng: string;
    lat: string
}

// API 응답 구조 정의
interface VWORLDResult {
    text: string;
}

interface VWORLDResponse {
    response: {
        status: string;
        result?: VWORLDResult[];
        error?: {
            text: string;
        }
    }
}

/**
 * 위/경도를 기반으로 VWORLD에서 사용자 위치 정보를 return 하는 함수입니다.
 * 문자열 --시 --구 --동 중 --구 --동을 return합니다.
 */
export default async function getArea({ lng,lat }: getAreaParams) {    
    if (!lat || !lng) {
        console.error('좌표 누락 - lng/lag가 없음: ', lng,lat);
        return ""
    }

    const SERVICE_KEY = (process.env.VWORLD_API_KEY ?? "").trim();

    if (SERVICE_KEY === "") throw Error("VWORLD API KEY ABSENT")

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
            cache: "no-store"
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`브이월드 위치 정보 API Error (${res.status}):`, errorText);
            throw new Error("위치 정보 API 요청 실패")
        }

        // 마찬가지로 text -> json으로 수정
        const text = await res.text();

        // console.log('response:', text);
        
        
        let data: VWORLDResponse;

        try {
            // 안전한 파싱
            data = JSON.parse(text) as VWORLDResponse;
        } catch (e) {
            console.error("VWORLD 파싱 에러 원본: ", text)
            throw e
        }

        if (data.response?.status !== "OK") {
            console.error("위치 정보 API status != OK", data.response?.status)
            return ""
        }

        const addr = parseAreaData(data)

        return addr
    } catch (e) {
        console.error(e);
    }
}

function parseAreaData(data: VWORLDResponse): string {
    // data.response.result[0].text
    const addr = data.response?.result?.[0]?.text ?? "";
    // text 형식: 서울시 --구 --동 지번
    if (addr) {
        const sp = addr.split(' ')

        if (sp.length >= 3)
            return `${sp[1]} ${sp[2]}`;
        return addr;
    }
    return "";
}