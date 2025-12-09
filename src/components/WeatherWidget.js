"use client"
import { useEffect,useState } from "react"
import { dfs_xy_conv } from "@/app/utils/positionConverter";

// 종로 3가 좌표
const SEOUL_CODE = { nx: '60', ny: '127' }

export default function WeatherWidget() {
    // 초기값 null
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // 디버깅 용 위치정보
    const [location, setLocation] = useState({lat: null, lng: null, x: null, y: null})

    // 날씨 가져오는 함수
    const fetchWeather = async (nx,ny) => {
        setLoading(true)
        setErrorMsg("")
        try {
            const now = new Date();
            // 예보용 kstDate
            const kstDate_Fcst = new Date(now.getTime() + (9 * 60 * 60 * 1000));
            // 실황용 kstDate
            const kstDate_Live = new Date(now.getTime() + (9 * 60 * 60 * 1000));
            console.log(`현재 시간(한국기준): ${kstDate.toISOString()}`)

            // 55분 이전에 요청할 경우 1시간 이전의 데이터 요청
            if (kstDate_Fcst.getUTCMinutes() < 50) {
                kstDate_Fcst.setUTCHours(kstDate_Fcst.getUTCHours() - 1);
            }

            // 20분 이전에 요청할 경우 1시간 이전의 데이터 요청
            if (kstDate_Live.getUTCMinutes() < 20) {
                kstDate_Live.setUTCHours(kstDate_Live.getUTCHours() - 1);
            }

            // 예보용
            const isoString = kstDate_Fcst.toISOString()
            const baseDate_Fcst = isoString.slice(0,10).replace(/-/g, "") // 20251201
            const baseTime_Fcst = isoString.slice(11,16).replace(':',"").padStart(2,'0')

            // 실황용
            const isoString_S = kstDate_S.toISOString()
            const baseDate_Live = isoString_S.slice(0,10).replace(/-/g, "")
            const baseTime_Live = isoString_S.slice(11,16).replace(':',"").padStart(2,'0')

            console.log(`예보 최종 요청 일시: ${baseDate_Fcst}, ${baseTime_Fcst}`);
            console.log(`실황 최종 요청 일시: ${baseDate_Live}, ${baseTime_Live}`)

            const queryParams = new URLSearchParams({
                baseDate_Live: baseDate_Live,
                baseTime_Live: baseTime_Live,
                baseDate_Fcst: baseDate_Fcst,
                baseTime_Fcst: baseTime_Fcst,
                nx: nx,
                ny: ny
            });

            // 이제 블로그 API 주소로 변경됌
            const res = await fetch(`/api/weather?${queryParams.toString()}`)
            if (!res.ok) throw new Error("❌ API 요청 실패!")
            const data = await res.json()
            // console.log(`✅ 가져온 데이터: ${data}`)
            const parsedData = getWeather(data)
            // 날씨 아이콘 정하기

            setWeather(parsedData)
        } catch (e) {
            console.debug(e);
            setErrorMsg("날씨 정보를 불러오지 못했습니다.")
        } finally {
            setLoading(false);
        }
    };

    // 1. 처음엔 반드시 서울(종로)날씨 로딩
    useEffect(() => {
        fetchWeather(SEOUL_CODE.nx,SEOUL_CODE.ny)
    },[])

    // 2. '내 위치 찾기' 버튼 핸들러
    const handleMyLocation = () => {
        if (!navigator.geolocation) {
            setErrorMsg("브라우저가 위치 정보를 지원하지 않습니다.")
            return;
        }

        // 브라우저 내장 팝업 트리거
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // 성공 시, 내 위치로 api 다시 호출
                const { latitude, longitude } = position.coords;

                // 위/경도 -> 격자(x,y)로 변환
                const rs = dfs_xy_conv("toXY", latitude, longitude);

                setLocation({ lat: latitude, lng: longitude, x: rs.x, y: rs.y })

                // 변환된 좌표로 날씨 API 호출
                fetchWeather(rs.x, rs.y);
            },
            (error) => {
                console.error(error);
                if (error.code === 1) setErrorMsg("위치 정보를 가져올 수 없어서 서울 종로 날씨를 보여드립니다.");
                else setErrorMsg("위치 정보를 가져올 수 없습니다.")
            })
    };

    return (
<div className="retro-box p-4 w-full">
            <div className="flex justify-between items-center mb-2 border-b-2 border-black/10 pb-2">
                <span className="font-bold text-sm">WEATHER.APP</span>
                {/* 내 위치 찾기 버튼 (GPS 아이콘) */}
                <button 
                    onClick={handleMyLocation}
                    className="hover:bg-gray-200 p-1 rounded transition-colors"
                    title="내 위치 날씨 보기"
                >
                    📍
                </button>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[100px]">
                {loading ? (
                    // 로딩 중일 때 (아까 만든 픽셀 로더 재활용 가능!)
                    <div className="animate-pulse text-xs">SEARCHING...</div>
                ) : weather ? (
                    // 날씨 정보 표시
                    <>
                        <div className="text-3xl font-[Galmuri9] mb-1">
                            {weather.temp}℃
                        </div>
                        <div className="text-xs text-gray-500">
                            {weather.locationName} {/* 예: 서울특별시 중구 */}
                        </div>
                        <div className="text-xs mt-2">
                            {weather.sky} / 습도 {weather.humidity}%
                        </div>
                    </>
                ) : (
                    // 에러 표시
                    <div className="text-xs text-red-500 text-center">
                        {errorMsg || "날씨 정보 없음"}
                    </div>
                )}
            </div>
            
            {/* 에러 메시지 토스트 (선택 사항) */}
            {errorMsg && (
                <div className="text-[10px] text-red-500 mt-2 text-center bg-red-50 p-1">
                    ! {errorMsg}
                </div>
            )}
        </div>
    )
}

// data를 기반으로 날씨를 판별하는 함수
function getWeather(data) {
    const item = data.response?.body?.items?.item;
    console.log("item 확인: ", item)
    if (!item) throw new Error("날씨 데이터 조회 결과 없음")
    // 정석적인 상황이라면, 0 = PTY(날씨 타입), 1 = REH(습도)
    // 3 = T1H(기온), 7 = WSD(풍속)

    const weatherMap = {};
    item.forEach(i => {
        // 각 정보가 6개씩 전달되며, 최신 ~ + 6까지 6개가 도착하므로 +1 정보 아니면 전부 패스
        if (weatherMap[i.category]) {
            continue
        }
        weatherMap[i.category] = i.fcstValue;
    });

    return {
        POP: parseInt(weatherMap['POP'] || 0), // POP
        PTY: parseInt(weatherMap['PTY'] || 0) // PTY
    }
}