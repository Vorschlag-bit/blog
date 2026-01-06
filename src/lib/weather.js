"use server"

import { dfs_xy_conv } from "@/app/utils/positionConverter"

/**
 * 좌표(x,y)를 기반으로 기상청 API를 호출하고 return 받은 걸 그대로 return 하는 함수입니다.
 * type이 'xy'인 경우에는 그대로 사용하고, 위/경도일 경우에는 입력받은 x가 위도(latitude), y는 경도(longitude)
 * 이고, dfs_xy_conv() 함수를 통해 x,y 좌표로 변환한 후에 사용합니다.
 * @param { number } x,
 * @param { number } y,
 * @param { string } type,
 */
export default function getWeather({ x, y, type="xy" }) {
    let nx = x
    let ny = y
    if (type !== "xy") {
        const { lat,lng } = dfs_xy_conv("toXY",x,y)
        nx = lat
        ny = lng
    }

    // 날짜 계산
    const { baseDate_Fcst,baseTime_Fcst,baseDate_Live,baseTime_Live,baseDate_Srt,baseTime_Srt } = get_currentTime()
    // x,y를 기반으로 날씨 조회
    
}

function get_currentTime() {
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
                    // 시간을 10분 단위로 만들어서 cache hit 높이기
                    time: iso.slice(11, 15).replace(':',"") + "0"
                }
            }

            const liveParams = formatDate(kstDate_Live);
            const fcstParams = formatDate(kstDate_Fcst);
            const srtParams = formatDate(kstDate_Srt);

            return {
                baseDate_Fcst: fcstParams.date,
                baseTime_Fcst: fcstParams.time,
                baseDate_Live: liveParams.date,
                baseTime_Live: liveParams.time,
                baseDate_Srt: srtParams.date,
                baseTime_Srt: srtParams.time
            }
}