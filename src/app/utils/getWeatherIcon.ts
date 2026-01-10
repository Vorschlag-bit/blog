/**
 * @param { number } pty - 강수형태 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 5: 빗방울, 6: 진눈깨비, 7: 눈날림)
 * @param { number } sky - 하늘상태 (1: 맑음, 3: 구름 많음, 4: 흐림)
 * @param { boolean } lgt - 낙뢰여부 (true/false) - 초단기예보 LGT 값 > 0이면 true else false
 * @param { boolean } isNight - 밤 여부 (true/false) - 현재 시간이 17:00 이상이면 true else false
 */
function getWeatherIcon(pty: number, sky: number, lgt: boolean, isNight: boolean) {
    const suffix = isNight ? 'night' : 'day'

    // 1. 낙뢰(LGT)가 최우선
    if (lgt) {
        if (pty === 0 ) return `thunderstorms-${suffix}` // 마늘하늘 벼락
        if (pty === 3 || pty === 7) return `thunderstorms-snow` // 눈 + 벼락
        return 'thunderstorms-rain' // 그외에는 비 + 벼락
    }

    // 2. 강수(PTY) > 0일 때
    if (pty > 0) {
        switch(pty) {
            case 1: return 'rain'     // 비
            case 2: return 'sleet'    // 비/눈
            case 3: return 'snow'     // 눈
            case 5: return 'drizzle'  // 빗방울(약한 비)
            case 6: return 'sleet'    // 빗방울/눈날림(진눈깨비)
            case 7: return 'snow'     // 눈날림(눈)
            default: return 'rain'    // 기본은 비
        }
    }

    // 3. 맑음/흐름(SKY)일 때 (PTY == 0)
    switch(sky) {
        case 1: return `clear-${suffix}`            // 맑음 (clear-day, clear-night)
        case 3: return `partly-cloudy-${suffix}`    // 구름많음
        case 4: return `overcast-${suffix}`         // 흐름
        default: return `clear-${suffix}`
    }
}