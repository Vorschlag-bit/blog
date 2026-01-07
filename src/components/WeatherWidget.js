"use client"
import { useEffect,useState } from "react"

export default function WeatherWidget({ initialData,children }) {
    // 초기값 null
    const [weather, setWeather] = useState(null);
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
                // 성공 시, 내 위치로 api 다시 호출
                const { latitude, longitude } = position.coords;
                // cache hit 관측을 위해 애초에 클라이언트에서 소수점 3자리(버림)으로 params 보내기
                const lat = latitude.toFixed(3)
                const lng = longitude.toFixed(3)
                let locationName = "내 위치"

                try {
                    const queryParams = new URLSearchParams({
                    lng: lng,
                    lat: lat
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
        <div className="retro-box p-4 w-[130%] -ml-2 min-h-[160px] relative">
            {/** Header */}
            <div className="flex justify-between items-center border-b-2 border-black/15 dark:border-white/15 pb-2">
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
            <div className="flex justify-center min-h-[100px]">
                {loading ? (
                    // 로딩 중일 때
                    <div className="animate-pulse text-lg font-bold dark:text-white-500 mt-15">SEARCHING...</div>
                ) : weather ? (
                    // 날씨 정보 표시
                    <div className="flex flex-col">
                        <div className="relative w-50 h-50 flex-shrink-0 drop-shadow-sm">
                            {children}
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
                    <div className="text-xs text-red-500 mt-5 text-center bg-red-50 p-2 h-9">
                        {errorMsg || "날씨 정보 없음"}
                    </div>
                )}
            </div>
        </div>
    )
}