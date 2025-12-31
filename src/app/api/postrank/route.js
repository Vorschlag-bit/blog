import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
})

export async function POST({ path }) {
    // Sorted Set에 넣을 Post 객체
    const post_obj = {
        
    }
}