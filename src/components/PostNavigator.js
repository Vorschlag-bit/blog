import Link from 'next/link';

export default function PostNavigator({ prev, next }) {
    return (
        <div className="flex w-full gap-2 lg:gap-4 mt-8 lg:mt-10 lg:mb-8">
            {/* 이전 글 (Prev) */}
            {prev ? (
                <PostCard post={prev} type="prev" />
            ) : (
                <div className="flex-1 invisible" />
            )}

            {/* 다음 글 (Next) */}
            {next ? (
                <PostCard post={next} type="next" />
            ) : (
                <div className="flex-1 invisible" />
            )}
        </div>
    );
}

function PostCard({ post, type }) {
    const isNext = type === 'next';

    return (
        <Link 
            href={`/posts/${post.id}`} 
            className="flex-1 min-w-0 group"
        >
            <div className={`
                h-full p-2 lg:p-4 rounded-lg
                bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-200
                flex items-center gap-4
                ${isNext ? 'flex-row-reverse text-right' : 'flex-row text-left'}
            `}>
                
                {/* 1. 아이콘 (원형 테두리) */}
                <div className={`
                    flex items-center justify-center w-7 h-7 lg:w-10 lg:h-10 rounded-full border-2 shrink-0
                    border-blue-500 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors
                    ${!isNext && 'rotate-180'} /* Prev일 때 화살표 180도 회전 */
                `}>
                    {/* SVG 삽입 */}
                    <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> 
                        <path d="M6 4h2v2h2v2h2v2h2v4h-2v2h-2v2H8v2H6V4zm12 0h-2v16h2V4z" fill="currentColor"/> 
                    </svg>
                </div>

                {/* 2. 텍스트 정보 */}
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-gray-500 mb-1">
                        {isNext ? '다음 포스트' : '이전 포스트'}
                    </span>
                    <h3 className="text-sm lg:text-base font-bold text-gray-800 dark:text-gray-100 truncate">
                        {post.title}
                    </h3>
                </div>

            </div>
        </Link>
    );
}