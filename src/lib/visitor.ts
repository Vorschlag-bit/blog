import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
})

interface GetVisitorsResult {
    total: number
    date: number
}

const TOTAL_PREFIX = "blog-visit-total"

// unstable_cache는 함수 인자에 따라 자동으로 별도의 캐싱 (Ip 기반)
export const getCachedCounts = unstable_cache(
    async (dateKey: string): Promise<GetVisitorsResult> => {
        // Pipeline으로 1번의 통신
        const pipeline = redis.pipeline()
        pipeline.get(TOTAL_PREFIX);
        pipeline.scard(dateKey);

        // console.log(`[Redis Read] 캐시가 만료되어 DB에서 새로 조회`);
        const [total, date] = await pipeline.exec<[number | null, number]>();

        return {
            total: total || 0,
            date: date || 0
        };
    },
    ['visitor-counts'],     // 캐시 키(고유한 문자열)
    { revalidate: 3600 }             // 10분 TTL
);