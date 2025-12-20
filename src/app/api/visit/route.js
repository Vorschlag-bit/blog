import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
})

const DATE_PREFIX = "blog-visit-date"
const TOTAL_PREFIX = "blog-visit-total"

// unstable_cache는 함수 인자에 따라 자동으로 별도의 캐싱 (Ip 기반)
const getCachedCounts = unstable_cache(
    async (dateKey) => {
        // Pipeline으로 1번의 통신
        const pipeline = redis.pipeline()
        pipeline.get(TOTAL_PREFIX);
        pipeline.scard(dateKey);

        console.log(`[Redis Read] 캐시가 만료되어 DB에서 새로 조회`);
        const [total, date] = await pipeline.exec();

        return {
            total: total || 0,
            date: date || 0
        };
    },
    ['visitor-counts'],     // 캐시 키(고유한 문자열)
    { revalidate: 600 }             // 10분 TTL
);

// INCR을 통해서 값 return받을 걸 그대로 response로 보내줄 예정
export async function POST(request) {
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

    // console.log("오늘 날짜(iso): ", iso);
    // console.log("내일 날짜(iso): ", tomorrow.toISOString());
    // console.log("오늘 남은 시간(sec): ", diff);

    // 3. 일일 방문자 수
    const dateKey = `${DATE_PREFIX}:${iso}`

    // 조회를 먼저 하고 중복이 아닐 경우 incr,sadd 추가
    let { total, date: todayCount } = await getCachedCounts(dateKey)

    const isNew = await redis.sadd(dateKey, Ip);
    console.log(`새로운 일일 방문자인지 확인: ${isNew}`);

    // 4. 전체 방문자 수
    // 해당 일일 방문이 유니크하면 INCR
    if (isNew === 1) {
        const writePipe = redis.pipeline();
        writePipe.incr(TOTAL_PREFIX);
        writePipe.expire(dateKey, diff);
        await writePipe.exec();
    }

    return NextResponse.json({
        total: total,
        date: todayCount
    });
}