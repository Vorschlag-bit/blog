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
    const Ip = request.ip;

    // 2. 오늘 날짜 계산
    const now = new Date();
    const kstAbs = now.getTime() + (9 * 60 * 60 * 1000);
    const today = new Date(kstAbs);
    const tomorrow = today.setUTCDate(today.getUTCDate() + 1).setUTCHours(0).setUTCMinutes(0);
    const iso = today.toISOString().slice(0,10).replace(/-/g, "");
    
    console.log("오늘 날짜(Num): ", today);
    console.log("오늘 날짜(Num): ", today);
    console.log("오늘 남은 시간(tom - tod): ", tomorrow - today);
    console.log("오늘 날짜(iso): ", iso);
    

    // 3. 일일 방문자 수
    const dateKey = `${DATE_PREFIX}:${iso}`
    const isNew = await Redis.sadd(dateKey, `${Ip}`);
    console.log(`새로운 일일 방문자인지 확인: ${isNew}`);
    


    // 4. 전체 방문자 수
    // 해당 일일 방문이 유니크하면 INCR
    if (isNew === 1) {
        const currentTotal = await Redis.incr(TOTAL_PREFIX)
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