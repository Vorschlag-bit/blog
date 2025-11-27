import { userAgent } from "next/server";

export default function robots() {
    return {
        rules: {
            // 모든 로봇에게 허용
            userAgent: '*', 
            // 모든 페이지 허용
            allow: '*',
            // (예시) 특정 페이지는 막고 싶을 때
            disallow: '/private',
        },
        // sitemap을 만들어줘야 로봇이 길을 안 헤맨다
        sitemap: `https://vorschlag-blog.vercel.app/sitemap.xml`
    }
}