import { getPostData,dateSortedAllPosts } from "@/lib/posts";
import RetroWindow from "@/components/main/RetroWindow";
import Comments from "@/components/main/Comments";
import CodeBlockManager from "@/components/main/CodeBlockManager";
import PostRemoteControl from "@/components/main/PostRemoteController";
import Link from "next/link";
// 현재 id를 기반으로 이전,이후 글 정보를 가져오는 함수
import { getPreNextPost } from "@/lib/posts";
import PostNavigator from "@/components/page/PostNavigator";
// hash 존재 시, 스크롤 이동하도록 만드는 함수
// mermaid Util
import MermaidInit from "@/app/utils/mermaidInit";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PostContent from "@/components/main/PostContent";
import ScrollButton from "@/components/main/ScrollButton";
// 조회 수 증가하는 client 컴포넌틍 추가
import ViewCounter from "@/components/main/ViewCounter";

// Params Interface 정의
interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return dateSortedAllPosts.map((post) => ({
        id: post.id
    }))
}

export const dynamicParams = false;

// 동적 메타데이터 생성 함수
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const post = await getPostData(id)

    if(!post) return {}

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
export default async function Post({ params }: PageProps) {
    // 1. params는 Promise라서 await로 기다려야 함
    const { id } = await params
    // 2. id를 바탕으로 데이터 구하기
    const postData = await getPostData(id)

    if (!postData) notFound();

    const { prev,next } = await getPreNextPost(id)

    return (
        <article className="max-w-4xl mx-auto md:px-2 xl:p-4 relative">
            {/* mermaidUtil 추가 */}
            <MermaidInit />
            {/* viewactions 추가 (redis 호출하는 server action 호출하는 클라이언트 컴포넌트) */}
            <ViewCounter id={id} />
            <PostRemoteControl />
            <ScrollButton />
                <RetroWindow title={`Reading: ${postData.title}.txt`} className="">
                    <h1 className="md:text-2xl lg:text-3xl font-bold md:mb-4 md:mt-2 lg:mt-0 flex items-start gap-3">
                        <Link href={`/categories/${postData.category}`} prefetch={false}
                            className="shrink-0 bg-blue-600 text-white text-sm lg:text-xl lg:mr-3 font-medium px-2 py-1 border-2 border-blue-200 hover:underline cursor-pointer dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                            {postData.category}
                        </Link>
                        {postData.title}
                    </h1>
                    <p className="text-xs md:text-base text-gray-600 lg:mb-8 mb-3">{postData.date}</p>
                    {/** 3. HTML 문자열을 실제 HTML로 랜더링하는 리액트 문법 */}
                    {/** React는 보안 떄문에 HTML 태그를 보여주지 않고 글자 그대로 보여줌, 그걸 무시하기 위한 문법 */}
                    <div className="prose prose-sm md:prose-lg dark:prose-invert">
                        <PostContent htmlContent={postData.htmlContent} />
                    </div>
                    {/** CodeBlockManager 추가 */}
                    <CodeBlockManager />
                    {/* 이전/이후 글 Navigator 추가 */}
                    <PostNavigator prev={prev} next={next} />
                    {/** 4. 맨 밑에 댓글 컴포넌트 추가 */}
                    <Comments />
                </RetroWindow>
        </article>
    )
}