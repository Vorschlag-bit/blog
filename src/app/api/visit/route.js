import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// INCR을 통해서 값 return받을 걸 그대로 response로 보내줄 예정
export async function POST(request) {
    const DATE_PREFIX = "blog-visit-date"
    const TOTAL_PREFIX = "blog-visit-total"
    const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    })

    // 1. 유저 Ip 추출
    let Ip = request.headers.get('x-forwarded-for');
    if (Ip) {
        // 프록시를 거쳐서 여려 Ip가 있을 경우 맨 앞이 사용자의 것
        Ip = Ip.split(',')[0].trim();
    } else {
        console.log(`사용자 ip가 없음`);
        Ip = '127.0.0.1';
    }

    // 2. 오늘 날짜 계산
    const now = new Date();
    const kstAbs = now.getTime() + (9 * 60 * 60 * 1000);
    const today = new Date(kstAbs);
    const iso = today.toISOString().slice(0,10).replace(/-/g, "");

    const tomorrow = new Date(kstAbs);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    // 00:00:00
    tomorrow.setUTCHours(0,0,0,0)
    // redis ttl은 '초' 단위이므로, ms -> s
    const diff = Math.floor((tomorrow.getTime() - today.getTime()) / 1000)

    console.log("오늘 날짜(iso): ", iso);
    console.log("내일 날짜(iso): ", tomorrow.toISOString());
    console.log("오늘 남은 시간(sec): ", diff);
    

    // 3. 일일 방문자 수
    const dateKey = `${DATE_PREFIX}:${iso}`
    const isNew = await redis.sadd(dateKey, `${Ip}`);
    console.log(`새로운 일일 방문자인지 확인: ${isNew}`);
    


    // 4. 전체 방문자 수
    // 해당 일일 방문이 유니크하면 INCR
    if (isNew === 1) {
        const currentTotal = await redis.incr(TOTAL_PREFIX)
        // 오늘 날짜 키는 24시간까지 유효
        const diff = tomorrow.getTime() - today.getTime()
        await redis.expire(dateKey, diff)
        console.log(`새로운 전체 방문자인지 확인: ${currentTotal}`);
    }

    // 5. 현재 데이터 조회(pipeline 사용해서 한 번에 여러 명령어 보내기)
    const pipeline = redis.pipeline();
    pipeline.get(TOTAL_PREFIX)      // 전체 방문자 수 조회
    pipeline.scard(dateKey)         // 일일 방문자 수 조회

    const [total, date] = await pipeline.exec();

    return NextResponse.json({
        total: total || 0,
        date: date || 0
    })
}