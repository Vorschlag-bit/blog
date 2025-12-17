import Link from "next/link";

export default function PostNavigator({ prev,next }) {
    return (
        <div className="mt-8 flex w-full gap-4 ">
            {/* 이후 글 */}
            {prev ? (
                <PostCard post={prev} type="prev" />
            ) : (
                // 없을 경우 invisible로 자리만 차지
                <div className="flex-1 invisible" />
            )}
            {/* 이전 글 */}
            {next ? (
                <PostCard post={next} type="next" />
            ) : (
                <div className="flex-1 invisible" />
            )}
        </div>
    )
}

function PostCard({ post,type }) {
    // type이 'next'면 텍스를 오른쪽 정렬할지 선택
    const isNext = type === "next";
    return (
        <Link
            href={`/posts/${post.id}`}
            // flex-1 = 50% 공간 차지
            className="flex-1 min-w-0 group"
        >
            <div className={`
                h-full p-4 border-2 border-black dark:border-gray-500
                bg-white dark:bg-gray-900
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
                transition-transform hover:-translate-y-1 
                flex items-center gap-3
                ${isNext 
                    ? `flex-row-reverse` 
                    : `flex-row`}
            `}>
                {/* 상단: 날짜/라벨 */}
                <div className={``}>
                    <span className="font-bold text-gray-400 uppercase shrink-0">
                        {isNext ? 'Next >' : '< Prev'}
                    </span>
                </div>
                {/* 제목: 말 줄임표 */}
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 font-[Galmuri9] truncate">
                    {post.title}
                </h3>
            </div>
        </Link>
    )
}