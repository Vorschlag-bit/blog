import Link from "next/link";

export default function Pagination({ currentPage, totalPages }) {
    // 페이지 번호 배열 만들기
    const pages = Array.from({ length: totalPages }, (_, i) => i+1);

    return (
        <div className="flex justify-center items-center gap-2 mt-7">
            {/** 이전 버튼 */}
            {currentPage > 1 ? (
                <Link
                    href={`/?page=${currentPage - 1}`}
                    className="px-3 py-1 border-2 border-black dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                    &lt; PREV
                </Link>
            ) : (
                <span className="px-3 py-1 border-2 border-gray-300 text-gray-300 cursor-not-allowed">
                    &lt; PREV
                </span>
            )}
            {/** 페이지 번호들*/}
            <div>
                {pages.map((p) => (
                    <Link
                        key={p}
                        href={`/?page=${p}`}
                        className={`px-3 py-1 border-2
                            ${p == currentPage 
                                ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-800'
                                : 'border-black dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        {p}
                    </Link>
                ))}
            </div>
            {/** 이후 버튼 */}
            {currentPage < totalPages ? (
                <Link
                    href={`/?page=${currentPage + 1}`}
                    className="px-3 py-1 border-2 border-black dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                    NEXT &gt;
                </Link>
            ) : (
                <span className="px-3 py-1 border-2 border-gray-300 text-gray-300 cursor-not-allowed">
                    NEXT &gt;
                </span>
            )}
        </div>
    )
}