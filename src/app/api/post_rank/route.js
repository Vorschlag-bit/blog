import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
})

export async function POST(postInfo) {
    // Sorted Set에 넣을 Post 객체
    
    // zadd, 궁금한 점 Sorted Set의 객체는 주솟값을 바탕으로 판별하나? 그렇다면 매번 새로운 객체를 넣는데
    // 어떻게 해야 할지
    const pipeline = redis.pipeline()
    pipeline.zadd(postInfo)

    // get은 캐시(unstable_cache)
    const getRank = unstable_cache(async(postInfo) => {
        // zrange 사용법
        const res = redis.zrange()

        return {

        }
    },
    ['post_ranking'],
    // 캐시 1시간
    { revalidate: 3600 });

    const res = await getRank(postInfo)

    return NextResponse.json({
        // res의 값이 어떻게 생겼는지 알아야 함.
    });
}