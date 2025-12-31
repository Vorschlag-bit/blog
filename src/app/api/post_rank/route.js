import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { dateSortedAllPosts } from "@/lib/posts";

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
})

// [id] 기반으로 빠르게 찾기 위한 Map
const postMap = new Map(dateSortedAllPosts.map((post) => [post.id, post]))

const getRank = unstable_cache(async(id) => {
        // zrange 사용법, key = 말 그대로 데이터 저장을 위한 hash값으로 사용될 key, 점수 내림차순 상위 5개를 조회
        const topIds = await redis.zrange('popular_posts',0,4, { rev: true });

        if (topIds.length === 0) return [];

        const rankingData = topIds.map(id => {
            const post = postMap.get(id)
            // 없을 경우엔 null
            if (!post) return null;

            return {
                id: post.id,
                title: post.title,
                date: post.date
            }
        }).filter(item => item !== null); // null 아닌 데이터만 filter로 추출
        return rankingData;
    },
    ['post_ranking'],
    // 캐시 1시간
    { revalidate: 3600 }
);

export async function POST(request) {
    try {        
        // Sorted Set에 넣을 id(str)
        const { id } = await request.json()
    
        if (!id) return NextResponse.json({ error: 'ID is required' },{ status: '400' })
        // zincreby로 조회 수 1 증가, await 안 써서 promise 필요 없음
        redis.zincrby('popular_posts',1,id)
    
        // get은 캐시(unstable_cache)
        const res = await getRank(id)
    
        return NextResponse.json(res);
    } catch (err) {
        console.error(`post redis failed`, err);
        throw Error(err.error);
    }
}