import { userAgent } from "next/server";

export default function robots() {
    const baseUrl = `https://vorschlag-blog.vercel.app`
    return {
        rules: [
            {
                // 구글 크롤러 규칙
                userAgent: 'Googlebot', 
                // 모든 페이지 허용
                allow: [
                    '/',
                    '/posts/*'
                ],
                // (예시) 특정 페이지는 막고 싶을 때
                disallow: [
                    '/private/*'
                ],
            },
            {
                // 다른 크롤러 규칙
                userAgent: '*',
                allow: [
                    '/',
                    '/posts/*'
                ],
                disallow: [
                    '/private/*'
                ]
            }
        ],
        // sitemap을 만들어줘야 로봇이 길을 안 헤맨다
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl
    }
}