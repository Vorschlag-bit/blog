import { dateSortedAllPosts } from "@/lib/posts";

export default async function sitemap() {
    const baseUrl = 'https://vorschlag-blog.vercel.app'

    const posts = dateSortedAllPosts.map((post) => {
        let dateObj;
        try {
            dateObj = new Date(post.date);
            // 만약 날짜가 유효하지 않다면(Invalid Date) 현재 시간으로 설정
            if (isNaN(dateObj.getTime())) {
                dateObj = new Date();
            }
        } catch (e) {
            dateObj = new Date();
        }

        return {
            url: `${baseUrl}/posts/${post.id}`,
            lastModified: dateObj, 
            changeFrequency: 'monthly',
            priority: 0.7, // 게시글은 보통 0.7~0.8
        }
    })

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0, // 메인은 중요하니까 1.0
        },
        ...posts,
    ]
}