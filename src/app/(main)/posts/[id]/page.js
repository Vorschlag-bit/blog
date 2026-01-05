import { getPostData } from "@/lib/posts";
import RetroWindow from "@/components/RetroWindow";
import Comments from "@/components/Comments";
import CodeBlockManager from "@/components/CodeBlockManager";
import PostRemoteControl from "@/components/PostRemoteController";
import Link from "next/link";
import PostImageLoader from "@/components/PostImageLoader";
// 현재 id를 기반으로 이전,이후 글 정보를 가져오는 함수
import { getPreNextPost } from "@/lib/posts";
import PostNavigator from "@/components/PostNavigator";
// mermaid Util
import MermaidInit from "@/app/utils/mermaidInit";
// redis zincrby 호출함수
import { IncrementRank } from "@/lib/ranks";


// 동적 메타데이터 생성 함수
export async function generateMetadata({ params }) {
    const { id } = await params
    const post = await getPostData(id)

    const imageUrl = "/images/og-image.png"

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                },
            ]
        },
    }
}

// URL의 [id]부분이 parmas로 들어감
export default async function Post({params}) {
    // 1. params는 Promise라서 await로 기다려야 함
    const { id } = await params
    await IncrementRank(id);
    // 2. id를 바탕으로 데이터 구하기
    const postData = await getPostData(id)

    const { prev,next } = await getPreNextPost(id)

    return (
        <article className="max-w-4xl mx-auto md:px-2 xl:p-4 relative">
            {/* mermaidUtil 추가 */}
            <MermaidInit />
            <PostRemoteControl />
            {/** img 태그 미리 다운로드 체크 확인 컴포넌트 추가 */}
            <PostImageLoader>
                <RetroWindow title={`Reading: ${postData.title}.txt`}>
                    <h1 className="md:text-2xl lg:text-3xl font-bold md:mb-4 md:mt-2 lg:mt-0 flex items-start gap-3">
                        <Link href={`/categories/${postData.category}`}
                            className="shrink-0 bg-blue-600 text-white text-sm lg:text-xl lg:mr-3 font-medium px-2 py-1 border-2 border-blue-200 hover:underline cursor-pointer dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                            {postData.category}
                        </Link>
                        {postData.title}
                    </h1>
                    <p className="text-xs md:text-base text-gray-600 lg:mb-8 mb-3">{postData.date}</p>
                    {/** 3. HTML 문자열을 실제 HTML로 랜더링하는 리액트 문법 */}
                    {/** React는 보안 떄문에 HTML 태그를 보여주지 않고 글자 그대로 보여줌, 그걸 무시하기 위한 문법 */}
                    <div
                    className="prose prose-sm md:prose-lg dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: postData.htmlContent}}
                    />
                    {/** CodeBlockManager 추가 */}
                    <CodeBlockManager />
                    {/* 이전/이후 글 Navigator 추가 */}
                    <PostNavigator prev={prev} next={next} />
                    {/** 4. 맨 밑에 댓글 컴포넌트 추가 */}
                    <Comments />
                </RetroWindow>
            </PostImageLoader>
        </article>
    )
}