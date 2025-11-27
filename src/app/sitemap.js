import { getSortedPostsData } from "@/lib/posts"; // 게시글 데이터 가져오는 함수

export default async function sitemap() {
    // 본인 도메인
    const baseUrl = 'https://vorschlag-blog.vercel.app'

    // 1. 블로그의 모든 게시글 가져오기
    const allPosts = getSortedPostsData()

    // 2. 게시글 url 목록 만들기
    const posts = allPosts.map((post) => ({
        url: `${baseUrl}/posts/${post.id}`,
        lastModified: new Date(post.date),
    }))

    // 3. 메인 페이지와 게시글 목록을 합쳐서 반환
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        ...posts,
    ]
}