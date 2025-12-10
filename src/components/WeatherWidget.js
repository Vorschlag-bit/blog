"use client"
import { useEffect,useState } from "react"
import { dfs_xy_conv } from "@/app/utils/positionConverter";
import WeatherIcon from "./WeatherIcon";
import Image from "next/image";

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
    const fetchWeather = async (nx,ny, locationName = "서울 종로구") => {
        setLoading(true)
        setErrorMsg("")
        try {
            const now = new Date();
            // 9시간 더하기
            const kstAbs = now.getTime() + (9 * 60 * 60 * 1000);

            // 객체 2개 생성
            const kstDate_Live = new Date(kstAbs); // 실황용
            const kstDate_Fcst = new Date(kstAbs); // 예보용

            console.log(`현재 시간(KST): ${kstDate_Live.toISOString()}`)

            // 실황은 20분 전
            if (kstDate_Live.getUTCMinutes() < 20) kstDate_Live.setUTCHours(kstDate_Live.getUTCHours() - 1);

            // 예보는 55분 전
            if (kstDate_Fcst.getUTCHours() < 55) kstDate_Fcst.setUTCHours(kstDate_Fcst.getUTCHours() - 1);

            // 문자열 변환 함수
            const formatDate = (date) => {
                const iso = date.toISOString();
                return {
                    date: iso.slice(0, 10).replace(/-/g, ""),
                    time: iso.slice(11, 16).replace(':',"")
                }
            }

            const liveParams = formatDate(kstDate_Live);
            const fcstParams = formatDate(kstDate_Fcst);

            console.log("실황요청: ", liveParams)
            console.log("예보요청: ", fcstParams)

            const queryParams = new URLSearchParams({
                baseDate_Live: liveParams.date,
                baseTime_Live: liveParams.time,
                baseDate_Fcst: fcstParams.date,
                baseTime_Fcst: fcstParams.time,
                nx: nx,
                ny: ny
            });

            // 이제 블로그 API 주소로 변경됌
            const res = await fetch(`/api/weather?${queryParams.toString()}`)
            if (!res.ok) throw new Error("❌ API 요청 실패!")

            const data = await res.json()            

            // 데이터 파싱
            const parsedData = parseWeatherData(data.live, data.fcst);
            console.log("parsedDate: ", parsedData);
            

            // 날씨 아이콘 정하기

            setWeather({
                ...parsedData,
                locationName: locationName
            })
        } catch (e) {
            console.debug(e);
            setErrorMsg("날씨 정보를 불러오지 못했습니다.")
        } finally {
            setLoading(false);
        }
    };

    // 1. 처음엔 반드시 서울(종로)날씨 로딩
    useEffect(() => {
        fetchWeather(SEOUL_CODE.nx,SEOUL_CODE.ny, "서울 종로구")
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
                fetchWeather(rs.x, rs.y, "내 위치");
            },
            (error) => {
                console.error(error);
                if (error.code === 1) setErrorMsg("위치 정보를 가져올 수 없어서 서울 종로 날씨를 보여드립니다.");
                else setErrorMsg("위치 정보를 가져올 수 없습니다.")
            })
    };

    return (
        // 일단 보여주고 싶은 건 온도, 위치, 날씨만 해보기
        <div className="retro-box p-4 w-[120%] -ml-5 min-h-[160px] bg-gray-100 relative">
            {/** Header */}
            <div className="flex justify-between items-center mb-2 border-b-2 border-black/10 pb-2">
                <span className="font-bold text-sm tracking-widest">WEATHER.APP</span>
                            {/* 내 위치 찾기 버튼 (GPS 아이콘) */}
                <button 
                    onClick={handleMyLocation}
                    className="hover:bg-gray-200 p-1 rounded transition-colors"
                    title="내 위치 날씨 보기"
                >
                    {/* GPS 아이콘 */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </button>
            </div>

            <div className="flex justify-center min-h-[100px]">
                {loading ? (
                    // 로딩 중일 때
                    <div className="animate-pulse text-xs">SEARCHING...</div>
                ) : weather ? (
                    // 날씨 정보 표시
                    <div className="flex flex-col">
                        <div className="relative w-40 h-40 flex-shrink-0 drop-shadow-sm">
                            <WeatherIcon 
                                pty={weather.PTY}
                                sky={weather.SKY}
                                lgt={weather.LGT}
                            />
                        </div>
                        <div className="">
                            <div className="text-3xl font-[Galmuri9] mb-1">
                                {weather.temperature}℃
                            </div>
                            <div className="text-xs text-gray-500">
                                {weather.locationName} {/* 예: 서울특별시 중구 */}
                            </div>
                            <div className="text-xs mt-2 flex items-center">
                                <span>습도 {weather.humidity}</span>
                                <Image 
                                    src="/icons/humidity.svg"
                                    alt="습도 아이콘"
                                    width={50}
                                    height={50}
                                />
                            </div>
                        </div>
                    </div>
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
function parseWeatherData(liveItems, fcstItems) {
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
    
    return {
        temperature: liveMap['T1H'], // 실황 기온
        humidity: liveMap['REH'],    // 실황 습도
        wind: liveMap['WSD'],        // 실황 풍속
        PTY: liveMap['PTY'],         // 실황 강수상태 (0: 없음, 1: 비, 2: 눈/비, 3:눈, 5: 빗방울, 6: 빗방울 날림, 7: 눈날림)
        SKY: fcstMap['SKY'],         // 예보 하늘 상태
        LGT: fcstMap['LGT'] > 0      // 예보 낙뢰 여부
    };
}