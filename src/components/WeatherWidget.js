"use client"
import { useEffect,useState } from "react"

// 종로 3가 좌표
const SEOUL_CODE = { nx: 37.57, ny: 126.99 }

export default function WeatherWidget() {
    // 초기값 null
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // 날씨 가져오는 함수
    const fetchWeather = () => {
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

            var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
            var queryParams =  '?' + encodeURIComponent('serviceKey') + '=서비스키'; /* Service Key*/
            queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
            queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /* */
            queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
            queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(`${date}`); /* */
            queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent('0600'); /* */
            queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('55'); /* */
            queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('127'); /* */
        } catch (e) {
            
        }
    }
}