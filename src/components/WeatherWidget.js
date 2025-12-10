"use client"
import { useEffect,useState } from "react"
import { dfs_xy_conv } from "@/app/utils/positionConverter";
import WeatherIcon from "./WeatherIcon";

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
    const fetchWeather = async (nx,ny, locationName = "종로구 송월동") => {
        setLoading(true)
        setErrorMsg("")
        try {
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
                    time: iso.slice(11, 16).replace(':',"")
                }
            }

            const liveParams = formatDate(kstDate_Live);
            const fcstParams = formatDate(kstDate_Fcst);
            const srtParams = formatDate(kstDate_Srt);

            // console.log("실황요청: ", liveParams)
            // console.log("예보요청: ", fcstParams)
            // console.log("단기예보 요청: ", srtParams);
            

            const queryParams = new URLSearchParams({
                baseDate_Live: liveParams.date,
                baseTime_Live: liveParams.time,
                baseDate_Fcst: fcstParams.date,
                baseTime_Fcst: fcstParams.time,
                baseDate_Srt: srtParams.date,
                baseTime_Srt: srtParams.time,
                nx: nx,
                ny: ny
            });

            // 이제 블로그 API 주소로 변경됌
            const res = await fetch(`/api/weather?${queryParams.toString()}`)
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error("기상청 API 요청 실패!" || errorData.error)
            }

            const data = await res.json()        

            // 데이터 파싱
            // console.log("parsedDate: ", data);

            setWeather({
                ...data,
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
        fetchWeather(SEOUL_CODE.nx,SEOUL_CODE.ny, "종로구 송월동")
    },[])

    // 2. '내 위치 찾기' 버튼 핸들러
    const handleMyLocation = () => {
        if (!navigator.geolocation) {
            setErrorMsg("브라우저가 위치 정보를 지원하지 않습니다.")
            return;
        }

        // 로딩 시작
        setLoading(true);

        // 브라우저 내장 팝업 트리거
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                // 성공 시, 내 위치로 api 다시 호출
                const { latitude, longitude } = position.coords;
                let locationName = "내 위치"

                try {
                    const queryParams = new URLSearchParams({
                    lng: longitude.toString(),
                    lat: latitude.toString()
                    })

                    // 블로그 API로 요청
                    const result = await fetch(`/api/area?${queryParams.toString()}`)
                
                    if (result.ok) {
                        const data = await result.json();
                        if (data.addr) locationName = data.addr
                    } else {
                        console.warn("주소 조회 API 실패, 기본 이름(종로구) 사용");
                    }
                } catch (err) {
                    console.error("주소 파싱 중 에러 발생: ", err);
                }

                // 위/경도 -> 격자(x,y)로 변환
                const rs = dfs_xy_conv("toXY", latitude, longitude);

                setLocation({ lat: latitude, lng: longitude, x: rs.x, y: rs.y })

                // 변환된 좌표로 날씨 API 호출
                fetchWeather(rs.x, rs.y, locationName);
            },
            (error) => {
                console.error(error);
                setLoading(false)
                if (error.code === 1) setErrorMsg("위치 정보를 가져올 수 없어서 서울 종로 날씨를 보여드립니다.");
                else setErrorMsg("위치 정보를 가져올 수 없습니다.")
            })
    };

    return (
        // 일단 보여주고 싶은 건 온도, 위치, 날씨만 해보기
        <div className="retro-box p-4 w-[120%] -ml-5 min-h-[160px] relative">
            {/** Header */}
            <div className="flex justify-between items-center border-b-2 border-black/15 dark:border-white/15 pb-2 ml-2">
                <span className="font-bold text-sm tracking-widest ml-1">WEATHER.APP</span>
                            {/* 내 위치 찾기 버튼 (GPS 아이콘) */}
                <button 
                    onClick={handleMyLocation}
                    className="hover:bg-gray-200 p-1 rounded transition-colors"
                    title="내 위치 날씨 보기"
                >
                    {/* GPS 아이콘 */}
                    <svg className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M13 2v4h5v5h4v2h-4v5h-5v4h-2v-4H6v-5H2v-2h4V6h5V2h2zM8 8v8h8V8H8zm2 2h4v4h-4v-4z" fill="currentColor"/> </svg>
                </button>
            </div>
            <div className="flex justify-center min-h-[100px]">
                {loading ? (
                    // 로딩 중일 때
                    <div className="animate-pulse text-lg font-bold dark:text-white-500 mt-15">SEARCHING...</div>
                ) : weather ? (
                    // 날씨 정보 표시
                    <div className="flex flex-col">
                        <div className="relative w-50 h-50 flex-shrink-0 drop-shadow-sm">
                            <WeatherIcon 
                                pty={weather.PTY}
                                sky={weather.SKY}
                                lgt={weather.LGT}
                            />
                        </div>
                        <div className="flex items-center gap-7">
                            <div className="flex-col ml-4">
                                <div className="text-4xl font-[Galmuri9] mb-2 tracking-tighter min-w-[5rem]">
                                    {weather.temperature}℃
                                </div>
                                <div className="text-xs text-gray-500">
                                    {weather.locationName} {/* 예: 서울특별시 중구 */}
                                </div>
                            </div>
                            <div className="flex flex-col items-start">
                                {/** 최고 */}
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-200">
                                    <span className="text-red-500 font-bold mr-1">최고</span>
                                    {weather.tmx}℃
                                </div>
                                {/** 최저 */}
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-200">
                                    <span className="text-blue-500 font-bold mr-1">최저</span>
                                    {weather.tmn}℃
                                </div>
                                {/** 습도 */}
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-200">
                                    <span className="text-blue-400 font-bold mr-1">습도</span>
                                    {weather.humidity}%
                                </div>
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
            
            {/* 에러 메시지 토스트 */}
            {errorMsg && (
                <div className="text-[10px] text-red-500 mt-2 text-center bg-red-50 p-1">
                    ! {errorMsg}
                </div>
            )}
        </div>
    )
}