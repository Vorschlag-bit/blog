"use client"
import { useState } from "react"
import getWeather from "@/app/action/weather";
import { getArea } from "@/app/action/area";
import Image from "next/image";
import { WeatherData } from "@/types/weather_type";
import { weatherIconMap } from "@/assets/index/weatherIndex";

// props는 객체고, 내가 구조분해 할당으로 받는 건 key이기 때문에 타입을 한 번 더 감싸야 함
interface WeatherWidgetProps {
    initialData: WeatherData | null;
}

export default function WeatherWidget({ initialData }: WeatherWidgetProps) {    
    // 초기값 initialData
    const [weather, setWeather] = useState<WeatherData | null>(initialData);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // 내 위치 찾기 버튼을 누를 경우, useEffect로 화면 리렌더링해야 하나?
    // 그럼 useState로 날씨 정보는 계속 관리해야 하는 듯?

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
                try {
                    // 성공 시, 내 위치로 api 다시 호출
                    const { latitude, longitude } = position.coords;
                    // cache hit 관측을 위해 애초에 클라이언트에서 소수점 3자리(버림)으로 params 보내기
                    const lat = latitude.toFixed(5)
                    const lng = longitude.toFixed(5)
                    
                    // Promise.all로 병렬 요청
                    const [fetchedWeather,fetchedArea] = await Promise.all([
                        getWeather({ cx: lat, cy: lng, type: "latlng" }),
                        getArea({ lat: lat, lng: lng })
                    ])
                    
                    if (!fetchedWeather) throw Error(`기상청 API 조회 실패 - ${fetchedWeather}`)

                    setWeather({
                        ...fetchedWeather,
                        location: fetchedArea || "현 위치"
                    })

                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false)
                }
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
        <div className="retro-box w-[115%] pt-4 -ml-6 h-[21rem] relative">
            {/** Header */}
            <div className="relative z-10 w-full flex justify-between items-center border-b-2 border-black/15 dark:border-white/15 pb-2">
                <span className="font-bold text-sm tracking-widest ml-1">WEATHER.APP</span>
                            {/* 내 위치 찾기 버튼 (GPS 아이콘) */}
                <button 
                    onClick={handleMyLocation}
                    className="hover:bg-gray-200 dark:hover:bg-gray-500 p-1 rounded transition-colors"
                    title="내 위치 날씨 보기"
                >
                    {/* GPS 아이콘 */}
                    <svg className="w-4 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M13 2v4h5v5h4v2h-4v5h-5v4h-2v-4H6v-5H2v-2h4V6h5V2h2zM8 8v8h8V8H8zm2 2h4v4h-4v-4z" fill="currentColor"/> </svg>
                </button>
            </div>
            <div className="flex-1 w-full">
                {loading ? (
                    // 로딩 중일 때
                    <div className="flex flex-col items-center -mt-7">
                        <div className="relative w-64 h-64">
                            <Image
                                src={weatherIconMap['windsock']}
                                alt='데이터 로딩 중 아이콘'
                                fill
                                className="object-contain"
                                priority={true}
                                fetchPriority="high"
                            />
                        </div>
                        <p className="animate-pulse text-lg font-bold dark:text-white-500 -mt-10">SEARCHING...</p>
                    </div>
                ) : weather ? (
                    // 날씨 정보 표시
                    <div className="flex flex-col items-center">
                        <div className="w-64 h-64 drop-shadow-sm -mt-5">
                            {/* 날씨 아이콘 동적으로 주입받음 */}
                            <Image 
                                src={weatherIconMap[weather.iconName]}
                                alt={weather.iconName}
                                fill
                                className="object-contain"
                                priority={true}
                                fetchPriority="high"
                                sizes="(max-width: 768px) 100vw, 256px"
                            />
                        </div>
                        <div className="flex items-center gap-7 -mt-5">
                            <div className="flex-col ml-4">
                                <div className="text-4xl font-galmuri9 mb-2 tracking-tighter min-w-[5rem]">
                                    {weather.temperature}℃
                                </div>
                                <div className="text-xs text-gray-500">
                                    {weather.location} {/* 예: 서울특별시 중구 */}
                                </div>
                            </div>
                            <div className="flex flex-col items-start">
                                {/** 최고 */}
                                <div className="text-xs text-gray-600 dark:text-gray-200">
                                    <span className="text-red-500 font-bold mr-1">최고</span>
                                    {weather.tmx}℃
                                </div>
                                {/** 최저 */}
                                <div className="text-xs text-gray-600 dark:text-gray-200">
                                    <span className="text-blue-500 font-bold mr-1">최저</span>
                                    {weather.tmn}℃
                                </div>
                                {/** 습도 */}
                                <div className="text-xs text-gray-600 dark:text-gray-200">
                                    <span className="text-blue-400 font-bold mr-1">습도</span>
                                    {weather.humidity}%
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // 에러 표시
                    <div className="flex flex-col items-center">
                        <div className="relative w-64 h-64 -mt-10">
                            <Image
                                src={'/icons/smoke.svg'}
                                alt='weather api fetch failed'
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex items-center gap-2 w-[12rem] mx-auto text-xs text-red-500 border-2 border-red-500 border-dashed justify-center bg-red-50 p-2 -mt-5">
                            <svg className="w-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M13 1h-2v2H9v2H7v2H5v2H3v2H1v2h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h-2V9h-2V7h-2V5h-2V3h-2V1zm0 2v2h2v2h2v2h2v2h2v2h-2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2H3v-2h2V9h2V7h2V5h2V3h2zm0 4h-2v6h2V7zm0 8h-2v2h2v-2z" fill="currentColor"/> </svg>
                            <span className="a">{errorMsg || "날씨 정보 조회 실패"}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}