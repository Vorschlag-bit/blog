"use client"
import { useEffect,useState } from "react"

// 종로 3가 좌표
const SEOUL_CODE = { nx: '60', ny: '127' }

export default function WeatherWidget() {
    // 초기값 null
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // 날씨 가져오는 함수
    const fetchWeather = async (nx,ny) => {
        setLoading(true)
        setErrorMsg("")
        try {
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
            const kstGap = 9 * 60 * 60 * 1000;
            const today = new Date(utc + kstGap);

            // 40분 이전에 요청할 경우 1시간 이전의 데이터 요청
            if (today.getMinutes() < 40) {
                today.setHours(today.getHours() - 1);
            }

            const baseDate = today.toISOString().slice(0,10).replace(/-/g, "") // 20251201
            const baseTime = today.toISOString().slice(11,13) + "00" // 1300

            const queryParams = new URLSearchParams({
                base_date: baseDate,
                base_time: baseTime,
                nx: nx,
                ny: ny
            });

            // 이제 블로그 API 주소로 변경됌
            const res = await fetch(`/api/weather?${queryParams.toString()}`)
            const data = await res.json()

            setWeather(data)
        } catch (e) {
            console.debug(e)
        }
    }

    
}