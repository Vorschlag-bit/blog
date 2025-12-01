import { getPostData } from "@/lib/posts";
import RetroWindow from "@/components/RetroWindow";
import Comments from "@/components/Comments";
import CodeBlockManager from "@/components/CodeBlockManager";
import PostRemoteControl from "@/components/PostRemoteController";
import Link from "next/link";

// 동적 메타데이터 생성 함수
export async function generateMetaData({ params }) {
    const { id } = await params
    const post = await getPostData(id)

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            images: [
                {
                    url: "/Users/a./Downloads/og-image.png",
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

    // 2. id를 바탕으로 데이터 구하기
    const postData = await getPostData(id)

    return (
        <article className="max-w-4xl mx-auto p-4 relative">
            <PostRemoteControl />
            <RetroWindow title={`Reading: ${postData.title}.txt`}>
                <h1 className="text-3xl font-bold mb-4 flex items-center">
                    <Link href={`/categories/${postData.category}`}
                        className="bg-blue-600 text-white text-xl mr-3 font-medium px-2 py-1 border-2 border-blue-200 hover:underline cursor-pointer dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                        {postData.category}
                    </Link>
                    {postData.title}
                </h1>
                <p className="text-gray-600 mb-8">{postData.date}</p>
                {/** 3. HTML 문자열을 실제 HTML로 랜더링하는 리액트 문법 */}
                {/** React는 보안 떄문에 HTML 태그를 보여주지 않고 글자 그대로 보여줌, 그걸 무시하기 위한 문법 */}
                <div
                className="prose prose-lg dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: postData.htmlContent}}
                />
                {/** CodeBlockManager 추가 */}
                <CodeBlockManager />
                {/** 4. 맨 밑에 댓글 컴포넌트 추가 */}
                <Comments />
            </RetroWindow>
        </article>
    )
}