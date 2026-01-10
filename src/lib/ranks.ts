import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";
import { dateSortedAllPosts } from "@/lib/posts";
import { RankPostData } from '@/types/post_type'

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
})

// [id] 기반으로 빠르게 찾기 위한 Map
const postMap = new Map(dateSortedAllPosts.map((post) => [post.id, post]))

export const getRank = unstable_cache(
    async(): Promise<RankPostData[]> => {
        // zrange 사용법, key = 말 그대로 데이터 저장을 위한 hash값으로 사용될 key, 점수 내림차순 상위 5개를 조회
        console.log(`unstable cache없어서 redis에 요청함!`);
        
        const topIds = await redis.zrange<string[]>('popular_posts',0,4, { rev: true });

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
        }).filter((item): item is RankPostData => item !== null); // null 아닌 데이터만 filter로 추출
        return rankingData;
    },
    ['post_ranking'],
    // 캐시 1시간
    { revalidate: 3600 }
)

export async function IncrementRank(id: string) {
    try {        
        // Sorted Set에 넣을 id(str)    
        if (!id) {
            throw Error(`wrong type [Id]: ${id}`)
        }
        // rootPath면 continue
        if (id !== '/') {
            console.log(`루트 디렉토리 아니라서 zincrby 실행`);
            // severless 환경에선 await 안 쓰면 서버가 그 전에 죽을 수도
            await redis.zincrby('popular_posts',1,id)
        }

    } catch (err) {
        console.error(`post redis failed`, err);
    }
}